import { create } from 'zustand';
import { User, Address, Role } from '../types/models';
import { SEED_USERS, SEED_DEFAULT_ADDRESS } from '../mocks/seed-data';
import { authService, SignupPayload, setAuthToken } from '../services/authService';

interface AuthState {
  currentUser: User | null;
  savedAddresses: Address[];
  wishlistProductIds: string[];
  isAuthenticated: boolean;
  loginAs: (role: Role | 'guest') => void;
  setUser: (user: User | null) => void;
  loginWithCredentials: (identifier: string, pass: string) => Promise<User>;
  signupWithCredentials: (payload: SignupPayload) => Promise<User>;
  loginWithGoogle: (email?: string, name?: string) => Promise<User>;
  loginWithFacebook: () => Promise<User>;
  loginWithPhoneOtp: (phone: string, otp: string) => Promise<User>;
  logout: () => void;
  toggleWishlist: (productId: string) => boolean;
  isInWishlist: (productId: string) => boolean;
  addAddress: (addr: Omit<Address, 'id' | 'userId'>) => void;
  topupWallet: (amountPaisa: number) => void;
}

export const useAuthStore = create<AuthState>((set, get) => {
  // Check local saved session (Defaults strictly to Guest if not authenticated)
  let initialUser: User | null = null;
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('ns_auth_user_v1');
    if (saved) {
      try {
        initialUser = JSON.parse(saved);
      } catch (e) {
        initialUser = null;
      }
    }
  }

  return {
    currentUser: initialUser,
    savedAddresses: [SEED_DEFAULT_ADDRESS],
    wishlistProductIds: ['prod_pashmina_1', 'prod_khukuri_1'],
    isAuthenticated: !!initialUser,

    setUser: (user: User | null) => {
      if (user) {
        localStorage.setItem('ns_auth_user_v1', JSON.stringify(user));
        set({ currentUser: user, isAuthenticated: true });
      } else {
        localStorage.removeItem('ns_auth_user_v1');
        set({ currentUser: null, isAuthenticated: false });
      }
    },

    loginAs: (role: Role | 'guest') => {
      if (role === 'guest') {
        localStorage.removeItem('ns_auth_user_v1');
        set({ currentUser: null, isAuthenticated: false });
        return;
      }
      const matched = SEED_USERS.find((u) => u.role === role) || SEED_USERS[4];
      localStorage.setItem('ns_auth_user_v1', JSON.stringify(matched));
      set({ currentUser: matched, isAuthenticated: true });
    },

    loginWithCredentials: async (identifier: string, pass: string) => {
      const { user } = await authService.login(identifier, pass);
      localStorage.setItem('ns_auth_user_v1', JSON.stringify(user));
      set({ currentUser: user, isAuthenticated: true });
      return user;
    },

    signupWithCredentials: async (payload: SignupPayload) => {
      const { user } = await authService.signup(payload);
      localStorage.setItem('ns_auth_user_v1', JSON.stringify(user));
      set({ currentUser: user, isAuthenticated: true });
      return user;
    },

    loginWithGoogle: async (customEmail?: string, customName?: string) => {
      // Direct 1-click Google authentication
      const email = customEmail || 'bkc01805@gmail.com';
      const name = customName || (email.split('@')[0].replace(/[^a-zA-Z]/g, ' ') || 'Google User');
      const googleUser: User = {
        id: `usr_google_${Date.now()}`,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email: email,
        role: 'user',
        accountType: 'email',
        status: 'active',
        language: 'en',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        walletBalance: 25000, // Rs. 250 welcome bonus credit
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('ns_auth_user_v1', JSON.stringify(googleUser));
      set({ currentUser: googleUser, isAuthenticated: true });
      return googleUser;
    },

    loginWithFacebook: async () => {
      const fbUser: User = {
        id: `usr_fb_${Date.now()}`,
        name: 'Facebook User',
        email: 'user.fb@nepalesestore.com',
        role: 'user',
        accountType: 'email',
        status: 'active',
        language: 'en',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        walletBalance: 15000,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('ns_auth_user_v1', JSON.stringify(fbUser));
      set({ currentUser: fbUser, isAuthenticated: true });
      return fbUser;
    },

    loginWithPhoneOtp: async (phone: string, otp: string) => {
      const cleanPhone = phone.replace(/[\s-+]/g, '').replace(/^977/, '');
      const otpUser: User = {
        id: `usr_phone_${Date.now()}`,
        name: `Nepali Shopper (+977 ${cleanPhone.slice(-4)})`,
        phone: cleanPhone,
        role: 'user',
        accountType: 'phone',
        status: 'active',
        language: 'en',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        walletBalance: 20000,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('ns_auth_user_v1', JSON.stringify(otpUser));
      set({ currentUser: otpUser, isAuthenticated: true });
      return otpUser;
    },

    logout: () => {
      localStorage.removeItem('ns_auth_user_v1');
      setAuthToken(null);
      set({ currentUser: null, isAuthenticated: false });
    },

    toggleWishlist: (productId: string) => {
      const current = get().wishlistProductIds;
      const exists = current.includes(productId);
      const next = exists ? current.filter((id) => id !== productId) : [...current, productId];
      set({ wishlistProductIds: next });
      return !exists;
    },

    isInWishlist: (productId: string) => {
      return get().wishlistProductIds.includes(productId);
    },

    addAddress: (addr) => {
      const newAddress: Address = {
        ...addr,
        id: `addr_${Date.now()}`,
        userId: get().currentUser?.id || 'guest_user'
      };
      set({ savedAddresses: [newAddress, ...get().savedAddresses] });
    },

    topupWallet: (amountPaisa: number) => {
      const user = get().currentUser;
      if (user) {
        const updated = {
          ...user,
          walletBalance: user.walletBalance + amountPaisa
        };
        localStorage.setItem('ns_auth_user_v1', JSON.stringify(updated));
        set({ currentUser: updated });
      }
    }
  };
});
