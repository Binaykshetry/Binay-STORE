/**
 * Authentication & User Service
 * Handles Signup (Phone / Email / Business), Login, OTP verification,
 * and Role updates. Connects to backend API with offline fallback.
 */

import { User, Role } from '../types/models';
import { SEED_USERS } from '../mocks/seed-data';

const AUTH_STORAGE_KEY = 'ns_auth_user_v1';
const AUTH_TOKEN_KEY = 'ns_auth_token_v1';
const ALL_USERS_STORAGE_KEY = 'ns_all_users_v1';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

function getStoredUsers(): User[] {
  if (typeof window === 'undefined') return SEED_USERS;
  const saved = localStorage.getItem(ALL_USERS_STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(ALL_USERS_STORAGE_KEY, JSON.stringify(SEED_USERS));
    return SEED_USERS;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return SEED_USERS;
  }
}

function saveStoredUsers(users: User[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ALL_USERS_STORAGE_KEY, JSON.stringify(users));
  }
}

export interface SignupPayload {
  name: string;
  phone?: string;
  email?: string;
  password: string;
  accountType: 'phone' | 'email' | 'business';
  role?: Role;
  businessName?: string;
  panNumber?: string;
}

export const authService = {
  /**
   * Register a new user via Phone, Email, or Business Account.
   * Enforces password length > 7 characters.
   */
  async signup(payload: SignupPayload): Promise<{ user: User; token: string }> {
    // Client-side rule check
    if (!payload.name || payload.name.trim().length < 2) {
      throw new Error('Full Name must be at least 2 characters.');
    }

    if (!payload.password || payload.password.length <= 7) {
      throw new Error('Password must be more than 7 characters in length (minimum 8 characters).');
    }

    // Try calling backend API
    try {
      const response = await fetch('/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        // Update local cache
        const all = getStoredUsers();
        all.push(data.user);
        saveStoredUsers(all);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data.user));
        setAuthToken(data.token);
        return { user: data.user, token: data.token };
      } else {
        const errData = await response.json().catch(() => ({}));
        if (errData.message) throw new Error(errData.message);
      }
    } catch (err: any) {
      // If network error / offline fallback
      if (err.message && !err.message.includes('fetch')) {
        throw err;
      }
    }

    // Fallback registration
    const allUsers = getStoredUsers();
    const cleanPhone = payload.phone?.replace(/[\s-+]/g, '').replace(/^977/, '');

    if (payload.accountType === 'phone') {
      if (allUsers.some((u) => u.phone === cleanPhone)) {
        throw new Error('An account with this phone number already exists.');
      }
    } else if (payload.accountType === 'email') {
      if (allUsers.some((u) => u.email?.toLowerCase() === payload.email?.toLowerCase())) {
        throw new Error('An account with this email address already exists.');
      }
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      name: payload.name.trim(),
      phone: cleanPhone,
      email: payload.email?.trim().toLowerCase(),
      role: payload.accountType === 'business' ? 'seller' : (payload.role || 'user'),
      accountType: payload.accountType,
      businessName: payload.businessName?.trim(),
      panNumber: payload.panNumber?.trim(),
      status: 'active',
      language: 'en',
      createdAt: new Date().toISOString(),
      walletBalance: 10000 // Rs. 100 welcome credit
    };

    allUsers.push(newUser);
    saveStoredUsers(allUsers);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));

    return {
      user: newUser,
      token: `ns_jwt_token_${newUser.id}`
    };
  },

  /**
   * Log in using Phone or Email and Password (> 7 characters)
   */
  async login(identifier: string, password: string): Promise<{ user: User; token: string }> {
    if (!identifier.trim() || !password) {
      throw new Error('Please enter your phone/email and password.');
    }

    if (password.length <= 7) {
      throw new Error('Password must be more than 7 characters.');
    }

    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data.user));
        setAuthToken(data.token);
        return { user: data.user, token: data.token };
      } else {
        const errData = await response.json().catch(() => ({}));
        if (errData.message) throw new Error(errData.message);
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) throw err;
    }

    // Local lookup fallback
    const allUsers = getStoredUsers();
    const clean = identifier.trim().toLowerCase();
    const cleanPhone = clean.replace(/[\s-+]/g, '').replace(/^977/, '');

    const matched = allUsers.find(
      (u) => (u.email && u.email.toLowerCase() === clean) || (u.phone && u.phone === cleanPhone)
    );

    if (!matched) {
      throw new Error('No user account found with this phone number or email.');
    }

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(matched));
    return {
      user: matched,
      token: `ns_jwt_token_${matched.id}`
    };
  },

  /**
   * Dedicated Staff Operations Login
   * Restricts access strictly to Owner, Sr. Admin, Brand Manager, and Helper
   */
  async staffLogin(identifier: string, password: string, staffPin?: string): Promise<{ user: User; token: string }> {
    if (!identifier.trim() || !password) {
      throw new Error('Please enter your staff ID / email and password.');
    }

    if (password.length <= 7) {
      throw new Error('Staff security passcode must be more than 7 characters.');
    }

    try {
      const response = await fetch('/api/v1/auth/staff-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password, staffPin })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data.user));
        setAuthToken(data.token);
        return { user: data.user, token: data.token };
      } else {
        const errData = await response.json().catch(() => ({}));
        if (errData.message) throw new Error(errData.message);
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) throw err;
    }

    // Local fallback check
    const allUsers = getStoredUsers();
    const clean = identifier.trim().toLowerCase();
    const cleanPhone = clean.replace(/[\s-+]/g, '').replace(/^977/, '');

    const matched = allUsers.find(
      (u) => (u.email && u.email.toLowerCase() === clean) || (u.phone && u.phone === cleanPhone)
    );

    if (!matched) {
      throw new Error('No staff account found matching these credentials.');
    }

    const staffRoles = ['owner', 'sradmin', 'brand_manager', 'helper'];
    if (!staffRoles.includes(matched.role)) {
      throw new Error('Access Denied: This portal is strictly restricted to authorized staff (Owner, Sr. Admin, Brand Manager, Helper). Customers please use customer login.');
    }

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(matched));
    return {
      user: matched,
      token: `ns_staff_jwt_${matched.id}`
    };
  },

  /**
   * Fetch all registered users (for Owner & SrAdmin dashboard)
   */
  async listAllUsers(): Promise<User[]> {
    try {
      const token = getAuthToken();
      const res = await fetch('/api/v1/users', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        return data.users;
      }
    } catch (e) {
      // fallback
    }
    return getStoredUsers();
  },

  /**
   * Update role following strict hierarchy:
   * - Owner is TOP and IMMUTABLE.
   * - Owner can change any position (Admin -> Helper, Normal User -> Admin, etc.).
   * - Admin cannot change Owner role, but can change other roles.
   * - Others have no role alteration permissions.
   */
  async updateUserRole(userId: string, newRole: Role, requesterRole = 'owner'): Promise<User> {
    try {
      const token = getAuthToken();
      const res = await fetch(`/api/v1/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ newRole })
      });
      if (res.ok) {
        const data = await res.json();
        return data.user;
      } else {
        const errData = await res.json().catch(() => ({}));
        if (errData.message) throw new Error(errData.message);
      }
    } catch (e: any) {
      if (e.message && !e.message.includes('fetch')) throw e;
    }

    const all = getStoredUsers();
    const target = all.find((u) => u.id === userId);
    if (!target) throw new Error('User not found.');

    if (target.role === 'owner') {
      throw new Error('The Owner position is top-tier and immutable. It cannot be altered.');
    }

    if (requesterRole === 'sradmin' && newRole === 'owner') {
      throw new Error('Permission Denied: Senior Admin cannot appoint or promote anyone to Owner.');
    }

    if (requesterRole !== 'owner' && requesterRole !== 'sradmin') {
      throw new Error('Permission Denied: Only Owner or Senior Admin can manage roles.');
    }

    target.role = newRole;
    saveStoredUsers(all);
    return target;
  }
};
