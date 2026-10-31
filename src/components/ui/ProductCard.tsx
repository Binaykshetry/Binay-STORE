import React from 'react';
import { Product } from '../../types/models';
import { formatNPR } from '../../lib/format';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { Star, Heart, ShoppingBag, Sparkles, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, featured = false }) => {
  const { language, t } = useLanguageStore();
  const { addItem } = useCartStore();
  const { isInWishlist, toggleWishlist } = useAuthStore();
  const { navigate, showToast } = useUIStore();

  const isFavorited = isInWishlist(product.id);
  const title = language === 'ne' ? product.nameNe : product.nameEn;
  const activeVariant = product.variants[0];
  const price = activeVariant?.price || product.basePrice;
  const comparePrice = activeVariant?.comparePrice || product.comparePrice;

  // Calculate discount percent
  const discountPercent =
    comparePrice && comparePrice > price
      ? Math.round(((comparePrice - price) / comparePrice) * 100)
      : 0;

  const handleCardClick = () => {
    navigate('product_detail', { productSlug: product.slug });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, activeVariant, 1);
    showToast(`${title.slice(0, 32)}... ${t('addedToCart')}`, 'success');
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const added = toggleWishlist(product.id);
    showToast(
      added ? 'Added to your Wishlist!' : 'Removed from Wishlist',
      'info'
    );
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative bg-white rounded-xl border border-gray-100 hover:border-gray-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer ${
        featured ? 'ring-1 ring-gold-400/40' : ''
      }`}
    >
      {/* Product Image Box */}
      <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
        <img
          src={product.images[0]}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {discountPercent > 0 && (
            <span className="bg-primary-600 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
              -{discountPercent}%
            </span>
          )}
          {product.isNepaliCraft && (
            <span className="bg-emerald-700/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
              <Sparkles className="w-2.5 h-2.5 text-gold-400" />
              {language === 'ne' ? 'नेपाली मौलिक' : 'Nepali Craft'}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          aria-label="Add to wishlist"
          className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-all ${
            isFavorited
              ? 'bg-red-50 text-red-600 shadow-sm'
              : 'bg-white/80 backdrop-blur-xs text-gray-500 hover:text-red-500 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Add overlay button for desktop */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
          <button
            onClick={handleAddToCart}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-3 rounded-lg text-xs shadow-md flex items-center justify-center gap-1.5 active:scale-98 transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {t('addToCart')}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {/* Seller / Brand tag */}
          <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
            <span className="truncate max-w-[130px] font-medium text-gray-500">
              {product.brandName || product.sellerName}
            </span>
            <span className="text-gray-400 text-[10px]">
              {product.soldCount} {t('sold')}
            </span>
          </div>

          {/* Title - 2 lines max */}
          <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-primary-600 transition-colors">
            {title}
          </h3>
        </div>

        <div className="mt-2.5 pt-2 border-t border-gray-50">
          {/* Rating */}
          <div className="flex items-center gap-1 mb-1.5">
            <div className="flex items-center text-gold-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-bold text-gray-800 ml-1">
                {product.ratingAvg.toFixed(1)}
              </span>
            </div>
            <span className="text-[11px] text-gray-400">
              ({product.ratingCount})
            </span>
          </div>

          {/* Pricing Row */}
          <div className="flex items-baseline justify-between">
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-extrabold text-primary-600 leading-tight">
                {formatNPR(price)}
              </span>
              {comparePrice && comparePrice > price && (
                <span className="text-[11px] text-gray-400 line-through">
                  {formatNPR(comparePrice)}
                </span>
              )}
            </div>

            {/* Mobile quick add button */}
            <button
              onClick={handleAddToCart}
              className="sm:hidden p-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-600 hover:text-white transition-colors"
              aria-label="Add to cart"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
