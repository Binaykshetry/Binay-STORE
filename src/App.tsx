/**
 * NepaleseStore - Main Application Entrypoint
 * Nepal's Trusted Online Bazaar & Multi-Vendor E-Commerce Marketplace
 */

import React from 'react';
import { useUIStore } from './store/useUIStore';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { BottomTabBar } from './components/layout/BottomTabBar';
import { MobileNavDrawer } from './components/layout/MobileNavDrawer';
import { MiniCartDrawer } from './components/ui/MiniCartDrawer';
import { ToastContainer } from './components/ui/ToastContainer';
import { AuthModal } from './components/ui/AuthModal';

import { HomeView } from './pages/HomeView';
import { CatalogView } from './pages/CatalogView';
import { ProductDetailView } from './pages/ProductDetailView';
import { CartView } from './pages/CartView';
import { CheckoutView } from './pages/CheckoutView';
import { OrderSuccessView } from './pages/OrderSuccessView';
import { TrackOrderView } from './pages/TrackOrderView';
import { BrandStoreView } from './pages/BrandStoreView';
import { SellerStoreView } from './pages/SellerStoreView';
import { CompareView } from './pages/CompareView';
import { CollectionsView } from './pages/CollectionsView';
import { AccountView } from './pages/AccountView';
import { SellerCenterView } from './pages/SellerCenterView';
import { AdminPanelView } from './pages/AdminPanelView';
import { BazaarView } from './pages/BazaarView';
import { DealsView } from './pages/DealsView';
import { HelpAboutView } from './pages/HelpAboutView';
import { AuthView } from './pages/AuthView';
import { BrandManagerView } from './pages/BrandManagerView';
import { HelperSupportView } from './pages/HelperSupportView';
import { StaffLoginView } from './pages/StaffLoginView';
import { StaffProfileView } from './pages/StaffProfileView';

export default function App() {
  const { currentPage, navigate } = useUIStore();

  // URL Hash synchronization for back/forward browser buttons and deep links
  React.useEffect(() => {
    const handleHashSync = () => {
      const hash = window.location.hash.replace(/^#\//, '');
      if (hash && hash !== currentPage) {
        const validPages = [
          'home', 'catalog', 'product_detail', 'cart', 'checkout', 'order_success',
          'track_order', 'account', 'seller_center', 'seller_store', 'admin_panel',
          'bazaar', 'bazaar_detail', 'deals', 'brand_store', 'compare', 'collections',
          'about', 'faq', 'contact', 'auth', 'brand_portal', 'helper_portal',
          'staff_login', 'staff_profile'
        ];
        if (validPages.includes(hash)) {
          navigate(hash as any);
        }
      }
    };

    window.addEventListener('hashchange', handleHashSync);
    // Initial check on load
    handleHashSync();
    return () => window.removeEventListener('hashchange', handleHashSync);
  }, [currentPage, navigate]);

  const renderCurrentView = () => {
    switch (currentPage) {
      case 'home':
        return <HomeView />;
      case 'catalog':
        return <CatalogView />;
      case 'product_detail':
        return <ProductDetailView />;
      case 'cart':
        return <CartView />;
      case 'checkout':
        return <CheckoutView />;
      case 'order_success':
        return <OrderSuccessView />;
      case 'track_order':
        return <TrackOrderView />;
      case 'account':
        return <AccountView />;
      case 'seller_center':
        return <SellerCenterView />;
      case 'seller_store':
        return <SellerStoreView />;
      case 'admin_panel':
        return <AdminPanelView />;
      case 'bazaar':
      case 'bazaar_detail':
        return <BazaarView />;
      case 'deals':
        return <DealsView />;
      case 'brand_store':
        return <BrandStoreView />;
      case 'compare':
        return <CompareView />;
      case 'collections':
        return <CollectionsView />;
      case 'about':
      case 'faq':
      case 'contact':
        return <HelpAboutView />;
      case 'auth':
        return <AuthView />;
      case 'brand_portal':
        return <BrandManagerView />;
      case 'helper_portal':
        return <HelperSupportView />;
      case 'staff_login':
        return <StaffLoginView />;
      case 'staff_profile':
        return <StaffProfileView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between font-sans selection:bg-primary-500 selection:text-white">
      {/* Notifications Toast Provider */}
      <ToastContainer />

      {/* Global In-Page Login & Signup Modal */}
      <AuthModal />

      {/* Slide-in Mobile Drawer */}
      <MobileNavDrawer />

      {/* Slide-in Mini-Cart Drawer */}
      <MiniCartDrawer />

      {/* Main Global Header */}
      <Header />

      {/* Page Content Body */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Main Global Footer */}
      <Footer />

      {/* Mobile Sticky Bottom Tab Bar */}
      <BottomTabBar />
    </div>
  );
}
