import React, { useState, useEffect } from 'react';
import { useUIStore } from '../store/useUIStore';
import { useCartStore } from '../store/useCartStore';
import { productService } from '../services/productService';
import { Product } from '../types/models';
import { formatNPR } from '../lib/format';
import {
  Scale,
  X,
  Plus,
  Star,
  Check,
  ShieldCheck,
  ShoppingCart,
  ArrowLeft,
  ShoppingBag
} from 'lucide-react';

export const CompareView: React.FC = () => {
  const { navigate, showToast } = useUIStore();
  const { addItem } = useCartStore();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);
  const [selectorOpen, setSelectorOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const prods = await productService.getAll();
      setAllProducts(prods);
      // Pre-select first 3 products for comparison
      if (prods.length >= 3) {
        setComparedProducts([prods[0], prods[1], prods[2]]);
      } else {
        setComparedProducts(prods);
      }
    }
    load();
  }, []);

  const handleRemove = (productId: string) => {
    setComparedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleAddProduct = (product: Product) => {
    if (comparedProducts.some((p) => p.id === product.id)) {
      showToast('Product already added to comparison.', 'info');
      return;
    }
    if (comparedProducts.length >= 4) {
      showToast('You can compare a maximum of 4 products.', 'error');
      return;
    }
    setComparedProducts((prev) => [...prev, product]);
    setSelectorOpen(false);
  };

  const handleAddToCart = (product: Product) => {
    const defaultVariant = product.variants[0] || {
      id: `${product.id}_def`,
      productId: product.id,
      sku: product.slug,
      name: 'Standard',
      options: {},
      price: product.basePrice,
      stock: 50,
      reserved: 0
    };
    addItem(product, defaultVariant, 1);
    showToast(`Added ${product.nameEn} to your cart`, 'success');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <button onClick={() => navigate('home')} className="hover:text-primary-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
        <span>/</span>
        <span className="font-bold text-gray-800">Compare Products</span>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <Scale className="w-6 h-6 text-primary-600" />
            <span>Product Comparison</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Compare prices, authentic artisan materials, specifications, and warranty side-by-side.
          </p>
        </div>

        {comparedProducts.length < 4 && (
          <button
            onClick={() => setSelectorOpen(true)}
            className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product to Compare ({comparedProducts.length}/4)</span>
          </button>
        )}
      </div>

      {/* Comparison Table */}
      {comparedProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8">
          <Scale className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">No products selected for comparison</h3>
          <p className="text-xs text-gray-500 mt-1 mb-4">Select items from our catalog to compare them side-by-side.</p>
          <button
            onClick={() => setSelectorOpen(true)}
            className="px-4 py-2 bg-primary-600 text-white font-bold text-xs rounded-xl shadow-sm"
          >
            Select Products
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="p-4 w-44 font-bold text-gray-500 uppercase text-[10px] tracking-wider sticky left-0 bg-gray-50">
                    Product Summary
                  </th>
                  {comparedProducts.map((p) => (
                    <th key={p.id} className="p-4 min-w-[220px] max-w-[260px] align-top">
                      <div className="relative">
                        <button
                          onClick={() => handleRemove(p.id)}
                          className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gray-200 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors text-gray-600"
                          title="Remove from compare"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <img
                          src={p.images[0]}
                          alt={p.nameEn}
                          className="w-full h-36 object-cover rounded-2xl border border-gray-100 shadow-xs mb-3"
                        />
                        <h3 className="font-bold text-xs text-gray-900 line-clamp-2">{p.nameEn}</h3>
                        <p className="text-[11px] text-gray-400 mt-0.5">{p.brandName || p.sellerName}</p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {/* Price Row */}
                <tr>
                  <td className="p-4 font-bold text-gray-900 sticky left-0 bg-white">Base Price</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-4">
                      <span className="text-base font-black text-primary-700 font-mono">
                        {formatNPR(p.basePrice)}
                      </span>
                      <span className="text-[10px] text-emerald-700 block font-bold">13% VAT Inclusive</span>
                    </td>
                  ))}
                </tr>

                {/* Rating Row */}
                <tr>
                  <td className="p-4 font-bold text-gray-900 sticky left-0 bg-white">Customer Rating</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-4">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span>{p.ratingAvg.toFixed(1)}</span>
                        <span className="text-gray-400 font-normal">({p.ratingCount} reviews)</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Category Row */}
                <tr>
                  <td className="p-4 font-bold text-gray-900 sticky left-0 bg-white">Category</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-4 font-medium text-gray-800 capitalize">
                      {p.categorySlug}
                    </td>
                  ))}
                </tr>

                {/* Seller Row */}
                <tr>
                  <td className="p-4 font-bold text-gray-900 sticky left-0 bg-white">Seller</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-4 font-medium text-gray-800 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{p.sellerName}</span>
                    </td>
                  ))}
                </tr>

                {/* Cash on Delivery Row */}
                <tr>
                  <td className="p-4 font-bold text-gray-900 sticky left-0 bg-white">Cash on Delivery</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-4">
                      {p.codAvailable ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <Check className="w-4 h-4" /> Available (COD)
                        </span>
                      ) : (
                        <span className="text-gray-400">Online Payment Only</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Warranty Row */}
                <tr>
                  <td className="p-4 font-bold text-gray-900 sticky left-0 bg-white">Warranty & Guarantee</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-4 font-medium text-gray-800">
                      {p.warrantyPeriod || '7-Day Return Guarantee'}
                    </td>
                  ))}
                </tr>

                {/* Action Row */}
                <tr className="bg-gray-50/50">
                  <td className="p-4 font-bold text-gray-900 sticky left-0 bg-gray-50">Cart Action</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-4">
                      <button
                        onClick={() => handleAddToCart(p)}
                        className="w-full py-2.5 px-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-98"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Selector Modal */}
      {selectorOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl animate-in zoom-in-95 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b mb-3">
              <h3 className="text-base font-bold text-gray-900">Select Product to Add</h3>
              <button
                onClick={() => setSelectorOpen(false)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            <div className="divide-y overflow-y-auto flex-1">
              {allProducts.map((product) => {
                const isSelected = comparedProducts.some((p) => p.id === product.id);
                return (
                  <div
                    key={product.id}
                    className="p-3 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0]}
                        alt={product.nameEn}
                        className="w-12 h-12 rounded-xl object-cover border shrink-0"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{product.nameEn}</h4>
                        <p className="text-[11px] text-gray-400">{product.sellerName} · {formatNPR(product.basePrice)}</p>
                      </div>
                    </div>

                    <button
                      disabled={isSelected}
                      onClick={() => handleAddProduct(product)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-40 bg-primary-600 hover:bg-primary-700 text-white"
                    >
                      {isSelected ? 'Added' : 'Compare'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

