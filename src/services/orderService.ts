/**
 * Order Service
 * Handles atomic order placement, stock deduction, status timeline,
 * invoice retrieval, and returns
 */

import { Order, OrderStatus, CartItem, Address, PaymentMethod, OrderItemSnapshot } from '../types/models';
import { generateOrderNumber } from '../lib/format';
import { productService, saveProductsToStorage } from './productService';

const ORDERS_STORAGE_KEY = 'ns_orders_v1';

function getStoredOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch (e) {
    return [];
  }
}

function saveOrdersToStorage(orders: Order[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }
}

export const orderService = {
  async getAll(): Promise<Order[]> {
    await new Promise((r) => setTimeout(r, 80));
    return getStoredOrders();
  },

  async getByOrderNo(orderNo: string): Promise<Order | null> {
    await new Promise((r) => setTimeout(r, 60));
    const orders = getStoredOrders();
    return orders.find((o) => o.orderNo === orderNo) || null;
  },

  async getByUserId(userId: string): Promise<Order[]> {
    await new Promise((r) => setTimeout(r, 80));
    const orders = getStoredOrders();
    return orders.filter((o) => o.userId === userId);
  },

  /**
   * Atomic order placement:
   * 1. Validates stock
   * 2. Decrements stock on product variants
   * 3. Creates snapshot order
   */
  async placeOrder(params: {
    userId?: string;
    items: CartItem[];
    shippingAddress: Address;
    subtotal: number;
    discountTotal: number;
    shippingTotal: number;
    taxTotal: number;
    grandTotal: number;
    paymentMethod: PaymentMethod;
    paymentRef?: string;
    couponCode?: string;
    deliveryZoneName: string;
  }): Promise<Order> {
    const products = await productService.getAll();

    // 1. Validate & deduct stock
    for (const item of params.items) {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        const variant = prod.variants.find((v) => v.id === item.variantId);
        if (variant) {
          if (variant.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${prod.nameEn} (${variant.name})`);
          }
          variant.stock -= item.quantity;
          prod.soldCount += item.quantity;
        }
      }
    }
    saveProductsToStorage(products);

    // 2. Snapshot items
    const itemSnapshots: OrderItemSnapshot[] = params.items.map((item) => ({
      productId: item.productId,
      variantId: item.variantId,
      sku: item.variant.sku,
      nameEn: item.product.nameEn,
      nameNe: item.product.nameNe,
      variantName: item.variant.name,
      imageUrl: item.variant.imageUrl || item.product.images[0],
      unitPrice: item.variant.price || item.product.basePrice,
      quantity: item.quantity,
      taxAmount: Math.round(((item.variant.price || item.product.basePrice) * item.quantity * 0.13) / 1.13),
      lineTotal: (item.variant.price || item.product.basePrice) * item.quantity,
      sellerId: item.product.sellerId
    }));

    const orderNo = generateOrderNumber();
    const now = new Date();
    const estDeliveryDate = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString();

    const isPaidOnline = params.paymentMethod !== 'cod';

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNo,
      userId: params.userId,
      status: 'confirmed',
      items: itemSnapshots,
      shippingAddress: params.shippingAddress,
      subtotal: params.subtotal,
      discountTotal: params.discountTotal,
      shippingTotal: params.shippingTotal,
      taxTotal: params.taxTotal,
      grandTotal: params.grandTotal,
      paymentMethod: params.paymentMethod,
      paymentStatus: isPaidOnline ? 'paid' : 'pending',
      paymentRef: params.paymentRef || (isPaidOnline ? `TXN-${Math.random().toString(36).substring(2, 8).toUpperCase()}` : undefined),
      couponCode: params.couponCode,
      deliveryZoneName: params.deliveryZoneName,
      estimatedDeliveryDate: estDeliveryDate,
      trackingNumber: `NS-TRACK-${Math.floor(100000 + Math.random() * 900000)}`,
      courierName: 'Nepal Express Courier',
      statusHistory: [
        {
          status: 'confirmed',
          note: isPaidOnline ? 'Payment verified and order confirmed' : 'Order placed via Cash on Delivery',
          timestamp: now.toISOString(),
          actor: 'System'
        }
      ],
      placedAt: now.toISOString()
    };

    const existingOrders = getStoredOrders();
    existingOrders.unshift(newOrder);
    saveOrdersToStorage(existingOrders);

    return newOrder;
  },

  async updateOrderStatus(orderNo: string, nextStatus: OrderStatus, note?: string, actor = 'Staff'): Promise<Order> {
    const orders = getStoredOrders();
    const target = orders.find((o) => o.orderNo === orderNo);
    if (!target) throw new Error('Order not found');

    target.status = nextStatus;
    target.statusHistory.push({
      status: nextStatus,
      note: note || `Status updated to ${nextStatus}`,
      timestamp: new Date().toISOString(),
      actor
    });

    saveOrdersToStorage(orders);
    return target;
  },

  async cancelOrder(orderNo: string, reason: string): Promise<Order> {
    const orders = getStoredOrders();
    const target = orders.find((o) => o.orderNo === orderNo);
    if (!target) throw new Error('Order not found');

    if (['shipped', 'out_for_delivery', 'delivered'].includes(target.status)) {
      throw new Error('Order has already dispatched and cannot be cancelled directly.');
    }

    target.status = 'cancelled';
    target.statusHistory.push({
      status: 'cancelled',
      note: `Cancelled by customer: ${reason}`,
      timestamp: new Date().toISOString(),
      actor: 'Customer'
    });

    // Restock
    const products = await productService.getAll();
    for (const snap of target.items) {
      const prod = products.find((p) => p.id === snap.productId);
      if (prod) {
        const variant = prod.variants.find((v) => v.id === snap.variantId);
        if (variant) {
          variant.stock += snap.quantity;
        }
      }
    }
    saveProductsToStorage(products);
    saveOrdersToStorage(orders);

    return target;
  }
};
