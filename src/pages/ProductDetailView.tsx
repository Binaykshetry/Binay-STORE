import React, { useState, useEffect, useMemo } from 'react';
import { useLanguageStore } from '../store/useLanguageStore';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import { productService } from '../services/productService';
import { Product, ProductVariant } from '../types/models';
import { formatNPR } from '../lib/format';
import { NEPAL_PROVINCES, getDeliveryZoneForDistrict } from '../lib/nepal-geo';
import { ProductCard } from '../components/ui/ProductCard';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  Share2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
  Sparkles,
  ChevronRight,
  Store,
  MapPin,
  HelpCircle,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';

export const ProductDetailView: React.FC = () => {
  const { language, t } = useLanguageStore();
  const { currentProductSlug, navigate, showToast } = useUIStore();
  const { addItem } = useCartStore();
  const { isInWishlist, toggleWishlist } = useAuthStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedDistrict, setSelectedDistrict] = useState('Kathmandu');
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews' | 'qa'>('specs');
  const [newQuestion, setNewQuestion] = useState('');
  const [questionsList, setQuestionsList] = useState<
    { id: string; user: string; question: string; answer?: string; date: string }[]
  >([
    {
      id: 'q1',
      user: 'Suman Thapa',
      question: 'Is this 100% original and certified by Nepal government standards?',
      answer: 'Yes, this product is sourced directly with verifiable certification.',
      date: '3 days ago'
    },
    {
      id: 'q2',
      user: 'Prashant KC',
      question: 'Can I pay cash on delivery in Pokhara?',
      answer: 'Yes, Cash on Delivery is supported in Pokhara and across all 77 districts.',
      date: '1 week ago'
    }
  ]);

  useEffect(() => {
    async function loadProduct() {
      if (!currentProductSlug) return;
      const found = await productService.getBySlug(currentProductSlug);
      if (found) {
        setProduct(found);
        setSelectedVariant(found.variants[0] || null);
        setActiveImageIndex(0);
        setQuantity(1);

        const all = await productService.getPublished();
        setSimilarProducts(all.filter((p) => p.id !== found.id).slice(0, 4));
      }
    }
    loadProduct();
  }, [currentProductSlug]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">Loading product details...</p>
      </div>
    );
  }

  const title = language === 'ne' ? product.nameNe : product.nameEn;
  const description = language === 'ne' ? product.descriptionNe : product.descriptionEn;
  const shortDesc = language === 'ne' ? product.shortDescNe : product.shortDescEn;

  const price = selectedVariant?.price || product.basePrice;
  const comparePrice = selectedVariant?.comparePrice || product.comparePrice;
  const savings = comparePrice && comparePrice > price ? comparePrice - price : 0;
  const discountPercent = comparePrice && comparePrice > price ? Math.round((savings / comparePrice) * 100) : 0;

  const currentStock = selectedVariant ? selectedVariant.stock : 10;
  const isOutOfStock = currentStock <= 0;
  const isLowStock = currentStock > 0 && currentStock <= 5;

  const deliveryZone = getDeliveryZoneForDistrict(selectedDistrict);
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (selectedVariant && !isOutOfStock) {
      addItem(product, selectedVariant, quantity);
      showToast(`${title} ${t('addedToCart')}`, 'success');
    }
  };

  const handleBuyNow = () => {
    if (selectedVariant && !isOutOfStock) {
      addItem(product, selectedVariant, quantity);
      navigate('checkout');
    }
  };

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuestion.trim()) {
      setQuestionsList([
        {
          id: `q_${Date.now()}`,
          user: 'You (Aarav Sharma)',
          question: newQuestion.trim(),
          answer: 'The verified seller will respond to your query shortly.',
          date: 'Just now'
        },
        ...questionsList
      ]);
      setNewQuestion('');
      showToast('Your question was submitted to the seller!', 'success');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl pb-24 sm:pb-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6 overflow-x-auto whitespace-nowrap">
        <button onClick={() => navigate('home')} className="hover:text-primary-600">
          Home
        </button>
        <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
        <button
          onClick={() => navigate('catalog', { categorySlug: product.categorySlug })}
          className="hover:text-primary-600"
        >
          {product.categorySlug}
        </button>
        <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
        <span className="font-semibold text-gray-800 truncate max-w-xs">{title}</span>
      </nav>

      {/* Main Product Showcase Box */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-8 shadow-xs mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Gallery (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-inner">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={title}
                className="w-full h-full object-cover object-center"
              />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                {discountPercent > 0 && (
                  <span className="bg-primary-600 text-white font-black text-xs px-2.5 py-1 rounded-full shadow-md">
                    -{discountPercent}% OFF
                  </span>
                )}
                {product.isNepaliCraft && (
                  <span className="bg-emerald-800/90 text-white font-bold text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <Sparkles className="w-3 h-3 text-gold-400" />
                    <span>नेपाली मौलिक</span>
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === idx ? 'border-primary-600 shadow-sm scale-102' : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Actions (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Brand & Sold Row */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span className="font-semibold text-secondary-600 uppercase tracking-wider">
                  Brand: {product.brandName || 'Authentic Nepal Craft'}
                </span>
                <span>{product.soldCount} {t('sold')}</span>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug tracking-tight">
                {title}
              </h1>

              {/* Rating & Wishlist Row */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100 mt-2">
                <div className="flex items-center gap-2">
                  <div className="flex text-gold-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.ratingAvg) ? 'fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-gray-800">{product.ratingAvg.toFixed(1)}</span>
                  <span className="text-xs text-gray-400">({product.ratingCount} reviews)</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      toggleWishlist(product.id);
                      showToast(isWishlisted ? 'Removed from Wishlist' : 'Saved to Wishlist', 'info');
                    }}
                    className={`p-2 rounded-full border transition-colors ${
                      isWishlisted ? 'border-red-200 bg-red-50 text-red-600' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                    title="Add to Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      showToast('Product link copied to clipboard!', 'info');
                    }}
                    className="p-2 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                    title="Share product"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Price Block */}
              <div className="bg-red-50/60 rounded-xl p-4 my-4 flex items-baseline justify-between border border-red-100">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-primary-600">
                    {formatNPR(price)}
                  </span>
                  {comparePrice && comparePrice > price && (
                    <span className="text-sm sm:text-base text-gray-400 line-through">
                      {formatNPR(comparePrice)}
                    </span>
                  )}
                </div>

                {savings > 0 && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-md">
                    {t('youSave')} {formatNPR(savings)}
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                {shortDesc}
              </p>

              {/* Variant Selectors */}
              {product.variants.length > 1 && (
                <div className="mb-5">
                  <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block mb-2">
                    Available Variants:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => {
                      const isSelected = selectedVariant?.id === v.id;
                      return (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                            isSelected
                              ? 'border-primary-600 bg-primary-50 text-primary-700 ring-2 ring-primary-100'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {v.name} - {formatNPR(v.price)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Stock Indicator */}
              <div className="flex items-center gap-2 mb-5">
                {isOutOfStock ? (
                  <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {t('outOfStock')}
                  </span>
                ) : isLowStock ? (
                  <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {t('onlyLeft', { count: currentStock })}
                  </span>
                ) : (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    {t('inStock')} ({currentStock} available)
                  </span>
                )}
              </div>

              {/* Quantity Stepper & Buy Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-gray-100">
                {/* Quantity */}
                <div className="flex items-center border border-gray-300 rounded-xl bg-white p-1 shrink-0 w-32 justify-between">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="p-1.5 text-gray-500 hover:text-primary-600 disabled:opacity-40"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-sm text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                    disabled={quantity >= currentStock || isOutOfStock}
                    className="p-1.5 text-gray-500 hover:text-primary-600 disabled:opacity-40"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 py-3 px-6 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
                >
                  {t('addToCart')}
                </button>

                {/* Buy Now */}
                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="flex-1 py-3 px-6 rounded-xl bg-secondary-600 hover:bg-secondary-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
                >
                  {t('buyNow')}
                </button>
              </div>
            </div>

            {/* Delivery Calculator & Trust Strip */}
            <div className="mt-8 pt-6 border-t border-gray-100 bg-gray-50/70 -mx-4 -mb-4 sm:-mx-8 sm:-mb-8 p-4 sm:p-6 rounded-b-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Delivery district selector */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-700 mb-1.5">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-primary-600" />
                      Check Delivery for your District:
                    </span>
                  </div>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs font-medium text-gray-800"
                  >
                    {NEPAL_PROVINCES.flatMap((p) => p.districts).map((d) => (
                      <option key={d} value={d}>
                        {d} ({getDeliveryZoneForDistrict(d).nameEn.split('(')[0]})
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-gray-500 mt-1">
                    ETA: <span className="font-bold text-gray-800">{deliveryZone.estimatedDays}</span> | Rate: <span className="font-bold text-primary-600">{formatNPR(deliveryZone.baseRatePaisa)}</span> (Free above Rs. 2,000)
                  </p>
                </div>

                {/* Seller snippet */}
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-secondary-100 text-secondary-800 flex items-center justify-center font-bold text-xs shrink-0">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">{product.sellerName}</p>
                      <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        Verified Nepali Merchant
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('catalog', { search: product.sellerName })}
                    className="text-xs font-bold text-primary-600 hover:underline"
                  >
                    Store
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Specs & Highlights, Reviews, Q&A */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs mb-10">
        <div className="flex items-center gap-6 border-b border-gray-200 mb-6 text-sm font-bold">
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 transition-colors relative ${
              activeTab === 'specs' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Product Specifications
            {activeTab === 'specs' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-primary-600 rounded" />}
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 transition-colors relative ${
              activeTab === 'reviews' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Customer Reviews ({product.ratingCount})
            {activeTab === 'reviews' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-primary-600 rounded" />}
          </button>

          <button
            onClick={() => setActiveTab('qa')}
            className={`pb-3 transition-colors relative ${
              activeTab === 'qa' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Questions & Answers ({questionsList.length})
            {activeTab === 'qa' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-primary-600 rounded" />}
          </button>
        </div>

        {/* Tab 1: Specs & Long Description */}
        {activeTab === 'specs' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">Description</h3>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3">Key Highlights</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {product.attributes.map((attr, i) => (
                  <div key={i} className="flex p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                    <span className="w-1/3 font-semibold text-gray-500">{attr.name}:</span>
                    <span className="w-2/3 font-bold text-gray-800">{attr.value}</span>
                  </div>
                ))}
                <div className="flex p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                  <span className="w-1/3 font-semibold text-gray-500">Shipping Weight:</span>
                  <span className="w-2/3 font-bold text-gray-800">{product.weightGrams} grams</span>
                </div>
                <div className="flex p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                  <span className="w-1/3 font-semibold text-gray-500">Return Window:</span>
                  <span className="w-2/3 font-bold text-emerald-700">7 Days Return Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex items-center gap-6 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="text-center">
                <span className="text-3xl font-black text-gray-900">{product.ratingAvg.toFixed(1)}</span>
                <div className="flex text-gold-500 justify-center my-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[11px] text-gray-500">{product.ratingCount} Ratings</span>
              </div>
              <div className="text-xs text-gray-600">
                <p className="font-bold text-gray-800">100% Verified Buyer Reviews</p>
                <p className="text-[11px] text-gray-500">Only verified customers who received this item can write reviews.</p>
              </div>
            </div>

            {/* Sample Reviews */}
            <div className="divide-y divide-gray-100 space-y-4">
              <div className="pt-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-gray-900">Rohan Shakya (Patan, Lalitpur)</span>
                  <span className="text-gray-400">2 weeks ago</span>
                </div>
                <div className="flex text-gold-500 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Exceptional quality! Exactly as described and delivered to Patan in less than 24 hours. The packaging was immaculate with bubble wrap.
                </p>
              </div>

              <div className="pt-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-gray-900">Anjali Karki (Pokhara)</span>
                  <span className="text-gray-400">1 month ago</span>
                </div>
                <div className="flex text-gold-500 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Paid via Khalti and received prompt SMS updates. Authentic craftmanship that makes a fantastic gift.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Q&A */}
        {activeTab === 'qa' && (
          <div className="space-y-6">
            {/* Ask Question Form */}
            <form onSubmit={handleAskQuestion} className="flex gap-2">
              <input
                type="text"
                required
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Ask the seller about sizing, delivery, or authenticity..."
                className="flex-1 p-2.5 border border-gray-300 rounded-xl text-xs focus:ring-1 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs"
              >
                Ask Question
              </button>
            </form>

            <div className="divide-y divide-gray-100 space-y-4">
              {questionsList.map((q) => (
                <div key={q.id} className="pt-3 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-gray-900">
                    <MessageSquare className="w-3.5 h-3.5 text-primary-600" />
                    <span>Q: {q.question}</span>
                  </div>
                  <p className="text-gray-400 text-[10px] pl-5">{q.user} · {q.date}</p>
                  {q.answer && (
                    <div className="pl-5 text-gray-700 bg-gray-50 p-2 rounded-lg mt-1 border-l-2 border-emerald-500">
                      <span className="font-semibold text-emerald-800">Answer: </span>
                      <span>{q.answer}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Similar Products */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">You May Also Like</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {similarProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* Sticky Mobile Add To Cart Bar */}
      <div className="sm:hidden fixed bottom-14 inset-x-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 z-30 flex items-center justify-between gap-3 shadow-lg">
        <div>
          <span className="text-[10px] text-gray-500 block leading-none">Total</span>
          <span className="text-base font-extrabold text-primary-600">
            {formatNPR(price * quantity)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="px-4 py-2.5 bg-primary-600 text-white text-xs font-bold rounded-xl shadow-md"
          >
            {t('addToCart')}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className="px-4 py-2.5 bg-secondary-600 text-white text-xs font-bold rounded-xl shadow-md"
          >
            {t('buyNow')}
          </button>
        </div>
      </div>
    </div>
  );
};
