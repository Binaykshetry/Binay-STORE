/**
 * NepaleseStore - Production Full-Stack Server
 * Express + TypeScript with JSON File Database Persistence (data/db.json),
 * Real Salted Password Hashing, Signed JWT Authentication, Role Guards,
 * and Nepal E-Commerce API Engine.
 */

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// JWT Secret & Config
const JWT_SECRET = process.env.JWT_SECRET || 'ns_secure_hmac_jwt_nepal_secret_2026';
const DB_FILE_PATH = path.resolve(__dirname, 'data', 'db.json');

// --- DATABASE MODELS & SCHEMAS ---

export interface BackendUser {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  role: 'owner' | 'sradmin' | 'brand_manager' | 'helper' | 'user' | 'seller';
  accountType: 'phone' | 'email' | 'business';
  businessName?: string;
  panNumber?: string;
  status: 'active' | 'suspended';
  language: 'en' | 'ne';
  createdAt: string;
  salt: string;
  passwordHash: string;
  walletBalance: number; // in paisa
}

export interface SupportTicket {
  id: string;
  userPhoneOrEmail: string;
  userName: string;
  subject: string;
  category: 'Order Dispute' | 'Payment Issue' | 'Delivery Delay' | 'Seller Inquiry';
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved';
  assignedHelper?: string;
  messages: { sender: string; text: string; time: string }[];
  createdAt: string;
}

export interface OfficialBrand {
  id: string;
  name: string;
  slug: string;
  category: string;
  manager: string;
  featured: boolean;
  status: 'Verified' | 'Pending Review';
  logoUrl: string;
  bannerUrl: string;
  campaignTitle?: string;
}

export interface CouponRecord {
  code: string;
  type: 'percent' | 'fixed' | 'free_shipping';
  value: number;
  minOrderPaisa?: number;
  maxDiscountPaisa?: number;
  usageLimit: number;
  usedCount: number;
  active: boolean;
  expiresAt: string;
}

export interface DatabaseSchema {
  users: BackendUser[];
  supportTickets: SupportTicket[];
  brands: OfficialBrand[];
  coupons: CouponRecord[];
  orders: any[];
}

// --- PASSWORD & CRYPTO UTILITIES ---

function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

function verifyPassword(password: string, salt: string, storedHash: string): boolean {
  const hash = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(storedHash, 'hex'));
}

// --- JWT IMPLEMENTATION (HMAC SHA-256) ---

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf-8');
}

function signJwt(payload: { id: string; role: string; name: string; email?: string }): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days expiry
  const body = { ...payload, exp };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(body));

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function verifyJwt(token: string): { id: string; role: string; name: string; email?: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    if (signature !== expectedSignature) return null;

    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
      return null; // Expired
    }
    return payload;
  } catch (e) {
    return null;
  }
}

// --- INITIAL SEED DATA WITH SECURE PASSWORDS ---

