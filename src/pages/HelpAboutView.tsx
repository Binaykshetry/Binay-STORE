import React, { useState } from 'react';
import { useUIStore } from '../store/useUIStore';
import { ShieldCheck, Truck, RotateCcw, Mail, Phone, MapPin, Send, HelpCircle } from 'lucide-react';

export const HelpAboutView: React.FC = () => {
  const { currentPage, showToast } = useUIStore();
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMsg, setContactMsg] = useState('');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Your message has been sent to NepaleseStore Customer Support. We will reply via SMS/call within 2 hours.', 'success');
    setContactName('');
    setContactPhone('');
    setContactMsg('');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl pb-16 space-y-12">
      {/* 1. About Us Hero */}
      <section className="bg-gradient-to-r from-primary-900 via-slate-900 to-secondary-900 text-white rounded-3xl p-8 sm:p-12 shadow-md">
        <span className="bg-gold-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
          OUR MISSION
        </span>
        <h1 className="text-2xl sm:text-4xl font-black mt-3 mb-2 tracking-tight">
          Nepal’s Trusted Online Bazaar
        </h1>
        <p className="text-xs sm:text-sm text-gray-200 leading-relaxed max-w-2xl">
          Founded in Kathmandu, NepaleseStore connects consumers across all 77 districts with genuine Himalayan handicrafts, organic mountain teas, and authentic consumer goods. We empower rural and urban artisans by removing intermediaries and providing secure digital payments.
        </p>
      </section>

      {/* 2. 7-Day Return Policy */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-900">7-Day Return & Refund Guarantee</h2>
            <p className="text-xs text-gray-500">Shop with complete peace of mind across Nepal</p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-gray-700 leading-relaxed">
          <p>
            • If an item arrives damaged, defective, or does not match its catalog description, you may request a full return or replacement within <strong>7 days</strong> of delivery.
          </p>
          <p>
            • Our courier partners will pick up the item directly from your doorstep in Kathmandu Valley and major cities.
          </p>
          <p>
            • Refunds are processed immediately upon inspection to your <strong>eSewa, Khalti, bank account, or NepaleseStore Wallet</strong>.
          </p>
        </div>
      </section>

      {/* 3. Delivery Zones & Rates */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-900">Nationwide Shipping Rates</h2>
            <p className="text-xs text-gray-500">Free delivery on orders above Rs. 2,000</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <h4 className="font-bold text-gray-900 text-sm">Kathmandu Valley (Ktm, Lalitpur, Bhaktapur)</h4>
            <p className="text-primary-600 font-extrabold text-base mt-1">Rs. 60 (1 - 2 Days)</p>
            <p className="text-gray-500 mt-1">Express rider delivery straight to your tole/street.</p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <h4 className="font-bold text-gray-900 text-sm">Major Cities (Pokhara, Biratnagar, Butwal, etc.)</h4>
            <p className="text-primary-600 font-extrabold text-base mt-1">Rs. 120 (2 - 3 Days)</p>
            <p className="text-gray-500 mt-1">Road and air cargo delivery via Nepal Express Courier.</p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <h4 className="font-bold text-gray-900 text-sm">Rest of Nepal (District Headquarters)</h4>
            <p className="text-primary-600 font-extrabold text-base mt-1">Rs. 180 (3 - 5 Days)</p>
            <p className="text-gray-500 mt-1">Standard dispatch covering mid-hill and Terai districts.</p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <h4 className="font-bold text-gray-900 text-sm">Remote & Mountain Districts</h4>
            <p className="text-primary-600 font-extrabold text-base mt-1">Rs. 250 (5 - 7 Days)</p>
            <p className="text-gray-500 mt-1">Covers Mustang, Manang, Dolpa, Humla, and Jumla.</p>
          </div>
        </div>
      </section>

      {/* 4. Frequently Asked Questions (FAQ) */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-black text-gray-900">Frequently Asked Questions</h2>
        </div>

        <div className="divide-y divide-gray-100 text-xs space-y-3">
          <div className="pt-3">
            <h4 className="font-bold text-gray-900 text-sm">Can I pay cash on delivery (COD)?</h4>
            <p className="text-gray-600 mt-1 leading-relaxed">
              Yes! Cash on Delivery is available across all 77 districts up to Rs. 50,000 per order. You pay physical cash to the delivery rider once your parcel arrives safely.
            </p>
          </div>

          <div className="pt-3">
            <h4 className="font-bold text-gray-900 text-sm">Are the Pashmina and Dhaka Topis genuine?</h4>
            <p className="text-gray-600 mt-1 leading-relaxed">
              Every handicraft is certified and sourced directly from authentic artisans in Patan, Palpa, and Mustang with hallmark certificates of authenticity.
            </p>
          </div>

          <div className="pt-3">
            <h4 className="font-bold text-gray-900 text-sm">How do I post a classified ad in Hamro Bazaar?</h4>
            <p className="text-gray-600 mt-1 leading-relaxed">
              Click on the "Bazaar" link in the top menu or bottom navigation bar, tap "+ Post Free Classified Ad", select your category, enter your asking price and phone number, and submit!
            </p>
          </div>
        </div>
      </section>

      {/* 5. Contact Support Form */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
        <h2 className="text-lg font-black text-gray-900 mb-1">Contact Customer Support</h2>
        <p className="text-xs text-gray-500 mb-6">Our Kathmandu customer desk is available Mon - Sat, 9 AM - 7 PM</p>

        <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Your Name *</label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Aarav Sharma"
                className="w-full p-2.5 border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Mobile Phone (98/97...) *</label>
              <input
                type="tel"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="9841234567"
                className="w-full p-2.5 border border-gray-300 rounded-xl font-mono"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Message or Query *</label>
            <textarea
              rows={4}
              required
              value={contactMsg}
              onChange={(e) => setContactMsg(e.target.value)}
              placeholder="Tell us how we can help you..."
              className="w-full p-2.5 border border-gray-300 rounded-xl"
            />
          </div>

          <button
            type="submit"
            className="py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Send Message</span>
          </button>
        </form>
      </section>
    </div>
  );
};
