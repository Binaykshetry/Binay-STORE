# NepaleseStore (नेपालको अनलाइन बजार)

Nepal's premier e-commerce marketplace, classifieds bazaar (Hamro Bazaar), and digital game store webstore. Built according to the **Complete Website Build Plan** and **NepaleseStore Master Guidelines**.

---

## 🚀 Full-Stack Architecture & Backend API

NepaleseStore runs a full-stack **Express + TypeScript** server (`server.ts`) with Vite middlewares mounted in dev and production:
- `POST /api/v1/auth/signup` — Multi-channel registration via **Phone Number (+977)**, **Email**, or **Business Account** (with PAN/VAT). Enforces passwords > 7 characters (min 8 chars).
- `POST /api/v1/auth/login` — Authentication via Phone or Email + Password.
- `GET /api/v1/auth/me` — Authenticated user profile and permissions.
- `GET /api/v1/users` — Directory of all registered users (for Owner and Sr Admin).
- `PATCH /api/v1/users/:id/role` — Role promotion/re-assignment (Owner exclusive).
- `GET /api/v1/support/tickets` & `POST /api/v1/support/tickets/:id/reply` — Support ticket management for the **Helper** role.
- `GET /api/v1/brands` & `POST /api/v1/brands` — Official Brand store directory and campaigns for **Brand Manager**.
- `GET /api/v1/health` — Service health monitor.

---

## 👥 Role-Based Access Control (RBAC)

The application supports all 6 core roles:
1. **👑 Owner (`owner`):** Binay Kshetry (`kshetrybinay@gmail.com`)
   - Platform governance, GMV oversight, and ability to assign or promote any staff role (`sradmin`, `brand_manager`, `helper`).
2. **🛡️ Senior Admin (`sradmin`):** Rohan Sharma
   - Moderation queue, order force-status changes, seller KYC review, and operational dispute management.
3. **🏷️ Brand Manager (`brand_manager`):** Sita Dahal
   - Curates official brand storefronts (Samsung Nepal, Palpali Dhaka, Patan Metalworks, Ilam Estate), assigns verified badges, and runs seasonal campaigns.
4. **🤝 Helper (`helper`):** Bikash Tamang
   - Customer support helpdesk, answering user queries on delivery and payments, resolving buyer-seller disputes.
5. **👤 Normal User (`user`):** Aarav Sharma
   - Full customer shopping experience, cart, wishlist, eSewa/Khalti/COD checkout, order tracking, and wallet.
6. **🏪 Business Account / Seller (`seller`):** Tenzing Sherpa (`Himalayan Arts & Heritage`)
   - Merchant product creation with variant matrices, order fulfillment (pack & ship), and bank payout requests.

---

## 📝 Signup & Authentication Methods
Shoppers and merchants can register in three ways:
1. **Phone Number Signup:** Validated against Nepali numbers (+977 10 digits starting with `98` or `97`).
2. **Email Address Signup:** Standard verified email registration.
3. **Business Account Signup:** Registered store/company name + verified 9-digit PAN/VAT number.
4. **Password Security Policy:** Passwords must be **strictly more than 7 characters (minimum 8 characters)** with real-time strength indicators (numbers and characters).
5. **OTP Verification:** Test verification code is `123456`.

---

## 🌟 Storefront & Marketplace Features
- **Lakh / Crore Formatting:** Accurate `formatNPR()` with South Asian grouping (e.g. `Rs. 1,29,999`).
- **Bilingual Interface:** Real-time toggle between English and Nepali (नेपाली).
- **Nepal 7 Provinces & 77 Districts:** Automated zone rates (Kathmandu Valley Rs. 60, Major cities Rs. 120, Rest of Nepal Rs. 180, Remote Rs. 250). Free delivery over Rs. 2,000.
- **Payment Gateways:** Cash on Delivery (COD), eSewa portal, Khalti portal, Fonepay QR scan, and Direct Bank Transfer.
- **Hamro Bazaar (Classifieds):** Post free ads, phone reveal protection, and buyer-seller chat.
- **Minecraft Server Store:** Live player count (168/250), copy IP (`play.nepalsmp.net`), rank packages, and live RCON queue simulation.
- **Active Coupons:** `DASHAIN2026` (15% off), `WELCOME100` (Rs. 100 off), `FREESHIP` (Free delivery).
