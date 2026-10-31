import React, { useState, useEffect, useMemo } from 'react';
import { useLanguageStore } from '../store/useLanguageStore';
import { useUIStore } from '../store/useUIStore';
import { productService } from '../services/productService';
import { Product, Category } from '../types/models';
import { ProductCard } from '../components/ui/ProductCard';
import { SEED_CATEGORIES, SEED_BRANDS } from '../mocks/seed-data';
import { formatNPR } from '../../src/lib/format';
import {
  SlidersHorizontal,
  ChevronRight,
  Star,
  Check,
  RotateCcw,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

export const CatalogView: React.FC = () => {
  const { language, t } = useLanguageStore();
  const { currentCategorySlug, searchQuery, navigate } = useUIStore();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(currentCategorySlug || 'all');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(100000); // in Rupees
  const [onlyNepaliCrafts, setOnlyNepaliCrafts] = useState<boolean>(false);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  useEffect(() => {
    async function load() {
      const data = await productService.getAll();
      setAllProducts(data);
    }
    load();
  }, []);

  // Sync category slug from store
  useEffect(() => {
    if (currentCategorySlug) {
      setSelectedCategory(currentCategorySlug);
    }
  }, [currentCategorySlug]);

  const currentCategoryData = useMemo(() => {
    return SEED_CATEGORIES.find((c) => c.slug === selectedCategory);
  }, [selectedCategory]);

  // Filtered & sorted products list
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((p) => p.status === 'published')
      .filter((p) => {
        // Category filter
        if (selectedCategory && selectedCategory !== 'all' && p.categorySlug !== selectedCategory) {
          return false;
        }

        // Search Query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            p.nameEn.toLowerCase().includes(q) ||
            p.nameNe.toLowerCase().includes(q) ||
            p.sellerName.toLowerCase().includes(q) ||
            (p.brandName && p.brandName.toLowerCase().includes(q));
          if (!matches) return false;
        }

        // Price range (in rupees)
        const priceInRupees = (p.variants[0]?.price || p.basePrice) / 100;
        if (priceInRupees < minPrice || priceInRupees > maxPrice) {
          return false;
        }

        // Brand filter
        if (selectedBrands.length > 0 && (!p.brandName || !selectedBrands.includes(p.brandName))) {
          return false;
        }

        // Nepali craft toggle
        if (onlyNepaliCrafts && !p.isNepaliCraft) {
          return false;
        }

        // In-stock toggle
        if (onlyInStock) {
          const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);
          if (totalStock <= 0) return false;
        }

        // Rating filter
        if (minRating > 0 && p.ratingAvg < minRating) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.variants[0]?.price || a.basePrice;
        const priceB = b.variants[0]?.price || b.basePrice;

        if (sortBy === 'price_asc') return priceA - priceB;
        if (sortBy === 'price_desc') return priceB - priceA;
        if (sortBy === 'rating') return b.ratingAvg - a.ratingAvg;
        if (sortBy === 'popular') return b.soldCount - a.soldCount;
        return 0; // relevance
      });
  }, [
    allProducts,
    selectedCategory,
    searchQuery,
    minPrice,
    maxPrice,
    selectedBrands,
    onlyNepaliCrafts,
    onlyInStock,
    minRating,
    sortBy
  ]);

  const toggleBrand = (brandName: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandName) ? prev.filter((b) => b !== brandName) : [...prev, brandName]
    );
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrands([]);
    setMinPrice(0);
    setMaxPrice(100000);
    setOnlyNepaliCrafts(false);
    setOnlyInStock(false);
    setMinRating(0);
    setSortBy('relevance');
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4 overflow-x-auto whitespace-nowrap">
        <button onClick={() => navigate('home')} className="hover:text-primary-600">
          Home
        </button>
        <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
        <span className="font-semibold text-gray-800">
          {searchQuery
            ? `Search: "${searchQuery}"`
            : currentCategoryData
            ? language === 'ne'
              ? currentCategoryData.nameNe
              : currentCategoryData.nameEn
            : 'All Departments'}
        </span>
      </nav>

      {/* Category Header Banner */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 mb-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            {searchQuery
              ? `Results for "${searchQuery}"`
              : currentCategoryData
              ? language === 'ne'
                ? currentCategoryData.nameNe
                : currentCategoryData.nameEn
              : 'All Nepali Products & Catalog'}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Showing {filteredProducts.length} verified products available for nationwide delivery
          </p>
        </div>

        {/* Mobile filter button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex-1 py-2 px-3 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-xs text-gray-800 flex items-center justify-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-primary-600" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="flex gap-6 items-start">
        {/* Desktop Filter Sidebar */}
        <aside
          className={`w-64 bg-white rounded-2xl border border-gray-200 p-5 shrink-0 shadow-2xs space-y-6 lg:block ${
            isMobileFilterOpen
              ? 'fixed inset-y-0 left-0 z-50 w-80 shadow-2xl overflow-y-auto block'
              : 'hidden'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-primary-600" />
              <span>Filters</span>
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-primary-600 hover:underline flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Category Tree */}
          <div>
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Department
            </h4>
            <div className="space-y-1 max-h-48 overflow-y-auto text-xs pr-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-2 py-1.5 rounded-md flex justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-primary-50 text-primary-600 font-bold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>All Departments</span>
              </button>
              {SEED_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left px-2 py-1.5 rounded-md flex justify-between ${
                    selectedCategory === cat.slug
                      ? 'bg-primary-50 text-primary-600 font-bold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="truncate">{language === 'ne' ? cat.nameNe : cat.nameEn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Nepali Craft Only Toggle */}
          <div className="pt-3 border-t border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyNepaliCrafts}
                onChange={(e) => setOnlyNepaliCrafts(e.target.checked)}
                className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
              />
              <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-gold-500" />
                Nepali Crafts Only
              </span>
            </label>
          </div>

          {/* In-Stock Only Toggle */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
              />
              <span className="text-xs font-semibold text-gray-700">
                In Stock Items Only
              </span>
            </label>
          </div>

          {/* Price Range Slider / Inputs */}
          <div className="pt-3 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Price Range (Rs.)
            </h4>
            <div className="flex items-center gap-2 text-xs">
              <input
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                placeholder="Min"
                className="w-1/2 p-1.5 border border-gray-200 rounded-md text-xs focus:ring-1 focus:ring-primary-500"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                max="100000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                placeholder="Max"
                className="w-1/2 p-1.5 border border-gray-200 rounded-md text-xs focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Brands */}
          <div className="pt-3 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Featured Brands
            </h4>
            <div className="space-y-1.5 text-xs">
              {SEED_BRANDS.map((brand) => (
                <label key={brand.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand.name)}
                    onChange={() => toggleBrand(brand.name)}
                    className="w-3.5 h-3.5 rounded text-primary-600"
                  />
                  <span className="text-gray-700 font-medium">{brand.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Minimum Rating */}
          <div className="pt-3 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Rating
            </h4>
            <div className="space-y-1 text-xs">
              {[4, 3, 2].map((stars) => (
                <button
                  key={stars}
                  onClick={() => setMinRating(minRating === stars ? 0 : stars)}
                  className={`w-full flex items-center gap-1.5 px-2 py-1 rounded text-left ${
                    minRating === stars ? 'bg-primary-50 text-primary-700 font-bold' : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex text-gold-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < stars ? 'fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-gray-600">& up</span>
                </button>
              ))}
            </div>
          </div>

          {isMobileFilterOpen && (
            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full mt-4 py-2.5 bg-primary-600 text-white font-bold rounded-xl text-xs"
            >
              Apply Filters ({filteredProducts.length} items)
            </button>
          )}
        </aside>

        {/* Main Products Grid Area */}
        <main className="flex-1">
          {/* Sorting Bar */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
            <span className="text-xs text-gray-500 font-medium">
              Showing <span className="font-bold text-gray-900">{filteredProducts.length}</span> products
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 hidden sm:inline">{t('sort')}:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg py-1.5 px-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="relevance">Featured & Relevant</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-primary-600 mb-3">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-gray-900">No products match your filters</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mb-4">
                Try widening your price range, clearing brand checkboxes, or checking out our trending Nepali crafts.
              </p>
              <button
                onClick={handleResetFilters}
                className="py-2 px-4 rounded-xl bg-primary-600 text-white text-xs font-bold hover:bg-primary-700 shadow-sm"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
