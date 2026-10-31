/**
 * NepaleseStore Seed Data & Mock Catalog
 * Features rich Nepali handicrafts, local specialties, consumer electronics,
 * verified marketplace sellers, banners, classifieds, and game store packages.
 */

import {
  Category,
  Brand,
  Product,
  Seller,
  Banner,
  Coupon,
  ClassifiedAd,
  User,
  Address
} from '../types/models';

export const SEED_USERS: User[] = [
  {
    id: 'user_owner_1',
    name: 'Binay Kshetry',
    email: 'kshetrybinay@gmail.com',
    phone: '9801122334',
    role: 'owner',
    accountType: 'email',
    status: 'active',
    language: 'en',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    emailVerified: true,
    phoneVerified: true,
    createdAt: '2025-01-01T00:00:00Z',
    walletBalance: 99999900
  },
  {
    id: 'user_sradmin_1',
    name: 'Rohan Sharma',
    email: 'rohan.sradmin@nepalesestore.mock',
    phone: '9841998877',
    role: 'sradmin',
    accountType: 'email',
    status: 'active',
    language: 'en',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    emailVerified: true,
    phoneVerified: true,
    createdAt: '2025-02-15T00:00:00Z',
    walletBalance: 5000000
  },
  {
    id: 'user_brand_1',
    name: 'Sita Dahal',
    email: 'sita.brands@nepalesestore.mock',
    phone: '9851234890',
    role: 'brand_manager',
    accountType: 'email',
    status: 'active',
    language: 'en',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    emailVerified: true,
    phoneVerified: true,
    createdAt: '2025-03-10T00:00:00Z',
    walletBalance: 2500000
  },
  {
    id: 'user_helper_1',
    name: 'Bikash Tamang',
    email: 'bikash.helper@nepalesestore.mock',
    phone: '9860112233',
    role: 'helper',
    accountType: 'phone',
    status: 'active',
    language: 'ne',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    emailVerified: true,
    phoneVerified: true,
    createdAt: '2025-04-01T00:00:00Z',
    walletBalance: 1000000
  },
  {
    id: 'user_customer_1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '9841234567',
    role: 'user',
    accountType: 'phone',
    status: 'active',
    language: 'en',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    emailVerified: true,
    phoneVerified: true,
    createdAt: '2026-01-15T08:00:00Z',
    walletBalance: 450000 // Rs. 4,500
  },
  {
    id: 'user_seller_1',
    name: 'Tenzing Sherpa',
    email: 'himalayan.crafts@nepalstore.mock',
    phone: '9851098765',
    role: 'seller',
    accountType: 'business',
    businessName: 'Himalayan Arts & Heritage',
    panNumber: '601293847',
    status: 'active',
    language: 'ne',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    emailVerified: true,
    phoneVerified: true,
    createdAt: '2025-11-20T10:00:00Z',
    walletBalance: 12500000 // Rs. 1,25,000
  }
];

export const SEED_DEFAULT_ADDRESS: Address = {
  id: 'addr_default_1',
  userId: 'user_customer_1',
  label: 'Home',
  fullName: 'Aarav Sharma',
  phone: '9841234567',
  province: 'Bagmati Province',
  district: 'Kathmandu',
  municipality: 'Kathmandu Metropolitan City',
  ward: 'Ward 3, Lazimpat',
  street: 'Uttardhoka Marg, House #42',
  landmark: 'Near French Embassy',
  isDefault: true
};

export const SEED_SELLERS: Seller[] = [
  {
    id: 'seller_himalayan',
    userId: 'user_seller_1',
    storeName: 'Himalayan Arts & Heritage',
    slug: 'himalayan-arts',
    logoUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=120&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    description: 'Authentic handmade singing bowls, pashmina shawls, and thangkas sourced straight from artisans in Patan & Mustang.',
    status: 'approved',
    commissionRate: 8,
    panNumber: '601293847',
    businessType: 'registered_company',
    ratingAvg: 4.9,
    totalOrders: 1420,
    holidayMode: false,
    phone: '9851098765',
    city: 'Patan, Lalitpur',
    createdAt: '2025-02-10T00:00:00Z'
  },
  {
    id: 'seller_ilam_tea',
    userId: 'user_seller_2',
    storeName: 'Ilam Organics & Spices',
    slug: 'ilam-organics',
    logoUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=120&q=80',
    description: 'First flush single-estate Ilam green tea, Himalayan wild honey, and authentic Gandaki timur pepper.',
    status: 'approved',
    commissionRate: 7,
    panNumber: '304958102',
    businessType: 'registered_company',
    ratingAvg: 4.8,
    totalOrders: 2890,
    holidayMode: false,
    phone: '9842011223',
    city: 'Ilam / Kathmandu Office',
    createdAt: '2025-01-14T00:00:00Z'
  },
  {
    id: 'seller_ktm_tech',
    userId: 'user_seller_3',
    storeName: 'Kathmandu Digital Hub',
    slug: 'ktm-digital-hub',
    logoUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=120&q=80',
    description: 'Nepal authorized distributor for premium electronics, wireless earbuds, smartwatches and gaming gear.',
    status: 'approved',
    commissionRate: 6,
    panNumber: '609823411',
    businessType: 'registered_company',
    ratingAvg: 4.7,
    totalOrders: 5120,
    holidayMode: false,
    phone: '9801876543',
    city: 'New Road, Kathmandu',
    createdAt: '2024-11-05T00:00:00Z'
  },
  {
    id: 'seller_palpali',
    userId: 'user_seller_4',
    storeName: 'Palpali Traditional Weaves',
    slug: 'palpali-weaves',
    logoUrl: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=120&q=80',
    description: 'Certified handmade Palpali Dhaka Topis, jackets, and traditional Nepali handloom garments.',
    status: 'approved',
    commissionRate: 8,
    panNumber: '109823741',
    businessType: 'individual',
    ratingAvg: 4.9,
    totalOrders: 940,
    holidayMode: false,
    phone: '9867123987',
    city: 'Tansen, Palpa',
    createdAt: '2025-03-01T00:00:00Z'
  }
];

