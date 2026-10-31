/**
 * Product & Catalog Service
 * Implements filtering, sorting, fuzzy search, categories, and review handling
 */

import { Product, Category, Brand } from '../types/models';
import { SEED_PRODUCTS, SEED_CATEGORIES, SEED_BRANDS } from '../mocks/seed-data';

// Local storage key for dynamic products (e.g. newly added by seller)
const PRODUCTS_STORAGE_KEY = 'ns_products_v1';

function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') return SEED_PRODUCTS;
  const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(SEED_PRODUCTS));
    return SEED_PRODUCTS;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return SEED_PRODUCTS;
  }
}

export function saveProductsToStorage(products: Product[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  }
}

export const productService = {
  async getAll(): Promise<Product[]> {
    await new Promise((r) => setTimeout(r, 80));
    return getStoredProducts();
  },

  async getPublished(): Promise<Product[]> {
    await new Promise((r) => setTimeout(r, 60));
    return getStoredProducts().filter((p) => p.status === 'published');
  },

  async getBySlug(slug: string): Promise<Product | null> {
    await new Promise((r) => setTimeout(r, 80));
    const products = getStoredProducts();
    return products.find((p) => p.slug === slug) || null;
  },

  async getByCategory(categorySlug: string): Promise<Product[]> {
    await new Promise((r) => setTimeout(r, 80));
    const products = getStoredProducts();
    if (categorySlug === 'all') return products.filter((p) => p.status === 'published');
    return products.filter((p) => p.categorySlug === categorySlug && p.status === 'published');
  },

  async getFlashDeals(): Promise<Product[]> {
    await new Promise((r) => setTimeout(r, 60));
    return getStoredProducts().filter((p) => p.isFlashDeal && p.status === 'published');
  },

  async getNepaliSpecials(): Promise<Product[]> {
    await new Promise((r) => setTimeout(r, 60));
    return getStoredProducts().filter((p) => p.isNepaliCraft && p.status === 'published');
  },

  async getCategories(): Promise<Category[]> {
    return SEED_CATEGORIES;
  },

  async getBrands(): Promise<Brand[]> {
    return SEED_BRANDS;
  },

  async search(query: string, categoryFilter?: string): Promise<Product[]> {
    await new Promise((r) => setTimeout(r, 120));
    const term = query.toLowerCase().trim();
    let list = getStoredProducts().filter((p) => p.status === 'published');

    if (categoryFilter && categoryFilter !== 'all') {
      list = list.filter((p) => p.categorySlug === categoryFilter);
    }

    if (!term) return list;

    return list.filter((p) => {
      return (
        p.nameEn.toLowerCase().includes(term) ||
        p.nameNe.toLowerCase().includes(term) ||
        p.shortDescEn.toLowerCase().includes(term) ||
        p.sellerName.toLowerCase().includes(term) ||
        (p.brandName && p.brandName.toLowerCase().includes(term))
      );
    });
  },

  async addProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    const products = getStoredProducts();
    const newProduct: Product = {
      ...product,
      id: `prod_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    products.unshift(newProduct);
    saveProductsToStorage(products);
    return newProduct;
  },

  async updateProductStatus(productId: string, status: Product['status']): Promise<void> {
    const products = getStoredProducts();
    const index = products.findIndex((p) => p.id === productId);
    if (index !== -1) {
      products[index].status = status;
      saveProductsToStorage(products);
    }
  }
};