function getInitialDatabase(): DatabaseSchema {
  const salt = generateSalt();
  // Safe default password: 'password123'
  const defaultHash = hashPassword('password123', salt);

  return {
    users: [
      {
        id: 'user_owner_1',
        name: 'Binay Kshetry (Platform Owner)',
        email: 'kshetrybinay@gmail.com',
        phone: '9800000001',
        role: 'owner',
        accountType: 'email',
        status: 'active',
        language: 'en',
        createdAt: '2025-01-01T00:00:00Z',
        salt,
        passwordHash: defaultHash,
        walletBalance: 99999900
      },
      {
        id: 'user_sradmin_1',
        name: 'Rohan Sharma (Senior Admin)',
        email: 'rohan.sradmin@nepalstore.test',
        phone: '9800000002',
        role: 'sradmin',
        accountType: 'email',
        status: 'active',
        language: 'en',
        createdAt: '2025-02-15T00:00:00Z',
        salt,
        passwordHash: defaultHash,
        walletBalance: 5000000
      },
      {
        id: 'user_brand_1',
        name: 'Sita Dahal (Brand Manager)',
        email: 'sita.brands@nepalstore.test',
        phone: '9800000003',
        role: 'brand_manager',
        accountType: 'email',
        status: 'active',
        language: 'en',
        createdAt: '2025-03-10T00:00:00Z',
        salt,
        passwordHash: defaultHash,
        walletBalance: 2500000
      },
      {
        id: 'user_helper_1',
        name: 'Bikash Tamang (Support Helper)',
        email: 'bikash.helper@nepalstore.test',
        phone: '9800000004',
        role: 'helper',
        accountType: 'email',
        status: 'active',
        language: 'ne',
        createdAt: '2025-04-01T00:00:00Z',
        salt,
        passwordHash: defaultHash,
        walletBalance: 1000000
      },
      {
        id: 'user_normal_1',
        name: 'Aarav Sharma (Customer)',
        email: 'aarav.sharma@nepalstore.test',
        phone: '9800000005',
        role: 'user',
        accountType: 'phone',
        status: 'active',
        language: 'en',
        createdAt: '2026-01-15T08:00:00Z',
        salt,
        passwordHash: defaultHash,
        walletBalance: 450000
      },
      {
        id: 'user_biz_1',
        name: 'Tenzing Sherpa (Artisan Seller)',
        email: 'tenzing.seller@nepalstore.test',
        phone: '9800000006',
        role: 'seller',
        accountType: 'business',
        businessName: 'Himalayan Arts & Heritage',
        panNumber: '601293847',
        status: 'active',
        language: 'ne',
        createdAt: '2025-11-20T10:00:00Z',
        salt,
        passwordHash: defaultHash,
        walletBalance: 12500000
      }
    ],
    supportTickets: [
      {
        id: 'TICK-9021',
        userPhoneOrEmail: '9800000005',
        userName: 'Aarav Sharma',
        subject: 'Delivery zone confirmation for Lazimpat, Kathmandu',
        category: 'Delivery Delay',
        priority: 'Medium',
        status: 'Open',
        assignedHelper: 'Bikash Tamang',
        messages: [
          { sender: 'Aarav Sharma', text: 'Hello, when will my order NS-20261030-942 be delivered?', time: '10:00 AM' },
          { sender: 'Bikash (Helper)', text: 'Namaste! It is packed and out for delivery with our Kathmandu rider.', time: '10:15 AM' }
        ],
        createdAt: new Date().toISOString()
      }
    ],
    brands: [
      {
        id: 'brand_palpali',
        name: 'Palpali Dhaka Official Store',
        slug: 'palpali-dhaka',
        category: 'Nepali Handicrafts & Weaves',
        manager: 'Sita Dahal',
        featured: true,
        status: 'Verified',
        logoUrl: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=120&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1200&q=80',
        campaignTitle: '100% Traditional Handloom Guarantee'
      },
      {
        id: 'brand_ilam',
        name: 'Ilam Estate Orthodox Tea',
        slug: 'ilam-estate',
        category: 'Organic Agriculture',
        manager: 'Sita Dahal',
        featured: true,
        status: 'Verified',
        logoUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=120&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
        campaignTitle: 'Himalayan Spring First Flush'
      },
      {
        id: 'brand_samsung',
        name: 'Samsung Nepal Authorized',
        slug: 'samsung-nepal',
        category: 'Electronics & Gadgets',
        manager: 'Sita Dahal',
        featured: true,
        status: 'Verified',
        logoUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=120&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=80',
        campaignTitle: '1-Year Official National Warranty'
      }
    ],
    coupons: [
      {
        code: 'DASHAIN2026',
        type: 'percent',
        value: 15,
        maxDiscountPaisa: 500000,
        usageLimit: 1000,
        usedCount: 42,
        active: true,
        expiresAt: '2026-12-31T23:59:59Z'
      },
      {
        code: 'WELCOME100',
        type: 'fixed',
        value: 10000,
        minOrderPaisa: 50000,
        usageLimit: 5000,
        usedCount: 120,
        active: true,
        expiresAt: '2026-12-31T23:59:59Z'
      },
      {
        code: 'FREESHIP',
        type: 'free_shipping',
        value: 0,
        usageLimit: 500,
        usedCount: 88,
        active: true,
        expiresAt: '2026-12-31T23:59:59Z'
      }
    ],
    orders: []
  };
}