export const SEED_CATEGORIES: Category[] = [
  {
    id: 'cat_handicrafts',
    nameEn: 'Nepali Handicrafts & Specials',
    nameNe: 'नेपाली उत्पादन तथा हस्तकला',
    slug: 'nepali-handicrafts',
    iconName: 'Sparkles',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80',
    sortOrder: 1,
    isActive: true,
    itemCount: 24
  },
  {
    id: 'cat_electronics',
    nameEn: 'Electronics & Gadgets',
    nameNe: 'इलेक्ट्रोनिक्स र ग्याजेटहरू',
    slug: 'electronics',
    iconName: 'Smartphone',
    imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=400&q=80',
    sortOrder: 2,
    isActive: true,
    itemCount: 38
  },
  {
    id: 'cat_fashion_men',
    nameEn: 'Men’s Fashion',
    nameNe: 'पुरुष फेसन',
    slug: 'mens-fashion',
    iconName: 'Shirt',
    imageUrl: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=400&q=80',
    sortOrder: 3,
    isActive: true,
    itemCount: 42
  },
  {
    id: 'cat_fashion_women',
    nameEn: 'Women’s Fashion',
    nameNe: 'महिला फेसन',
    slug: 'womens-fashion',
    iconName: 'ShoppingBag',
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80',
    sortOrder: 4,
    isActive: true,
    itemCount: 56
  },
  {
    id: 'cat_groceries',
    nameEn: 'Nepali Groceries & Organic',
    nameNe: 'किराना तथा अर्गानिक उत्पादन',
    slug: 'groceries',
    iconName: 'Apple',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
    sortOrder: 5,
    isActive: true,
    itemCount: 31
  },
  {
    id: 'cat_home_kitchen',
    nameEn: 'Home & Kitchen',
    nameNe: 'घर र भान्सा',
    slug: 'home-kitchen',
    iconName: 'Home',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80',
    sortOrder: 6,
    isActive: true,
    itemCount: 29
  },
  {
    id: 'cat_computers',
    nameEn: 'Computers & Laptops',
    nameNe: 'कम्प्युटर र ल्यापटप',
    slug: 'computers',
    iconName: 'Laptop',
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=400&q=80',
    sortOrder: 7,
    isActive: true,
    itemCount: 19
  },
  {
    id: 'cat_sports',
    nameEn: 'Sports & Trekking',
    nameNe: 'खेलकुद तथा ट्रेकिङ गियर',
    slug: 'sports-trekking',
    iconName: 'Compass',
    imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=400&q=80',
    sortOrder: 8,
    isActive: true,
    itemCount: 22
  }
];

export const SEED_BRANDS: Brand[] = [
  { id: 'brand_palpali', name: 'Palpali Dhaka', slug: 'palpali-dhaka', isOfficial: true },
  { id: 'brand_ilam', name: 'Ilam Estate', slug: 'ilam-estate', isOfficial: true },
  { id: 'brand_patan', name: 'Patan Metalworks', slug: 'patan-metalworks', isOfficial: true },
  { id: 'brand_samsung', name: 'Samsung Nepal', slug: 'samsung-nepal', isOfficial: true },
  { id: 'brand_apple', name: 'Apple Authorized', slug: 'apple-authorized', isOfficial: true }
];

export const SEED_BANNERS: Banner[] = [
  {
    id: 'banner_dashain',
    titleEn: 'Dashain & Tihar Mega Festival',
    titleNe: 'दशैँ तथा तिहार महाबचत महोत्सव',
    subtitleEn: 'Up to 50% Off on Authentic Handicrafts, Electronics & New Outfits',
    subtitleNe: 'नेपाली हस्तकला, इलेक्ट्रोनिक्स तथा फेसनमा ५०% सम्मको भारी छुट',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1400&q=80',
    linkUrl: '/deals',
    badgeEn: 'FESTIVE MEGA SALE',
    badgeNe: 'चाडपर्व विशेष सेल',
    bgColor: 'from-red-900 to-amber-900',
    textColor: 'text-white',
    isActive: true
  },
  {
    id: 'banner_handicrafts',
    titleEn: 'Pride of Nepal: Himalayan Artisans',
    titleNe: 'नेपालको गौरव: हिमाली तथा मौलिक कला',
    subtitleEn: 'Hand-woven Pashmina, Hand-beaten Singing Bowls & Ilam Organic Teas',
    subtitleNe: 'हातले बुनेको पश्मिना, हस्तनिर्मित सिङ्गिङ बोल र इलामको अर्गानिक चिया',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1400&q=80',
    linkUrl: '/c/nepali-handicrafts',
    badgeEn: '100% ARTISAN CRAFTED',
    badgeNe: '१००% नेपाली मौलिक',
    bgColor: 'from-blue-900 to-indigo-950',
    textColor: 'text-white',
    isActive: true
  },
  {
    id: 'banner_tech',
    titleEn: 'Kathmandu New Road Tech Carnival',
    titleNe: 'काठमाडौँ न्यूरोड टेक कार्निभल',
    subtitleEn: 'Genuine Smart Watches, ANC Earbuds & Laptop Accessories with 1-Year Warranty',
    subtitleNe: '१ वर्षको आधिकारिक वारेन्टीसहित सक्कली ग्याजेटहरू र सामानहरू',
    imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1400&q=80',
    linkUrl: '/c/electronics',
    badgeEn: 'OFFICIAL WARRANTY',
    badgeNe: 'आधिकारिक वारेन्टी',
    bgColor: 'from-slate-900 to-zinc-900',
    textColor: 'text-white',
    isActive: true
  }
];

export const SEED_COUPONS: Coupon[] = [
  {
    code: 'DASHAIN2026',
    type: 'percent',
    value: 15, // 15% off
    minSpend: 250000, // min Rs 2,500
    maxDiscount: 150000, // max Rs 1,500
    usageLimit: 1000,
    usedCount: 214,
    startsAt: '2026-09-01T00:00:00Z',
    endsAt: '2026-11-30T23:59:59Z',
    isActive: true,
    descriptionEn: '15% Off festive coupon on orders above Rs. 2,500',
    descriptionNe: 'रु. २,५०० माथिको खरिदमा १५% विशेष चाडपर्व छुट'
  },
  {
    code: 'WELCOME100',
    type: 'fixed',
    value: 10000, // Rs. 100
    minSpend: 100000, // min Rs. 1,000
    usageLimit: 5000,
    usedCount: 1420,
    startsAt: '2026-01-01T00:00:00Z',
    endsAt: '2026-12-31T23:59:59Z',
    isActive: true,
    descriptionEn: 'Flat Rs. 100 off on your first order',
    descriptionNe: 'पहिलो अर्डरमा सिधै रु. १०० छुट'
  },
  {
    code: 'FREESHIP',
    type: 'free_shipping',
    value: 0,
    minSpend: 150000, // min Rs. 1,500
    usageLimit: 2000,
    usedCount: 489,
    startsAt: '2026-01-01T00:00:00Z',
    endsAt: '2026-12-31T23:59:59Z',
    isActive: true,
    descriptionEn: 'Free Delivery coupon across all 77 districts',
    descriptionNe: 'देशका ७७ वटै जिल्लामा निःशुल्क डेलिभरी कुपन'
  }
];

