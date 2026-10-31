import React, { useState, useEffect } from 'react';
import { bazaarService } from '../services/bazaarService';
import { ClassifiedAd } from '../types/models';
import { formatNPR } from '../lib/format';
import { useUIStore } from '../store/useUIStore';
import { useAuthStore } from '../store/useAuthStore';
import { NEPAL_PROVINCES } from '../lib/nepal-geo';
import {
  Tag,
  Plus,
  Phone,
  MessageCircle,
  MapPin,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  X,
  Send,
  Eye,
  Car,
  Home,
  Smartphone,
  Laptop,
  Briefcase
} from 'lucide-react';

export const BazaarView: React.FC = () => {
  const { navigate, showToast } = useUIStore();
  const { currentUser } = useAuthStore();

  const [ads, setAds] = useState<ClassifiedAd[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAdForDetail, setSelectedAdForDetail] = useState<ClassifiedAd | null>(null);

  // Post Ad Modal
  const [showPostAdModal, setShowPostAdModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ClassifiedAd['category']>('mobiles');
  const [newPrice, setNewPrice] = useState<number>(25000);
  const [newNegotiable, setNewNegotiable] = useState(true);
  const [newCondition, setNewCondition] = useState<ClassifiedAd['condition']>('Like New');
  const [newDesc, setNewDesc] = useState('');
  const [newProvince, setNewProvince] = useState('Bagmati Province');
  const [newDistrict, setNewDistrict] = useState('Kathmandu');
  const [newArea, setNewArea] = useState('New Road / Thamel');
  const [newPhone, setNewPhone] = useState(currentUser?.phone || '9841234567');
  const [newImageUrl, setNewImageUrl] = useState(
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80'
  );

  // Chat simulation
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: 'Seller', text: 'Namaste! Yes, the item is still available.', time: '10:15 AM' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const loadAds = async () => {
    const list = await bazaarService.getAll();
    setAds(list);
  };

  useEffect(() => {
    loadAds();
  }, []);

  const handleRevealPhone = async (adId: string) => {
    try {
      const phone = await bazaarService.revealPhone(adId);
      showToast(`Seller Phone Revealed: +977 ${phone}`, 'info');
      loadAds();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handlePostAdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) {
      showToast('Please provide an ad title and description', 'error');
      return;
    }

    await bazaarService.postAd({
      userId: currentUser?.id || 'guest',
      sellerName: currentUser?.name || 'Local Seller',
      sellerPhone: newPhone,
      sellerVerified: true,
      category: newCategory,
      title: newTitle.trim(),
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: newDesc.trim(),
      price: newPrice * 100, // into paisa
      isNegotiable: newNegotiable,
      condition: newCondition,
      province: newProvince,
      district: newDistrict,
      area: newArea,
      images: [newImageUrl],
      fields: {
        Condition: newCondition,
        Location: `${newArea}, ${newDistrict}`
      }
    });

    showToast('Your free classified ad was published to Hamro Bazaar!', 'success');
    setShowPostAdModal(false);
    loadAds();
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages([
      ...chatMessages,
      { sender: 'You', text: chatInput.trim(), time: 'Just now' }
    ]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'Seller',
          text: 'Thanks for inquiring! Can we meet around New Road tomorrow at 2 PM to inspect it?',
          time: 'Just now'
        }
      ]);
    }, 1200);
  };

  const categoryIcons: Record<string, React.ReactNode> = {
    all: <Tag className="w-3.5 h-3.5" />,
    vehicles: <Car className="w-3.5 h-3.5" />,
    properties: <Home className="w-3.5 h-3.5" />,
    mobiles: <Smartphone className="w-3.5 h-3.5" />,
    electronics: <Laptop className="w-3.5 h-3.5" />,
    jobs: <Briefcase className="w-3.5 h-3.5" />
  };

  const filteredAds = ads.filter((ad) => {
    if (selectedCategory !== 'all' && ad.category !== selectedCategory) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        ad.title.toLowerCase().includes(q) ||
        ad.description.toLowerCase().includes(q) ||
        ad.area.toLowerCase().includes(q) ||
        ad.district.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="bg-emerald-400 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
            HAMRO BAZAAR CLASSIFIEDS
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
            Nepal’s Free Classifieds Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mt-1">
            Connect directly with buyers and sellers across Kathmandu, Pokhara, and all 77 districts. Zero commission, genuine phone contacts.
          </p>
        </div>

        <button
          onClick={() => setShowPostAdModal(true)}
          className="bg-gold-500 hover:bg-gold-600 text-slate-950 font-black px-6 py-3 rounded-xl text-xs sm:text-sm shadow-xl flex items-center gap-2 shrink-0 active:scale-98 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+ Post Free Classified Ad</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search used motorbikes, iPhone, apartments in Kathmandu..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            {['all', 'vehicles', 'properties', 'mobiles', 'electronics', 'jobs'].map((catKey) => (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-3 py-2 rounded-xl text-xs font-bold capitalize flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                  selectedCategory === catKey
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {categoryIcons[catKey]}
                <span>{catKey}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Classified Ads Feed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAds.map((ad) => (
          <div
            key={ad.id}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              {/* Image box */}
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                <img
                  src={ad.images[0]}
                  alt={ad.title}
                  className="w-full h-full object-cover"
                />

                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded capitalize">
                    {ad.category}
                  </span>
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {ad.condition}
                  </span>
                </div>

                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{ad.views} views</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-black text-emerald-800">
                    {formatNPR(ad.price)}
                  </span>
                  {ad.isNegotiable && (
                    <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      Negotiable
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-gray-900 line-clamp-2 leading-snug">
                  {ad.title}
                </h3>

                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {ad.description}
                </p>

                <div className="flex items-center gap-1 text-[11px] text-gray-400 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                  <span>{ad.area}, {ad.district}</span>
                </div>

                {/* Dynamic attribute badges */}
                {ad.fields && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {Object.entries(ad.fields).map(([k, v]) => (
                      <span key={k} className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium">
                        {k}: {v}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Seller Contact & Actions */}
            <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-2">
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-gray-900 truncate">{ad.sellerName}</p>
                <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Individual
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setShowChatModal(true)}
                  className="p-2 rounded-xl bg-white border border-gray-300 text-gray-700 hover:text-emerald-700 hover:border-emerald-600 transition-colors"
                  title="Chat with seller"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleRevealPhone(ad.id)}
                  className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{ad.phoneVisible ? ad.sellerPhone : 'Call Seller'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Safety Notice Box */}
      <div className="mt-12 bg-amber-50 border border-amber-200 rounded-2xl p-5 text-xs text-amber-900 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm text-amber-950 mb-1">Hamro Bazaar Safety Reminder</h4>
          <p className="leading-relaxed">
            Always meet in a public location (e.g. Kathmandu Mall, Baneshwor chowk) to inspect second-hand vehicles or electronics in person before exchanging cash. Never wire advance token money via wallets before receiving the product.
          </p>
        </div>
      </div>

      {/* Post Ad Multi-step Modal */}
      {showPostAdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-base font-black text-gray-900">Post a Free Classified Ad</h3>
              <button onClick={() => setShowPostAdModal(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostAdSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl bg-white"
                >
                  <option value="mobiles">Mobiles & Tablets</option>
                  <option value="vehicles">Vehicles & Bikes</option>
                  <option value="properties">Land & Real Estate</option>
                  <option value="electronics">Laptops & Electronics</option>
                  <option value="jobs">Jobs & Services</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Ad Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Yamaha FZ 2022 well maintained or iPhone 13 128GB"
                  className="w-full p-2.5 border border-gray-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Asking Price (Rs.) *</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full p-2.5 border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Condition</label>
                  <select
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value as any)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl bg-white"
                  >
                    <option value="Brand New">Brand New</option>
                    <option value="Like New">Like New</option>
                    <option value="Used / Fair">Used / Fair</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                  <input
                    type="checkbox"
                    checked={newNegotiable}
                    onChange={(e) => setNewNegotiable(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Price is Negotiable</span>
                </label>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Mention servicing history, battery percentage, lot number or details..."
                  className="w-full p-2.5 border border-gray-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">District</label>
                  <input
                    type="text"
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Area / Tole</label>
                  <input
                    type="text"
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                    placeholder="e.g. Pulchowk / Baneshwor"
                    className="w-full p-2.5 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Contact Mobile (+977)</label>
                <input
                  type="text"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl font-mono"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPostAdModal(false)}
                  className="flex-1 py-2.5 border border-gray-300 rounded-xl font-bold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md"
                >
                  Publish Free Ad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-app Chat Simulation Modal */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl flex flex-col h-[460px] animate-in zoom-in-95 overflow-hidden">
            <div className="p-3.5 bg-emerald-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-xs">
                  💬
                </div>
                <div>
                  <h4 className="text-xs font-bold leading-none">Hamro Bazaar Seller Chat</h4>
                  <span className="text-[10px] text-emerald-200">Online | Fast Response</span>
                </div>
              </div>
              <button onClick={() => setShowChatModal(false)} className="text-emerald-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50 text-xs">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-gray-400 mb-0.5">{msg.sender} · {msg.time}</span>
                  <div
                    className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                      msg.sender === 'You'
                        ? 'bg-emerald-600 text-white rounded-tr-xs'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-tl-xs shadow-2xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about the item, negotiable price, or meeting location..."
                className="flex-1 p-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
