/**
 * Hamrobazar-style Classifieds Service
 * Enables free posting, photo uploads, anti-scraping phone reveal, and filters
 */

import { ClassifiedAd } from '../types/models';
import { SEED_CLASSIFIED_ADS } from '../mocks/seed-data';

const BAZAAR_STORAGE_KEY = 'ns_bazaar_ads_v1';

function getStoredAds(): ClassifiedAd[] {
  if (typeof window === 'undefined') return SEED_CLASSIFIED_ADS;
  const saved = localStorage.getItem(BAZAAR_STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(BAZAAR_STORAGE_KEY, JSON.stringify(SEED_CLASSIFIED_ADS));
    return SEED_CLASSIFIED_ADS;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return SEED_CLASSIFIED_ADS;
  }
}

function saveAdsToStorage(ads: ClassifiedAd[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(BAZAAR_STORAGE_KEY, JSON.stringify(ads));
  }
}

export const bazaarService = {
  async getAll(): Promise<ClassifiedAd[]> {
    await new Promise((r) => setTimeout(r, 60));
    return getStoredAds();
  },

  async getById(id: string): Promise<ClassifiedAd | null> {
    await new Promise((r) => setTimeout(r, 60));
    const ads = getStoredAds();
    const ad = ads.find((a) => a.id === id);
    if (ad) {
      ad.views += 1;
      saveAdsToStorage(ads);
    }
    return ad || null;
  },

  async getByCategory(category: string): Promise<ClassifiedAd[]> {
    await new Promise((r) => setTimeout(r, 80));
    const ads = getStoredAds();
    if (!category || category === 'all') return ads.filter((a) => a.status === 'active');
    return ads.filter((a) => a.category === category && a.status === 'active');
  },

  async postAd(ad: Omit<ClassifiedAd, 'id' | 'views' | 'phoneRevealCount' | 'phoneVisible' | 'createdAt' | 'status'>): Promise<ClassifiedAd> {
    const ads = getStoredAds();
    const newAd: ClassifiedAd = {
      ...ad,
      id: `ad_${Date.now()}`,
      views: 0,
      phoneRevealCount: 0,
      phoneVisible: false,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    ads.unshift(newAd);
    saveAdsToStorage(ads);
    return newAd;
  },

  async revealPhone(adId: string): Promise<string> {
    const ads = getStoredAds();
    const ad = ads.find((a) => a.id === adId);
    if (!ad) throw new Error('Ad not found');
    ad.phoneRevealCount += 1;
    ad.phoneVisible = true;
    saveAdsToStorage(ads);
    return ad.sellerPhone;
  }
};