export const SEED_PRODUCTS: Product[] = [
  // 1. Pashmina Shawl
  {
    id: 'prod_pashmina_1',
    sellerId: 'seller_himalayan',
    sellerName: 'Himalayan Arts & Heritage',
    sellerRating: 4.9,
    sellerVerified: true,
    categoryId: 'cat_handicrafts',
    categorySlug: 'nepali-handicrafts',
    brandName: 'Himalayan Cashmere',
    nameEn: 'Handwoven 100% Pure Himalayan Chyangra Pashmina Shawl',
    nameNe: 'हातले बुनेको १००% शुद्ध हिमाली च्याङ्ग्रा पश्मिना शल',
    slug: 'pure-chyangra-pashmina-shawl',
    shortDescEn: 'Certified Grade-A Chyangra goat cashmere hand-spun and dyed using natural mountain herbs in Kathmandu valley.',
    shortDescNe: 'काठमाडौँ उपत्यकामा प्राकृतिक जडीबुटीबाट रङग्याइएको प्रमाणित ग्रेड-ए शुद्ध च्याङ्ग्रा पश्मिना।',
    descriptionEn: 'Experience pure warmth and elegance with our authentic Nepali Chyangra Pashmina. Each piece is intricately handwoven by master weavers in Lalitpur with a 2-ply ultra-soft weave that feels as light as a feather yet provides supreme warmth during cold Himalayan winters.',
    descriptionNe: 'ललितपुरका अनुभवी कालिगडहरूद्वारा हातले बुनेको अत्यन्त नरम र न्यानो शुद्ध च्याङ्ग्रा पश्मिना। जाडो मौसममा विशेष न्यानोपन र रोयल लुक्स दिने मौलिक नेपाली उत्पादन।',
    status: 'published',
    condition: 'new',
    isNepaliCraft: true,
    isFlashDeal: true,
    flashDealEnd: '2026-11-15T23:59:59Z',
    basePrice: 850000, // Rs. 8,500
    comparePrice: 1200000, // Rs. 12,000 (29% off)
    images: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    attributes: [
      { name: 'Material', value: '100% Chyangra Cashmere' },
      { name: 'Origin', value: 'Mustang / Lalitpur, Nepal' },
      { name: 'Dimensions', value: '200 cm x 70 cm' },
      { name: 'Care', value: 'Dry Clean Only' }
    ],
    variants: [
      {
        id: 'var_pashmina_crimson',
        productId: 'prod_pashmina_1',
        sku: 'PASH-RED-01',
        name: 'Crimson Red / Standard',
        options: { Color: 'Crimson Red' },
        price: 850000,
        comparePrice: 1200000,
        stock: 12,
        reserved: 1,
        imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'var_pashmina_royal_blue',
        productId: 'prod_pashmina_1',
        sku: 'PASH-BLU-02',
        name: 'Royal Blue / Standard',
        options: { Color: 'Royal Blue' },
        price: 880000,
        comparePrice: 1250000,
        stock: 8,
        reserved: 0
      },
      {
        id: 'var_pashmina_charcoal',
        productId: 'prod_pashmina_1',
        sku: 'PASH-BLK-03',
        name: 'Natural Charcoal / Standard',
        options: { Color: 'Natural Charcoal' },
        price: 850000,
        comparePrice: 1200000,
        stock: 5,
        reserved: 0
      }
    ],
    ratingAvg: 4.9,
    ratingCount: 38,
    soldCount: 142,
    viewCount: 2340,
    weightGrams: 350,
    codAvailable: true,
    warrantyPeriod: 'Chyangra Hallmark Authenticity Guarantee',
    createdAt: '2026-02-01T00:00:00Z'
  },

  // 2. Palpali Dhaka Topi
  {
    id: 'prod_dhaka_topi_1',
    sellerId: 'seller_palpali',
    sellerName: 'Palpali Traditional Weaves',
    sellerRating: 4.9,
    sellerVerified: true,
    categoryId: 'cat_handicrafts',
    categorySlug: 'nepali-handicrafts',
    brandName: 'Palpali Dhaka',
    nameEn: 'Original Palpali Handloom Pure Dhaka Topi (Traditional Cap)',
    nameNe: 'मौलिक पाल्पाली हातेतानबाट बुनेको ढाका टोपी',
    slug: 'original-palpali-handloom-dhaka-topi',
    shortDescEn: '100% authentic hand-woven Dhaka fabric from Tansen, Palpa. Traditional geometric national patterns.',
    shortDescNe: 'पाल्पाको तानसेनमा परम्परागत काठको हातेतानबाट बुनेको आकर्षक बुट्टा भएको सक्कली ढाका टोपी।',
    descriptionEn: 'The Dhaka Topi is a proud symbol of Nepali culture and heritage. Crafted on wooden handlooms in Tansen, Palpa, this topi features vibrant geometric weaves using pure dyed cotton threads. Perfect for festivals, Dashain Tika, weddings, formal functions and daily pride.',
    descriptionNe: 'नेपाली पहिचान र स्वाभिमानको प्रतीक पाल्पाली ढाका टोपी। दशैँ, तिहार, बिहे तथा औपचारिक समारोहका लागि उत्कृष्ट एवं टिकाउ उत्पादन।',
    status: 'published',
    condition: 'new',
    isNepaliCraft: true,
    isFlashDeal: false,
    basePrice: 85000, // Rs. 850
    comparePrice: 120000, // Rs. 1,200
    images: [
      'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80'
    ],
    attributes: [
      { name: 'Weave', value: '100% Handloom' },
      { name: 'Origin', value: 'Tansen, Palpa, Nepal' },
      { name: 'Fit', value: 'Standard Nepali Cap Sizing' }
    ],
    variants: [
      {
        id: 'var_topi_m',
        productId: 'prod_dhaka_topi_1',
        sku: 'TOPI-PALPA-M',
        name: 'Size Medium (21.5 inch)',
        options: { Size: 'Medium' },
        price: 85000,
        comparePrice: 120000,
        stock: 35,
        reserved: 2
      },
      {
        id: 'var_topi_l',
        productId: 'prod_dhaka_topi_1',
        sku: 'TOPI-PALPA-L',
        name: 'Size Large (22.5 inch)',
        options: { Size: 'Large' },
        price: 85000,
        comparePrice: 120000,
        stock: 40,
        reserved: 1
      }
    ],
    ratingAvg: 4.8,
    ratingCount: 52,
    soldCount: 310,
    viewCount: 3120,
    weightGrams: 100,
    codAvailable: true,
    createdAt: '2026-02-10T00:00:00Z'
  },

  // 3. Singing Bowl
  {
    id: 'prod_singing_bowl_1',
    sellerId: 'seller_himalayan',
    sellerName: 'Himalayan Arts & Heritage',
    sellerRating: 4.9,
    sellerVerified: true,
    categoryId: 'cat_handicrafts',
    categorySlug: 'nepali-handicrafts',
    brandName: 'Patan Metalworks',
    nameEn: 'Hand-Hammered 7 Metals Tibetan / Nepali Meditation Singing Bowl (8 inch)',
    nameNe: '७ धातुबाट हातले कुँदिएको पाटनको ध्यान सिङ्गिङ बोल (८ इन्च)',
    slug: 'hand-hammered-7-metals-singing-bowl',
    shortDescEn: 'Acoustic healing singing bowl hand-hammered with 7 astrological metals in Patan. Includes suede wooden striker and cushion.',
    shortDescNe: 'पाटनका धातु कालिगडहरूले ७ धातुबाट बनाएको ध्यान तथा योगाका लागि अति उपयुक्त सिङ्गिङ बोल।',
    descriptionEn: 'Handmade by generational bronze artisans in Patan, this 8-inch healing bowl produces deep, resonant harmonic vibrations that last over 45 seconds. Used globally by meditators, yoga therapists, and sound healers.',
    descriptionNe: 'ध्यान, शान्ति र सकारात्मक ऊर्जा प्रवाहका लागि प्रसिद्ध ७ धातुको मौलिक सिङ्गिङ बोल। काठको स्ट्राइकर र कुसनसहित उपलब्ध।',
    status: 'published',
    condition: 'new',
    isNepaliCraft: true,
    isFlashDeal: true,
    flashDealEnd: '2026-11-20T23:59:59Z',
    basePrice: 550000, // Rs. 5,500
    comparePrice: 780000, // Rs. 7,800
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80'
    ],
    attributes: [
      { name: 'Metals', value: 'Copper, Tin, Zinc, Iron, Lead, Silver, Gold traces' },
      { name: 'Diameter', value: '8 Inches (20.3 cm)' },
      { name: 'Accessories', value: 'Wooden Mallet + Brocade Ring Cushion' }
    ],
    variants: [
      {
        id: 'var_bowl_8inch',
        productId: 'prod_singing_bowl_1',
        sku: 'BOWL-7M-8',
        name: '8 Inch Resonant Master',
        options: { Size: '8 Inch' },
        price: 550000,
        comparePrice: 780000,
        stock: 7,
        reserved: 0
      },
      {
        id: 'var_bowl_10inch',
        productId: 'prod_singing_bowl_1',
        sku: 'BOWL-7M-10',
        name: '10 Inch Deep Bass Resonance',
        options: { Size: '10 Inch' },
        price: 890000,
        comparePrice: 1150000,
        stock: 3,
        reserved: 0
      }
    ],
    ratingAvg: 5.0,
    ratingCount: 29,
    soldCount: 88,
    viewCount: 1980,
    weightGrams: 1200,
    codAvailable: true,
    createdAt: '2026-03-01T00:00:00Z'
  },

  // 4. Ilam Green Tea
  {
    id: 'prod_ilam_tea_1',
    sellerId: 'seller_ilam_tea',
    sellerName: 'Ilam Organics & Spices',
    sellerRating: 4.8,
    sellerVerified: true,
    categoryId: 'cat_groceries',
    categorySlug: 'groceries',
    brandName: 'Ilam Estate',
    nameEn: 'Organic Himalayan First Flush Orthodox Whole-Leaf Tea (250g Tin)',
    nameNe: 'इलामको अर्गानिक पहिलो टिपाइ अर्थोडक्स चिया (२५० ग्राम)',
    slug: 'organic-ilam-orthodox-tea-250g',
    shortDescEn: 'Harvested from 6,000 ft misty gardens of Ilam, Eastern Nepal. Floral muscatel notes and golden liquor.',
    shortDescNe: 'पूर्वी नेपालको इलामका कुहिरोले ढाकिएका पहाडी बगानहरूबाट टिपिएको सुगन्धित पहिलो टिपाइ अर्थोडक्स चिया।',
    descriptionEn: 'Grown without pesticides in the high-altitude volcanic soils of Ilam, this Orthodox tea represents the pinnacle of Nepali tea craftsmanship. Rich in antioxidants with a smooth, lingering floral sweetness without any bitterness.',
    descriptionNe: '६,००० फिट उचाइमा फलेको विशुद्ध अर्गानिक चिया। यसको प्राकृतिक सुगन्ध र स्वास्थ्यवर्द्धक गुणले मनलाई ताजा बनाउँछ।',
    status: 'published',
    condition: 'new',
    isNepaliCraft: true,
    basePrice: 120000, // Rs. 1,200
    comparePrice: 160000,
    images: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'
    ],
    attributes: [
      { name: 'Weight', value: '250 Grams' },
      { name: 'Flush', value: 'Spring First Flush' },
      { name: 'Packaging', value: 'Airtight Heritage Tin' }
    ],
    variants: [
      {
        id: 'var_tea_250g',
        productId: 'prod_ilam_tea_1',
        sku: 'TEA-ILAM-250',
        name: '250 Gram Tin',
        options: { Size: '250g' },
        price: 120000,
        comparePrice: 160000,
        stock: 45,
        reserved: 1
      },
      {
        id: 'var_tea_500g',
        productId: 'prod_ilam_tea_1',
        sku: 'TEA-ILAM-500',
        name: '500 Gram Value Pack',
        options: { Size: '500g' },
        price: 210000,
        comparePrice: 280000,
        stock: 28,
        reserved: 0
      }
    ],
    ratingAvg: 4.9,
    ratingCount: 64,
    soldCount: 412,
    viewCount: 4200,
    weightGrams: 350,
    codAvailable: true,
    createdAt: '2026-01-20T00:00:00Z'
  },

  // 5. Himalayan Timur Pepper & Jimbu
  {
    id: 'prod_timur_spice_1',
    sellerId: 'seller_ilam_tea',
    sellerName: 'Ilam Organics & Spices',
    sellerRating: 4.8,
    sellerVerified: true,
    categoryId: 'cat_groceries',
    categorySlug: 'groceries',
    brandName: 'Ilam Estate',
    nameEn: 'Himalayan Organic Wild Timur Pepper (Szechuan) & Jimbu Spice Combo',
    nameNe: 'हिमाली अर्गानिक टिमुर र जिम्बुको विशेष मसला प्याक',
    slug: 'himalayan-timur-pepper-jimbu-combo',
    shortDescEn: 'Hand-picked from mid-hills of Gandaki & Karnali. Aromatic tingling citrus timur and savory sun-dried jimbu herb.',
    shortDescNe: 'गण्डकी तथा कर्णालीका उच्च पहाडी क्षेत्रबाट संकलन गरिएको टिमुर र दाल-तरकारी झानेर खाने सुगन्धित जिम्बु।',
    descriptionEn: 'Timur is Nepal’s legendary wild pepper known for its electric tingling citrus aroma, essential for traditional momo chutney and curries. Paired with high-altitude Jimbu herb sun-dried by Himalayan nomads for tempering lentils and meats.',
    descriptionNe: 'नेपाली अचार, मोमोको झोल र दाल झानेर स्वादिष्ट बनाउने अति लोकप्रिय मौलिक मसलाहरूको कम्बो प्याक।',
    status: 'published',
    condition: 'new',
    isNepaliCraft: true,
    basePrice: 65000, // Rs. 650
    comparePrice: 85000,
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'
    ],
    attributes: [
      { name: 'Package', value: '200g Timur + 100g Jimbu' },
      { name: 'Origin', value: 'Salyan & Mustang, Nepal' }
    ],
    variants: [
      {
        id: 'var_timur_combo',
        productId: 'prod_timur_spice_1',
        sku: 'SPICE-TIMUR-JIMBU',
        name: 'Standard Combo Pack',
        options: { Pack: 'Combo' },
        price: 65000,
        comparePrice: 85000,
        stock: 50,
        reserved: 0
      }
    ],
    ratingAvg: 4.8,
    ratingCount: 41,
    soldCount: 220,
    viewCount: 1540,
    weightGrams: 350,
    codAvailable: true,
    createdAt: '2026-02-15T00:00:00Z'
  },

  // 6. Nepali Handmade Brass Khukuri
  {
    id: 'prod_khukuri_1',
    sellerId: 'seller_himalayan',
    sellerName: 'Himalayan Arts & Heritage',
    sellerRating: 4.9,
    sellerVerified: true,
    categoryId: 'cat_handicrafts',
    categorySlug: 'nepali-handicrafts',
    brandName: 'Patan Metalworks',
    nameEn: 'Hand-Forged 10-Inch Decorative Brass Souvenir Khukuri with Rosewood Scabbard',
    nameNe: 'हातले बनाएको १० इन्चको सजावटी काँस खुकुरी र सिसौको दाप',
    slug: 'hand-forged-decorative-brass-khukuri',
    shortDescEn: 'Traditional Gorkha emblem crafted with polished brass inlays, rosewood scabbard and lion carved pommel.',
    shortDescNe: 'गोर्खाली वीरताको प्रतीक आकर्षक बुट्टा र सिसौको काठको दापसहितको मौलिक सजावटी खुकुरी।',
    descriptionEn: 'A magnificent handcrafted centerpiece celebrating Nepal’s brave heritage. Forged by traditional bladesmiths with fine engraving on the spine and a hand-polished brass handle. Perfect for homes, offices, and cultural gifting.',
    descriptionNe: 'घर, अफिस तथा उपहारका लागि उत्कृष्ट नेपाली सौगात। परम्परागत कालिगडहरूद्वारा निर्मित कलात्मक खुकुरी।',
    status: 'published',
    condition: 'new',
    isNepaliCraft: true,
    basePrice: 380000, // Rs. 3,800
    comparePrice: 480000,
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
    ],
    attributes: [
      { name: 'Blade Length', value: '10 Inches' },
      { name: 'Handle Material', value: 'Solid Brass & Rosewood' },
      { name: 'Craftsmanship', value: 'Dharan / Patan Traditional' }
    ],
    variants: [
      {
        id: 'var_khukuri_10',
        productId: 'prod_khukuri_1',
        sku: 'KHUK-BRASS-10',
        name: '10 Inch Brass Inlay',
        options: { Size: '10 Inch' },
        price: 380000,
        comparePrice: 480000,
        stock: 14,
        reserved: 1
      }
    ],
    ratingAvg: 4.9,
    ratingCount: 33,
    soldCount: 95,
    viewCount: 2890,
    weightGrams: 850,
    codAvailable: true,
    createdAt: '2026-03-05T00:00:00Z'
  },

  // 7. Smartphone (Electronics)
  {
    id: 'prod_phone_1',
    sellerId: 'seller_ktm_tech',
    sellerName: 'Kathmandu Digital Hub',
    sellerRating: 4.7,
    sellerVerified: true,
    categoryId: 'cat_electronics',
    categorySlug: 'electronics',
    brandName: 'Samsung Nepal',
    nameEn: 'Galaxy A55 5G (8GB RAM, 128GB/256GB Storage, 50MP OIS Camera)',
    nameNe: 'ग्यालेक्सी A55 5G (८GB र्‍याम, १२८/२५६GB स्टोरेज, ५०MP क्यामेरा)',
    slug: 'galaxy-a55-5g-smartphone',
    shortDescEn: 'Official NTA registered with 1-Year National Warranty + 1-Time Screen Replacement Offer.',
    shortDescNe: 'आधिकारिक NTA दर्ता भएको, १ वर्षको वारेन्टी र १ पटक स्क्रिन फेर्ने विशेष अफरसहित।',
    descriptionEn: 'The flagship-grade mid-ranger featuring an aluminum frame, Corning Gorilla Glass Victus+, vibrant 120Hz Super AMOLED display, IP67 water resistance, and crisp low-light nightography camera performance.',
    descriptionNe: 'उत्कृष्ट क्यामेरा, लामो समय टिक्ने ५०००mAh ब्याट्री र वाटरप्रुफ डिजाइनसहित नेपालमा सर्वाधिक रुचाइएको स्मार्टफोन।',
    status: 'published',
    condition: 'new',
    isFlashDeal: true,
    flashDealEnd: '2026-11-12T23:59:59Z',
    basePrice: 5399900, // Rs. 53,999
    comparePrice: 5999900, // Rs. 59,999
    images: [
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'
    ],
    attributes: [
      { name: 'Processor', value: 'Exynos 1480 (4nm)' },
      { name: 'Display', value: '6.6" 120Hz Super AMOLED' },
      { name: 'Battery', value: '5000 mAh 25W Fast Charge' },
      { name: 'Warranty', value: '1 Year Authorized Service Center' }
    ],
    variants: [
      {
        id: 'var_phone_128_blue',
        productId: 'prod_phone_1',
        sku: 'SM-A55-128-BLU',
        name: 'Awesome Navy / 128GB',
        options: { Color: 'Awesome Navy', Storage: '128GB' },
        price: 5399900,
        comparePrice: 5999900,
        stock: 9,
        reserved: 1
      },
      {
        id: 'var_phone_256_ice',
        productId: 'prod_phone_1',
        sku: 'SM-A55-256-ICE',
        name: 'Awesome Iceblue / 256GB',
        options: { Color: 'Awesome Iceblue', Storage: '256GB' },
        price: 5899900,
        comparePrice: 6499900,
        stock: 6,
        reserved: 0
      }
    ],
    ratingAvg: 4.8,
    ratingCount: 88,
    soldCount: 310,
    viewCount: 6540,
    weightGrams: 213,
    codAvailable: true,
    warrantyPeriod: '1 Year Authorized Official Warranty',
    createdAt: '2026-03-01T00:00:00Z'
  },

  // 8. Wireless ANC Earbuds (Electronics)
  {
    id: 'prod_earbuds_1',
    sellerId: 'seller_ktm_tech',
    sellerName: 'Kathmandu Digital Hub',
    sellerRating: 4.7,
    sellerVerified: true,
    categoryId: 'cat_electronics',
    categorySlug: 'electronics',
    brandName: 'SoundPro Nepal',
    nameEn: 'SoundPro Wave ANC True Wireless Earbuds with 40dB Noise Cancellation',
    nameNe: 'साउन्डप्रो वेभ ANC वायरलेस इयरबड्स (४०dB नोइज क्यान्सिलेसन)',
    slug: 'soundpro-wave-anc-true-wireless-earbuds',
    shortDescEn: 'Deep bass 12mm drivers, 36 hours total battery, dual transparency mode, and crystal clear call mics.',
    shortDescNe: '४० घण्टासम्मको ब्याट्री ब्याकअप, उत्कृष्ट बेस र काठमाडौँको भिडभाडमा पनि स्पष्ट कुराकानी गर्न मिल्ने माइक।',
    descriptionEn: 'Block the busy traffic noise of Kathmandu with 40dB Hybrid Active Noise Cancellation. Features low latency gaming mode, touch controls, IPX5 water resistance, and rapid type-C charging.',
    descriptionNe: 'दैनिक यात्रा, गेम तथा संगीतका लागि उपयुक्त वाटरप्रुफ ब्लुटुथ इयरबड्स।',
    status: 'published',
    condition: 'new',
    basePrice: 349900, // Rs. 3,499
    comparePrice: 499900,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80'
    ],
    attributes: [
      { name: 'Bluetooth', value: 'v5.3' },
      { name: 'Playtime', value: '36 Hours with Case' },
      { name: 'Water Resistance', value: 'IPX5 Sweatproof' }
    ],
    variants: [
      {
        id: 'var_buds_black',
        productId: 'prod_earbuds_1',
        sku: 'BUDS-WAVE-BLK',
        name: 'Midnight Black',
        options: { Color: 'Midnight Black' },
        price: 349900,
        comparePrice: 499900,
        stock: 22,
        reserved: 0
      },
      {
        id: 'var_buds_white',
        productId: 'prod_earbuds_1',
        sku: 'BUDS-WAVE-WHT',
        name: 'Snow White',
        options: { Color: 'Snow White' },
        price: 349900,
        comparePrice: 499900,
        stock: 18,
        reserved: 1
      }
    ],
    ratingAvg: 4.6,
    ratingCount: 72,
    soldCount: 420,
    viewCount: 5120,
    weightGrams: 110,
    codAvailable: true,
    warrantyPeriod: '6 Months Replacement Warranty',
    createdAt: '2026-02-18T00:00:00Z'
  },

  // 9. Ultra-slim 14" Laptop (Computers)
  {
    id: 'prod_laptop_1',
    sellerId: 'seller_ktm_tech',
    sellerName: 'Kathmandu Digital Hub',
    sellerRating: 4.7,
    sellerVerified: true,
    categoryId: 'cat_computers',
    categorySlug: 'computers',
    brandName: 'UltraBook Pro',
    nameEn: 'Zenith 14-inch IPS Ultrabook (Intel Core i5 13th Gen, 16GB RAM, 512GB NVMe SSD)',
    nameNe: 'जेनिथ १४ इन्च अल्ट्राबुक ल्यापटप (कोर i5 १३th जेन, १६GB र्‍याम, ५१२GB SSD)',
    slug: 'zenith-14-ultrabook-core-i5-16gb',
    shortDescEn: 'Weighs only 1.28kg with backlit keyboard, Thunderbolt 4, and 12-hour battery life for students & developers.',
    shortDescNe: 'अति हलुका १.२८ केजी, ब्याकलिट किबोर्ड, विद्यार्थी तथा प्रोफेसनलहरूका लागि दिनभर टिक्ने ब्याट्री।',
    descriptionEn: 'The perfect companion for modern remote workers and students in Nepal. Powered by Intel 13th Gen Core i5 with 16GB high-speed LPDDR5 RAM and 512GB lightning fast storage. Full metal sleek unibody chassis.',
    descriptionNe: 'अफिस काम, प्रोग्रामिङ र मल्टिटास्किङका लागि तीव्र गतिको स्लिम तथा प्रिमियम ल्यापटप।',
    status: 'published',
    condition: 'new',
    basePrice: 8499900, // Rs. 84,999
    comparePrice: 9499900,
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80'
    ],
    attributes: [
      { name: 'Display', value: '14" FHD+ 100% sRGB Anti-glare' },
      { name: 'Memory', value: '16GB LPDDR5 Dual Channel' },
      { name: 'Storage', value: '512GB PCIe 4.0 SSD' }
    ],
    variants: [
      {
        id: 'var_lap_silver',
        productId: 'prod_laptop_1',
        sku: 'ZEN-14-SIL',
        name: 'Space Silver / 512GB SSD',
        options: { Color: 'Space Silver' },
        price: 8499900,
        comparePrice: 9499900,
        stock: 5,
        reserved: 0
      }
    ],
    ratingAvg: 4.9,
    ratingCount: 19,
    soldCount: 45,
    viewCount: 1890,
    weightGrams: 1280,
    codAvailable: true,
    warrantyPeriod: '2 Years Manufacturer Warranty',
    createdAt: '2026-03-02T00:00:00Z'
  },

  // 10. Induction Cooktop (Home & Kitchen)
  {
    id: 'prod_induction_1',
    sellerId: 'seller_ktm_tech',
    sellerName: 'Kathmandu Digital Hub',
    sellerRating: 4.7,
    sellerVerified: true,
    categoryId: 'cat_home_kitchen',
    categorySlug: 'home-kitchen',
    brandName: 'Prestige Nepal',
    nameEn: 'EcoCook 2100W Smart Push-Button Induction Cooktop with Voltage Protection',
    nameNe: 'इकोकुक २१०० वाट स्मार्ट इन्डक्सन चुल्हो (भोल्टेज प्रोटेक्सन सहित)',
    slug: 'ecocook-2100w-smart-induction-cooktop',
    shortDescEn: 'Optimized for Nepali kitchen LPG gas saving. Pre-set Indian/Nepali cooking menus for roti, dal, curry and milk.',
    shortDescNe: 'एलपी ग्यासको खर्च बचत गर्ने २१०० वाटको टिकाउ इन्डक्सन चुल्हो। दाल, भात, तरकारी तथा दुध उमाल्ने अटो प्रोग्रामहरू।',
    descriptionEn: 'Save over 60% on monthly cooking energy compared to LPG cylinders. Specially engineered with an automatic voltage stabilizer to withstand Nepal’s fluctuating power supply.',
    descriptionNe: 'नेपालको बिजुली उतारचढावलाई धान्न सक्ने विशेष सेफ्टी फिचर भएको विश्वसनीय इन्डक्सन चुल्हो।',
    status: 'published',
    condition: 'new',
    basePrice: 385000, // Rs. 3,850
    comparePrice: 480000,
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
    ],
    attributes: [
      { name: 'Wattage', value: '2100 Watts' },
      { name: 'Safety', value: 'Auto-shutoff & Anti-magnetic wall' }
    ],
    variants: [
      {
        id: 'var_ind_cook',
        productId: 'prod_induction_1',
        sku: 'IND-2100W',
        name: 'Matte Black 2100W',
        options: { Color: 'Black' },
        price: 385000,
        comparePrice: 480000,
        stock: 19,
        reserved: 1
      }
    ],
    ratingAvg: 4.7,
    ratingCount: 44,
    soldCount: 280,
    viewCount: 3200,
    weightGrams: 2100,
    codAvailable: true,
    warrantyPeriod: '1 Year Full Replacement Warranty',
    createdAt: '2026-02-14T00:00:00Z'
  },

  // 11. Traditional Daura Suruwal (Men's Fashion)
  {
    id: 'prod_daura_1',
    sellerId: 'seller_palpali',
    sellerName: 'Palpali Traditional Weaves',
    sellerRating: 4.9,
    sellerVerified: true,
    categoryId: 'cat_fashion_men',
    categorySlug: 'mens-fashion',
    brandName: 'Palpali Dhaka',
    nameEn: 'Classic Tailored Cotton Daura Suruwal with Dhaka Coat Set for Men',
    nameNe: 'पुरुषहरूको लागि मौलिक सुती दौरा सुरुवाल र ढाका कोट सेट',
    slug: 'classic-cotton-daura-suruwal-set',
    shortDescEn: 'Traditional national attire tailored with fine breathable cotton and Palpali Dhaka vest coat.',
    shortDescNe: 'राष्ट्रिय पोसाक दौरा सुरुवाल र बुट्टेदार पाल्पाली ढाका इस्टकोट सेट। दशैँ, बिहे तथा औपचारिक समारोहका लागि।',
    descriptionEn: 'Stand tall with genuine Nepali pride in our master-tailored Daura Suruwal. Crafted from premium breathable cotton, this complete formal set includes the traditional Eight-Tie (Ashta Matrika) Daura, tapered Suruwal, and a matching Palpali Dhaka waistcoat.',
    descriptionNe: 'परम्परागत अष्ट मातृका र अष्ट भैरवको प्रतीक ८ वटा तुना भएको दौरा, सुरुवाल र सुहाउँदो ढाका इस्टकोट।',
    status: 'published',
    condition: 'new',
    isNepaliCraft: true,
    basePrice: 480000, // Rs. 4,800
    comparePrice: 620000,
    images: [
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80'
    ],
    attributes: [
      { name: 'Fabric', value: '100% Combed Cotton & Dhaka Weave' },
      { name: 'Includes', value: 'Daura + Suruwal + Dhaka Waistcoat' }
    ],
    variants: [
      {
        id: 'var_daura_38',
        productId: 'prod_daura_1',
        sku: 'DAURA-SET-38',
        name: 'Size 38 (Medium)',
        options: { Size: '38 (M)' },
        price: 480000,
        comparePrice: 620000,
        stock: 12,
        reserved: 0
      },
      {
        id: 'var_daura_40',
        productId: 'prod_daura_1',
        sku: 'DAURA-SET-40',
        name: 'Size 40 (Large)',
        options: { Size: '40 (L)' },
        price: 480000,
        comparePrice: 620000,
        stock: 10,
        reserved: 0
      }
    ],
    ratingAvg: 4.8,
    ratingCount: 26,
    soldCount: 114,
    viewCount: 1780,
    weightGrams: 800,
    codAvailable: true,
    createdAt: '2026-02-25T00:00:00Z'
  },

  // 12. Pure Mustang Dried Apples (Groceries)
  {
    id: 'prod_mustang_apples_1',
    sellerId: 'seller_ilam_tea',
    sellerName: 'Ilam Organics & Spices',
    sellerRating: 4.8,
    sellerVerified: true,
    categoryId: 'cat_groceries',
    categorySlug: 'groceries',
    brandName: 'Ilam Estate',
    nameEn: 'Himalayan Sun-Dried Sweet Organic Mustang Apples (Pack of 3 x 200g)',
    nameNe: 'मुस्ताङको अर्गानिक घाममा सुकाएको स्याउ चाना (३ प्याक)',
    slug: 'mustang-organic-sun-dried-apples',
    shortDescEn: 'Naturally sun-cured in Marpha, Mustang without added sugar or preservatives. Chewy, wholesome Himalayan snack.',
    shortDescNe: 'मुस्ताङको मार्फामा स्वच्छ हिमाली घाम र हावामा सुकाइएको पौष्टिक तथा स्वादिलो स्याउको चाना।',
    descriptionEn: 'Renowned throughout Nepal and the Himalayas, Mustang apples are prized for their crisp, intense sweetness. These slices are naturally dried on traditional wooden racks in Marpha, retaining maximum fiber, vitamins, and mountain freshness.',
    descriptionNe: 'कुनै पनि कृत्रिम केमिकल वा चिनी नमिसाइएको मुस्ताङको मौलिक स्याउ सुकुटी। स्वास्थ्य र पोषणका लागि उत्तम।',
    status: 'published',
    condition: 'new',
    isNepaliCraft: true,
    basePrice: 95000, // Rs. 950
    comparePrice: 125000,
    images: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'
    ],
    attributes: [
      { name: 'Weight', value: '600g Total (3 x 200g)' },
      { name: 'Origin', value: 'Marpha, Mustang, Nepal' },
      { name: 'Preservatives', value: 'Zero Artificial Additives' }
    ],
    variants: [
      {
        id: 'var_apples_3pack',
        productId: 'prod_mustang_apples_1',
        sku: 'APPLE-MUSTANG-3P',
        name: '3 x 200g Packs',
        options: { Quantity: '3 Packs' },
        price: 95000,
        comparePrice: 125000,
        stock: 38,
        reserved: 0
      }
    ],
    ratingAvg: 4.9,
    ratingCount: 47,
    soldCount: 380,
    viewCount: 2900,
    weightGrams: 650,
    codAvailable: true,
    createdAt: '2026-03-04T00:00:00Z'
  }
];