// --- FILE PERSISTENCE ENGINE ---

let DB: DatabaseSchema;

function loadDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      // Validate structure
      if (parsed.users && parsed.supportTickets && parsed.brands) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading db.json, initializing fresh store:', err);
  }

  const fresh = getInitialDatabase();
  saveDatabase(fresh);
  return fresh;
}

function saveDatabase(data: DatabaseSchema): void {
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist database to data/db.json:', err);
  }
}

DB = loadDatabase();

// --- AUTHENTICATION MIDDLEWARES ---

interface AuthenticatedRequest extends Request {
  user?: BackendUser;
}

function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 'UNAUTHORIZED', message: 'Authentication required. Please log in.' });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyJwt(token);
  if (!payload) {
    return res.status(401).json({ code: 'INVALID_TOKEN', message: 'Session expired or invalid token. Please log in again.' });
  }

  const user = DB.users.find((u) => u.id === payload.id);
  if (!user || user.status === 'suspended') {
    return res.status(401).json({ code: 'USER_INACTIVE', message: 'User account not found or suspended.' });
  }

  req.user = user;
  next();
}

function requireRoles(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ code: 'UNAUTHORIZED', message: 'Authentication required.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        code: 'FORBIDDEN',
        message: `Access denied: Action requires role [${allowedRoles.join(', ')}]. Current role: ${req.user.role.toUpperCase()}`
      });
    }
    next();
  };
}

