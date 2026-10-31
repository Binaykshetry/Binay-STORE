import { create } from 'zustand';
import { CartItem, Product, ProductVariant, Coupon } from '../types/models';
import { SEED_PRODUCTS, SEED_COUPONS } from '../mocks/seed-data';
import { getDeliveryZoneForDistrict } from '../lib/nepal-geo';

interface CartState {
  items: CartItem[];
  appliedCoupon: Coupon | null;
  isMiniCartOpen: boolean;
  selectedDistrict: string;

  // Actions
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  setMiniCartOpen: (open: boolean) => void;
  setSelectedDistrict: (district: string) => void;

  // Computed values
  getSubtotal: () => number; // in paisa
  getDiscount: () => number; // in paisa
  getShippingFee: () => number; // in paisa
  getVatAmount: () => number; // in paisa (13%)
  getGrandTotal: () => number; // in paisa
  getItemCount: () => number;
}

const FREE_SHIPPING_THRESHOLD_PAISA = 200000; // Rs. 2,000
const CART_STORAGE_KEY = 'ns_cart_v2';

function getInitialCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(CART_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return [];
    }
  }
  return [];
}

function persistCart(items: CartItem[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }
}

export const useCartStore = create<CartState>((set, get) => {
  const initialItems = getInitialCart();

  return {
    items: initialItems,
    appliedCoupon: null,
    isMiniCartOpen: false,
    selectedDistrict: 'Kathmandu',

    addItem: (product, variant, quantity = 1) => {
      const activeVariant = variant || product.variants[0];
      const currentItems = get().items;
      const existing = currentItems.find(
        (i) => i.productId === product.id && i.variantId === activeVariant.id
      );

      let nextItems: CartItem[];
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, activeVariant.stock);
        nextItems = currentItems.map((i) =>
          i.id === existing.id ? { ...i, quantity: newQty } : i
        );
      } else {
        const newItem: CartItem = {
          id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          productId: product.id,
          variantId: activeVariant.id,
          product,
          variant: activeVariant,
          quantity: Math.min(quantity, activeVariant.stock),
          addedAt: new Date().toISOString()
        };
        nextItems = [...currentItems, newItem];
      }

      persistCart(nextItems);
      set({ items: nextItems, isMiniCartOpen: true });
    },

    updateQuantity: (cartItemId, delta) => {
      const currentItems = get().items;
      const nextItems = currentItems
        .map((item) => {
          if (item.id === cartItemId) {
            const target = item.quantity + delta;
            const maxStock = item.variant.stock;
            if (target <= 0) return null;
            return { ...item, quantity: Math.min(target, maxStock) };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];

      persistCart(nextItems);
      set({ items: nextItems });
    },

    removeItem: (cartItemId) => {
      const nextItems = get().items.filter((i) => i.id !== cartItemId);
      persistCart(nextItems);
      set({ items: nextItems });
    },

    clearCart: () => {
      persistCart([]);
      set({ items: [], appliedCoupon: null });
    },

    applyCoupon: (code) => {
      const normalized = code.trim().toUpperCase();
      const coupon = SEED_COUPONS.find((c) => c.code === normalized && c.isActive);

      if (!coupon) {
        return { success: false, message: 'Invalid or inactive coupon code' };
      }

      // Check expiry date
      if (coupon.endsAt && new Date(coupon.endsAt).getTime() < Date.now()) {
        return { success: false, message: `Coupon ${coupon.code} has expired.` };
      }

      const subtotal = get().getSubtotal();
      if (subtotal < coupon.minSpend) {
        return {
          success: false,
          message: `Minimum spend for ${coupon.code} is Rs. ${(coupon.minSpend / 100).toLocaleString('en-IN')}`
        };
      }

      set({ appliedCoupon: coupon });
      return { success: true, message: `Coupon ${coupon.code} applied successfully!` };
    },

    removeCoupon: () => {
      set({ appliedCoupon: null });
    },

    setMiniCartOpen: (open) => {
      set({ isMiniCartOpen: open });
    },

    setSelectedDistrict: (district) => {
      set({ selectedDistrict: district });
    },

    getSubtotal: () => {
      return get().items.reduce((acc, item) => {
        const price = item.variant.price || item.product.basePrice;
        return acc + price * item.quantity;
      }, 0);
    },

    getDiscount: () => {
      const coupon = get().appliedCoupon;
      if (!coupon) return 0;
      const subtotal = get().getSubtotal();

      if (coupon.type === 'percent') {
        const raw = Math.round((subtotal * coupon.value) / 100);
        return coupon.maxDiscount ? Math.min(raw, coupon.maxDiscount) : raw;
      }
      if (coupon.type === 'fixed') {
        return Math.min(coupon.value, subtotal);
      }
      return 0;
    },

    getShippingFee: () => {
      const subtotal = get().getSubtotal();
      if (subtotal === 0) return 0;

      // Free shipping threshold
      if (subtotal >= FREE_SHIPPING_THRESHOLD_PAISA) return 0;
      if (get().appliedCoupon?.type === 'free_shipping') return 0;

      const zone = getDeliveryZoneForDistrict(get().selectedDistrict);
      return zone.baseRatePaisa;
    },

    getVatAmount: () => {
      // Statutory Nepal 13% VAT (included in the retail selling price)
      const subtotal = get().getSubtotal();
      const discount = get().getDiscount();
      const taxable = Math.max(0, subtotal - discount);
      return Math.round((taxable * 13) / 113);
    },

    getGrandTotal: () => {
      const subtotal = get().getSubtotal();
      if (subtotal === 0) return 0;
      const discount = get().getDiscount();
      const shipping = get().getShippingFee();
      return Math.max(0, subtotal - discount + shipping);
    },

    getItemCount: () => {
      return get().items.reduce((acc, item) => acc + item.quantity, 0);
    }
  };
});
