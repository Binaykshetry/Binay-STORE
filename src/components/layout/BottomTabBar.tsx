import React from 'react';
import { useUIStore, ActivePage } from '../../store/useUIStore';
import { useCartStore } from '../../store/useCartStore';
import { useLanguageStore } from '../../store/useLanguageStore';
import { Home, LayoutGrid, Tag, ShoppingBag, User } from 'lucide-react';

export const BottomTabBar: React.FC = () => {
  const { currentPage, navigate } = useUIStore();
  const { getItemCount, setMiniCartOpen } = useCartStore();
  const { t } = useLanguageStore();

  const count = getItemCount();

  const tabs: { id: ActivePage | 'mini_cart'; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: t('home'), icon: <Home className="w-5 h-5" /> },
    { id: 'catalog', label: t('categories'), icon: <LayoutGrid className="w-5 h-5" /> },
    { id: 'bazaar', label: 'Bazaar', icon: <Tag className="w-5 h-5" /> },
    { id: 'mini_cart', label: t('cart'), icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'account', label: t('account'), icon: <User className="w-5 h-5" /> }
  ];

  const handleTabClick = (id: ActivePage | 'mini_cart') => {
    if (id === 'mini_cart') {
      setMiniCartOpen(true);
      return;
    }
    navigate(id);
  };

  return (
    <nav className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 py-1.5 px-2 flex justify-around items-center shadow-lg">
      {tabs.map((tab) => {
        const isActive = currentPage === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors relative ${
              isActive ? 'text-primary-600 font-bold' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <div className="relative">
              {tab.icon}
              {tab.id === 'mini_cart' && count > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-primary-600 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight truncate max-w-[64px]">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