// --- SERVER SETUP ---

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Security Headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  app.use(express.json({ limit: '10mb' }));

  // --- API BACKEND ROUTES (/api/v1) ---

  // 1. Health Monitor
  app.get('/api/v1/health', (req, res) => {
    res.json({
      status: 'healthy',
      service: 'NepaleseStore Secure API',
      version: '2.0.0',
      database: 'Persisted (data/db.json)',
      records: {
        users: DB.users.length,
        brands: DB.brands.length,
        tickets: DB.supportTickets.length,
        orders: DB.orders.length
      },
      timestamp: new Date().toISOString()
    });
  });

  // 2. Signup Endpoint (Strict security: Only normal user or seller with PAN, never staff or owner!)
  app.post('/api/v1/auth/signup', (req, res) => {
    const { name, phone, email, password, accountType, businessName, panNumber } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ code: 'INVALID_NAME', message: 'Full Name must be at least 2 characters.' });
    }

    if (!password || typeof password !== 'string' || password.length <= 7) {
      return res.status(400).json({
        code: 'PASSWORD_TOO_SHORT',
        message: 'Password must be strictly more than 7 characters in length (minimum 8 characters).'
      });
    }

    // Phone registration
    if (accountType === 'phone') {
      const cleanPhone = (phone || '').replace(/[\s-+]/g, '');
      const localPhone = cleanPhone.startsWith('977') ? cleanPhone.substring(3) : cleanPhone;
      if (!/^(98|97)\d{8}$/.test(localPhone)) {
        return res.status(400).json({
          code: 'INVALID_PHONE',
          message: 'Please provide a valid 10-digit Nepali mobile number starting with 98 or 97.'
        });
      }

      const exists = DB.users.find((u) => u.phone === localPhone);
      if (exists) {
        return res.status(409).json({ code: 'PHONE_EXISTS', message: 'An account with this phone number already exists.' });
      }
    } else if (accountType === 'email') {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ code: 'INVALID_EMAIL', message: 'Please provide a valid email address.' });
      }

      const exists = DB.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
      if (exists) {
        return res.status(409).json({ code: 'EMAIL_EXISTS', message: 'An account with this email address already exists.' });
      }
    } else if (accountType === 'business') {
      if (!businessName || businessName.trim().length < 3) {
        return res.status(400).json({ code: 'INVALID_BIZ', message: 'Registered Store/Business name is required.' });
      }
      if (!panNumber || !/^\d{9}$/.test(panNumber.trim())) {
        return res.status(400).json({ code: 'INVALID_PAN', message: 'Please provide a valid 9-digit PAN/VAT number.' });
      }
    }

    // SECURITY: Public registration CANNOT grant owner, sradmin, brand_manager, or helper!
    const assignedRole = accountType === 'business' ? 'seller' : 'user';

    const salt = generateSalt();
    const passwordHash = hashPassword(password, salt);

    const newUser: BackendUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      phone: phone ? phone.replace(/[\s-+]/g, '').replace(/^977/, '') : undefined,
      email: email ? email.trim().toLowerCase() : undefined,
      role: assignedRole,
      accountType: accountType || 'email',
      businessName: businessName?.trim(),
      panNumber: panNumber?.trim(),
      status: 'active',
      language: 'en',
      createdAt: new Date().toISOString(),
      salt,
      passwordHash,
      walletBalance: 10000 // Rs. 100 welcome bonus credit
    };

    DB.users.push(newUser);
    saveDatabase(DB);

    const token = signJwt({ id: newUser.id, role: newUser.role, name: newUser.name, email: newUser.email });
    const { passwordHash: _, salt: __, ...safeUser } = newUser;

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to NepaleseStore.',
      user: safeUser,
      token
    });
  });

  // 3. Login Endpoint (Real password hash verification)
  app.post('/api/v1/auth/login', (req, res) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ code: 'MISSING_CREDENTIALS', message: 'Phone/Email and password are required.' });
    }

    const clean = identifier.trim().toLowerCase();
    const cleanPhone = clean.replace(/[\s-+]/g, '').replace(/^977/, '');

    const user = DB.users.find((u) => {
      const matchEmail = u.email && u.email.toLowerCase() === clean;
      const matchPhone = u.phone && u.phone === cleanPhone;
      return matchEmail || matchPhone;
    });

    if (!user) {
      return res.status(401).json({ code: 'USER_NOT_FOUND', message: 'No account registered with this phone number or email.' });
    }

    // Secure cryptographic hash comparison
    const isMatch = verifyPassword(password, user.salt, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ code: 'INVALID_PASSWORD', message: 'Incorrect password. Please try again.' });
    }

    const token = signJwt({ id: user.id, role: user.role, name: user.name, email: user.email });
    const { passwordHash: _, salt: __, ...safeUser } = user;

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      user: safeUser,
      token
    });
  });

  // 4. Staff Dedicated Operations Login Endpoint
  app.post('/api/v1/auth/staff-login', (req, res) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ code: 'MISSING_CREDENTIALS', message: 'Work email/phone and password are required.' });
    }

    const clean = identifier.trim().toLowerCase();
    const cleanPhone = clean.replace(/[\s-+]/g, '').replace(/^977/, '');

    const user = DB.users.find((u) => {
      const matchEmail = u.email && u.email.toLowerCase() === clean;
      const matchPhone = u.phone && u.phone === cleanPhone;
      return matchEmail || matchPhone;
    });

    if (!user) {
      return res.status(401).json({ code: 'STAFF_NOT_FOUND', message: 'No staff account found.' });
    }

    const staffRoles = ['owner', 'sradmin', 'brand_manager', 'helper'];
    if (!staffRoles.includes(user.role)) {
      return res.status(403).json({
        code: 'ACCESS_RESTRICTED',
        message: 'Access Denied: This portal is strictly restricted to NepaleseStore staff.'
      });
    }

    const isMatch = verifyPassword(password, user.salt, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ code: 'INVALID_PASSWORD', message: 'Incorrect staff credentials.' });
    }

    const token = signJwt({ id: user.id, role: user.role, name: user.name, email: user.email });
    const { passwordHash: _, salt: __, ...safeUser } = user;

    res.json({
      success: true,
      message: `Staff authentication successful. Welcome, ${user.name}!`,
      user: safeUser,
      token
    });
  });

  // 5. Authenticated Profile Endpoint (Strict: Never falls back to Owner!)
  app.get('/api/v1/auth/me', authMiddleware, (req: AuthenticatedRequest, res) => {
    const { passwordHash: _, salt: __, ...safeUser } = req.user!;
    res.json({ user: safeUser });
  });

  // 6. User Directory (Protected: Strictly for Owner and Senior Admin)
  app.get('/api/v1/users', authMiddleware, requireRoles('owner', 'sradmin'), (req: AuthenticatedRequest, res) => {
    const safeUsers = DB.users.map(({ passwordHash, salt, ...rest }) => rest);
    res.json({ users: safeUsers, total: safeUsers.length });
  });

  // 7. Protected Role Hierarchy Mutation
  // - Verified using req.user from JWT (does NOT trust client requesterRole)
  // - Owner is permanently immutable and cannot be demoted
  // - Admin can manage staff/users, but cannot touch Owner or appoint Owner
  app.patch('/api/v1/users/:id/role', authMiddleware, requireRoles('owner', 'sradmin'), (req: AuthenticatedRequest, res) => {
    const { id } = req.params;
    const { newRole } = req.body;
    const validRoles = ['owner', 'sradmin', 'brand_manager', 'helper', 'user', 'seller'];

    if (!validRoles.includes(newRole)) {
      return res.status(400).json({ code: 'INVALID_ROLE', message: 'Unknown role specified.' });
    }

    const targetUser = DB.users.find((u) => u.id === id);
    if (!targetUser) {
      return res.status(404).json({ code: 'NOT_FOUND', message: 'Target user not found.' });
    }

    // Immutable Owner protection
    if (targetUser.role === 'owner') {
      return res.status(403).json({
        code: 'OWNER_IMMUTABLE',
        message: 'Protected Authority: The Owner cannot be demoted or changed.'
      });
    }

    // Role escalation check
    if (req.user!.role === 'sradmin' && newRole === 'owner') {
      return res.status(403).json({
        code: 'ADMIN_CANNOT_APPOINT_OWNER',
        message: 'Permission Denied: Senior Admin cannot appoint or promote to Owner.'
      });
    }

    targetUser.role = newRole as any;
    saveDatabase(DB);

    const { passwordHash: _, salt: __, ...safeUser } = targetUser;
    res.json({
      success: true,
      message: `${req.user!.role.toUpperCase()} transferred ${targetUser.name} to position: ${newRole.toUpperCase()}`,
      user: safeUser
    });
  });

  // 8. Support Tickets (Protected: Ticket desk for Helper, Admin, Owner)
  app.get('/api/v1/support/tickets', authMiddleware, requireRoles('owner', 'sradmin', 'helper'), (req, res) => {
    res.json({ tickets: DB.supportTickets });
  });

  app.post('/api/v1/support/tickets', authMiddleware, (req: AuthenticatedRequest, res) => {
    const { subject, category, message } = req.body;
    const newTicket: SupportTicket = {
      id: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
      userPhoneOrEmail: req.user!.email || req.user!.phone || 'Customer',
      userName: req.user!.name,
      subject: subject || 'General Query',
      category: category || 'Order Dispute',
      priority: 'Medium',
      status: 'Open',
      messages: [{ sender: req.user!.name, text: message, time: 'Just now' }],
      createdAt: new Date().toISOString()
    };
    DB.supportTickets.unshift(newTicket);
    saveDatabase(DB);
    res.status(201).json({ success: true, ticket: newTicket });
  });

  app.post('/api/v1/support/tickets/:id/reply', authMiddleware, requireRoles('owner', 'sradmin', 'helper'), (req: AuthenticatedRequest, res) => {
    const { id } = req.params;
    const { replyText } = req.body;
    const ticket = DB.supportTickets.find((t) => t.id === id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found.' });

    ticket.messages.push({
      sender: `${req.user!.name} (${req.user!.role.toUpperCase()})`,
      text: replyText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    ticket.status = 'In Progress';
    saveDatabase(DB);
    res.json({ success: true, ticket });
  });

  // 9. Official Brands Directory (Public list, Protected creation)
  app.get('/api/v1/brands', (req, res) => {
    res.json({ brands: DB.brands });
  });

  app.post('/api/v1/brands', authMiddleware, requireRoles('owner', 'sradmin', 'brand_manager'), (req: AuthenticatedRequest, res) => {
    const { name, category, campaignTitle } = req.body;
    const brand: OfficialBrand = {
      id: `brand_${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: category || 'General',
      manager: req.user!.name,
      featured: true,
      status: 'Verified',
      logoUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=120&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=80',
      campaignTitle: campaignTitle || 'Official Brand Showcase'
    };
    DB.brands.push(brand);
    saveDatabase(DB);
    res.status(201).json({ success: true, brand });
  });

  // 10. Coupons Validation API
  app.post('/api/v1/coupons/validate', (req, res) => {
    const { code, subtotalPaisa } = req.body;
    if (!code) return res.status(400).json({ valid: false, message: 'Coupon code required.' });

    const coupon = DB.coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!coupon || !coupon.active) {
      return res.status(404).json({ valid: false, message: 'Invalid or inactive coupon code.' });
    }

    if (new Date(coupon.expiresAt).getTime() < Date.now()) {
      return res.status(400).json({ valid: false, message: 'This coupon has expired.' });
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ valid: false, message: 'This coupon has reached its maximum redemptions.' });
    }

    if (coupon.minOrderPaisa && subtotalPaisa < coupon.minOrderPaisa) {
      return res.status(400).json({
        valid: false,
        message: `Minimum order amount of Rs. ${(coupon.minOrderPaisa / 100).toLocaleString('en-IN')} required.`
      });
    }

    res.json({ valid: true, coupon });
  });

  // 11. Order Creation with COD Limit Verification (Max Rs. 50,000 for Cash on Delivery)
  app.post('/api/v1/orders/create', (req, res) => {
    const { orderNo, grandTotal, paymentMethod, items, shippingAddress } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ code: 'EMPTY_CART', message: 'Cart items cannot be empty.' });
    }

    // COD Limit Rule
    if (paymentMethod === 'cod' && grandTotal > 5000000) {
      return res.status(400).json({
        code: 'COD_LIMIT_EXCEEDED',
        message: 'Cash on Delivery (COD) is limited to orders up to Rs. 50,000. Please choose eSewa, Khalti, or Fonepay.'
      });
    }

    const newOrder = {
      ...req.body,
      id: `ord_${Date.now()}`,
      status: paymentMethod === 'cod' ? 'placed' : 'paid',
      createdAt: new Date().toISOString()
    };

    DB.orders.push(newOrder);
    saveDatabase(DB);

    res.status(201).json({ success: true, order: newOrder });
  });

  app.get('/api/v1/orders/list', authMiddleware, (req: AuthenticatedRequest, res) => {
    // If staff, return all orders; if customer, return user's orders
    if (['owner', 'sradmin'].includes(req.user!.role)) {
      return res.json({ orders: DB.orders });
    }
    const myOrders = DB.orders.filter((o) => o.userId === req.user!.id || o.shippingAddress?.phone === req.user!.phone);
    res.json({ orders: myOrders });
  });

  // --- VITE MIDDLEWARE / PRODUCTION STATIC ASSETS ---
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NepaleseStore Production-Grade server running on port ${PORT}`);
    console.log(`Persistent File Database mounted at: ${DB_FILE_PATH}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
