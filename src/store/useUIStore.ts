import { create } from 'zustand';
import { Product } from '../types/models';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export type ActivePage =
  | 'home'
  | 'catalog'
  | 'product_detail'
  | 'cart'
  | 'checkout'
  | 'order_success'
  | 'track_order'
  | 'account'
  | 'seller_center'
  | 'seller_store'
  | 'admin_panel'
  | 'bazaar'
  | 'bazaar_detail'
  | 'deals'
  | 'brand_store'
  | 'compare'
  | 'collections'
  | 'about'
  | 'faq'
  | 'contact'
  | 'auth'
  | 'brand_portal'
  | 'helper_portal'
  | 'staff_login'
  | 'staff_profile';

interface UIState {
  currentPage: ActivePage;
  currentProductSlug: string | null;
  currentCategorySlug: string | null;
  currentOrderNo: string | null;
  currentAdId: string | null;
  searchQuery: string;
  isMobileNavOpen: boolean;
  quickViewProduct: Product | null;
  toasts: ToastMessage[];
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  authModalTab: 'password' | 'phone';

  // Navigation actions
  navigate: (
    page: ActivePage,
    params?: { productSlug?: string; categorySlug?: string; orderNo?: string; adId?: string; search?: string }
  ) => void;
  setSearchQuery: (query: string) => void;
  setMobileNavOpen: (open: boolean) => void;
  setQuickViewProduct: (product: Product | null) => void;
  openAuthModal: (mode?: 'login' | 'signup', tab?: 'password' | 'phone') => void;
  closeAuthModal: () => void;
  setAuthModalMode: (mode: 'login' | 'signup') => void;
  setAuthModalTab: (tab: 'password' | 'phone') => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  currentPage: 'home',
  currentProductSlug: null,
  currentCategorySlug: null,
  currentOrderNo: null,
  currentAdId: null,
  searchQuery: '',
  isMobileNavOpen: false,
  quickViewProduct: null,
  toasts: [],
  isAuthModalOpen: false,
  authModalMode: 'login',
  authModalTab: 'password',

  openAuthModal: (mode = 'login', tab = 'password') =>
    set({ isAuthModalOpen: true, authModalMode: mode, authModalTab: tab }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  setAuthModalMode: (mode) => set({ authModalMode: mode }),
  setAuthModalTab: (tab) => set({ authModalTab: tab }),

  navigate: (page, params = {}) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (typeof window !== 'undefined') {
      window.location.hash = `#/${page}`;
    }
    set({
      currentPage: page,
      currentProductSlug: params.productSlug || null,
      currentCategorySlug: params.categorySlug || null,
      currentOrderNo: params.orderNo || null,
      currentAdId: params.adId || null,
      searchQuery: params.search !== undefined ? params.search : '',
      isMobileNavOpen: false
    });
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setMobileNavOpen: (open) => set({ isMobileNavOpen: open }),
  setQuickViewProduct: (product) => set({ quickViewProduct: product }),

  showToast: (message, type = 'success') => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    set((state) => ({ toasts: [...state.toasts, { id, type, message }] }));

    // Auto dismiss after 3.5s
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3500);
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  }
}));
