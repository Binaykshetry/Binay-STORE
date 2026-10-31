/**
 * NepaleseStore - Domain Data Models & Types
 * Conforms to Master Build Plan (Parts 1-7) & Nepal market specifications
 */

export type Role = 'owner' | 'sradmin' | 'brand_manager' | 'helper' | 'user' | 'seller';

export type UserStatus = 'active' | 'suspended' | 'deleted';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: Role;
  accountType?: 'phone' | 'email' | 'business';
  businessName?: string;
  panNumber?: string;
  status: UserStatus;
  language: 'en' | 'ne';
  avatarUrl?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  createdAt: string;
  walletBalance: number; // in paisa (100 paisa = 1 NPR)
}

export interface Address {
  id: string;
  userId: string;
  label: 'Home' | 'Office' | 'Other';
  fullName: string;
  phone: string;
  province: string;
  district: string;
  municipality: string;
  ward: string;
  street: string;
  landmark?: string;
  isDefault: boolean;
}

export interface Category {
  id: string;
  parentId?: string | null;
  nameEn: string;
  nameNe: string;
  slug: string;
  iconName: string;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
  itemCount?: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  isOfficial: boolean;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  name: string; // e.g. "Crimson Red / Large"
  options: Record<string, string>; // e.g. { color: "Crimson", size: "L" }
  price: number; // in paisa
  comparePrice?: number; // original strike-through price in paisa
  stock: number;
  reserved: number;
  imageUrl?: string;
}

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  sellerVerified: boolean;
  categoryId: string;
  categorySlug: string;
  brandId?: string;
  brandName?: string;
  nameEn: string;
  nameNe: string;
  slug: string;
  shortDescEn: string;
  shortDescNe: string;
  descriptionEn: string;
  descriptionNe: string;
  status: 'draft' | 'pending' | 'published' | 'rejected' | 'archived';
  condition: 'new' | 'used';
  isNepaliCraft?: boolean;
  isFlashDeal?: boolean;
  flashDealEnd?: string;
  basePrice: number; // in paisa
  comparePrice?: number; // in paisa
  images: string[];
  attributes: ProductAttribute[];
  variants: ProductVariant[];
  ratingAvg: number;
  ratingCount: number;
  soldCount: number;
  viewCount: number;
  weightGrams: number;
  codAvailable: boolean;
  warrantyPeriod?: string;
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  savedForLater?: boolean;
  addedAt: string;
}

export type OrderStatus =
  | 'pending_payment'
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'return_requested'
  | 'returned'
  | 'refunded';

export type PaymentMethod = 'cod' | 'esewa' | 'khalti' | 'fonepay' | 'bank' | 'wallet';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItemSnapshot {
  productId: string;
  variantId: string;
  sku: string;
  nameEn: string;
  nameNe: string;
  variantName: string;
  imageUrl: string;
  unitPrice: number; // in paisa
  quantity: number;
  taxAmount: number; // in paisa
  lineTotal: number; // in paisa
  sellerId: string;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  note: string;
  timestamp: string;
  actor: string;
}

export interface Order {
  id: string;
  orderNo: string; // NS-YYYYMMDD-XXXXX
  userId?: string;
  guestEmail?: string;
  guestPhone?: string;
  status: OrderStatus;
  items: OrderItemSnapshot[];
  shippingAddress: Address;
  subtotal: number; // in paisa
  discountTotal: number; // in paisa
  shippingTotal: number; // in paisa
  taxTotal: number; // in paisa (VAT 13%)
  grandTotal: number; // in paisa
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentRef?: string;
  couponCode?: string;
  deliveryZoneName: string;
  estimatedDeliveryDate: string;
  trackingNumber?: string;
  courierName?: string;
  statusHistory: OrderStatusHistory[];
  placedAt: string;
}

export interface Coupon {
  code: string;
  type: 'percent' | 'fixed' | 'free_shipping';
  value: number; // percent value (e.g. 10) or paisa (e.g. 20000 = Rs 200)
  minSpend: number; // in paisa
  maxDiscount?: number; // in paisa
  usageLimit: number;
  usedCount: number;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  descriptionEn: string;
  descriptionNe: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  sellerReply?: string;
  createdAt: string;
}

export interface ProductQuestion {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  question: string;
  answer?: string;
  answeredBy?: string;
  createdAt: string;
}

export interface Seller {
  id: string;
  userId: string;
  storeName: string;
  slug: string;
  logoUrl?: string;
  bannerUrl?: string;
  description: string;
  status: 'pending' | 'approved' | 'suspended';
  commissionRate: number; // e.g. 8%
  panNumber: string;
  businessType: 'individual' | 'registered_company';
  ratingAvg: number;
  totalOrders: number;
  holidayMode: boolean;
  phone: string;
  city: string;
  createdAt: string;
}

export interface SellerLedgerEntry {
  id: string;
  sellerId: string;
  orderNo: string;
  type: 'sale' | 'commission' | 'payout' | 'refund';
  amount: number; // in paisa (+ or -)
  balanceAfter: number;
  note: string;
  createdAt: string;
}

export interface Banner {
  id: string;
  titleEn: string;
  titleNe: string;
  subtitleEn?: string;
  subtitleNe?: string;
  imageUrl: string;
  linkUrl: string;
  badgeEn?: string;
  badgeNe?: string;
  bgColor: string;
  textColor: string;
  isActive: boolean;
}

// Bazaar / Classifieds Model (Hamrobazar style)
export interface ClassifiedAd {
  id: string;
  userId: string;
  sellerName: string;
  sellerPhone: string;
  sellerVerified: boolean;
  category: 'vehicles' | 'properties' | 'mobiles' | 'electronics' | 'home' | 'jobs';
  title: string;
  slug: string;
  description: string;
  price: number; // in paisa
  isNegotiable: boolean;
  condition: 'Brand New' | 'Like New' | 'Used / Fair';
  province: string;
  district: string;
  area: string;
  images: string[];
  phoneVisible: boolean;
  phoneRevealCount: number;
  fields: Record<string, string>; // e.g. Year, Mileage, Floor, Storage
  status: 'active' | 'pending' | 'sold' | 'expired';
  promoType?: 'top' | 'featured' | 'urgent';
  views: number;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  role: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  timestamp: string;
}