// Bazaar Classifieds Seed (Hamrobazar style)
export const SEED_CLASSIFIED_ADS: ClassifiedAd[] = [
  {
    id: 'ad_bike_1',
    userId: 'user_customer_1',
    sellerName: 'Bikash Adhikari',
    sellerPhone: '9841887766',
    sellerVerified: true,
    category: 'vehicles',
    title: 'Yamaha FZ-S FI V3 (Single Hand Used, Tax Cleared till 2083)',
    slug: 'yamaha-fzs-v3-single-hand-used',
    description: 'Bike is in pristine showroom condition. Servicing done on time every 2,500 km at authorized Yamaha center. Single hand ridden in Kathmandu valley, brand new MRF rear tire.',
    price: 24500000, // Rs. 2,45,000
    isNegotiable: true,
    condition: 'Like New',
    province: 'Bagmati Province',
    district: 'Kathmandu',
    area: 'Baneshwor / Tinkune',
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80'
    ],
    phoneVisible: false,
    phoneRevealCount: 38,
    fields: {
      'Model Year': '2022',
      'Kilometers': '14,200 km',
      'Lot Number': 'Ba 98 Pa 4321',
      'Engine (cc)': '149 cc'
    },
    status: 'active',
    promoType: 'featured',
    views: 890,
    createdAt: '2026-10-25T11:00:00Z'
  },
  {
    id: 'ad_phone_iphone',
    userId: 'user_customer_2',
    sellerName: 'Sneha Shrestha',
    sellerPhone: '9860112244',
    sellerVerified: true,
    category: 'mobiles',
    title: 'iPhone 14 Pro Max 256GB Deep Purple (Battery 91%, NTA Registered)',
    slug: 'iphone-14-pro-max-256gb-deep-purple',
    description: 'Original Apple iPhone 14 Pro Max in spotless condition. Always used with Spigen case and tempered glass. Includes original box and braid cable.',
    price: 11800000, // Rs. 1,18,000
    isNegotiable: false,
    condition: 'Like New',
    province: 'Bagmati Province',
    district: 'Lalitpur',
    area: 'Jhamsikhel / Pulchowk',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80'
    ],
    phoneVisible: false,
    phoneRevealCount: 64,
    fields: {
      'Storage': '256GB',
      'Battery Health': '91%',
      'Color': 'Deep Purple',
      'MDMS / NTA': 'Registered & Approved'
    },
    status: 'active',
    promoType: 'top',
    views: 1420,
    createdAt: '2026-10-28T09:30:00Z'
  },
  {
    id: 'ad_land_imadol',
    userId: 'user_customer_3',
    sellerName: 'Rameshwor Karki',
    sellerPhone: '9851044556',
    sellerVerified: true,
    category: 'properties',
    title: '3 Aana 2 Paisa Residential Plot in Imadol Lalitpur (13ft Pitch Road)',
    slug: '3-aana-residential-plot-imadol-lalitpur',
    description: 'Prime south-facing square residential land situated only 1.5km from Ringroad Gwarko. Water pipeline, electricity, drainage and peace residential environment.',
    price: 360000000, // Rs. 36 Lakh per aana
    isNegotiable: true,
    condition: 'Brand New',
    province: 'Bagmati Province',
    district: 'Lalitpur',
    area: 'Imadol, Krishna Mandir',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80'
    ],
    phoneVisible: false,
    phoneRevealCount: 82,
    fields: {
      'Area': '3 Aana 2 Paisa',
      'Face Direction': 'South-East',
      'Road Width': '13 Feet Blacktopped',
      'Distance from Ringroad': '1.5 KM'
    },
    status: 'active',
    promoType: 'urgent',
    views: 2150,
    createdAt: '2026-10-27T14:15:00Z'
  }
];
