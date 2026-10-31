import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import {
  Crown,
  ShieldCheck,
  Award,
  LifeBuoy,
  KeyRound,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  History,
  Building,
  Mail,
  Phone,
  Calendar,
  Sparkles
} from 'lucide-react';

export const StaffProfileView: React.FC = () => {
  const { currentUser } = useAuthStore();
  const { navigate, showToast } = useUIStore();

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  if (!currentUser) {
    navigate('staff_login');
    return null;
  }

  const role = currentUser.role;

  // Rank and hierarchy configuration
  const roleConfig: Record<
    string,
    {
      title: string;
      tier: string;
      level: number;
      badgeColor: string;
      department: string;
      icon: React.ReactNode;
      canChangeRoles: boolean;
      portalRoute: any;
      permissions: string[];
    }
  > = {
    owner: {
      title: 'Platform Owner',
      tier: 'Top Executive (Tier 1)',
      level: 1,
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
      department: 'Executive Governance & Financials',
      icon: <Crown className="w-8 h-8 text-gold-400" />,
      canChangeRoles: true,
      portalRoute: 'admin_panel',
      permissions: [
        'Immutable Top Ownership authority',
        'Transfer Admin into Helper or Normal User positions',
        'Appoint & promote staff to any operational rank',
        'Direct bank account & commission revenue oversight',
        'Database & Audit log access'
      ]
    },
    sradmin: {
      title: 'Senior Administrator',
      tier: 'Operations Management (Tier 2)',
      level: 2,
      badgeColor: 'bg-red-100 text-red-900 border-red-300',
      department: 'Platform Operations & Catalog Moderation',
      icon: <ShieldCheck className="w-8 h-8 text-red-600" />,
      canChangeRoles: true,
      portalRoute: 'admin_panel',
      permissions: [
        'Cannot alter or demote Owner position',
        'Can re-assign Helper, Brand Manager, and User roles',
        'Force override order states (Packed, Shipped, Delivered, Refunded)',
        'Review and approve marketplace seller KYC documents',
        'Product catalog approval and rejection'
      ]
    },
    brand_manager: {
      title: 'Brand Manager',
      tier: 'Merchandising & Partnerships (Tier 3)',
      level: 3,
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      department: 'Brand Storefronts & Campaigns',
      icon: <Award className="w-8 h-8 text-amber-600" />,
      canChangeRoles: false,
      portalRoute: 'brand_portal',
      permissions: [
        'Curate official brand storefronts (Samsung, Palpali, Patan, Ilam)',
        'Assign official brand & national warranty badges',
        'Manage festive banner campaigns and promotions',
        'No staff role alteration permissions'
      ]
    },
    helper: {
      title: 'Customer Support Helper',
      tier: 'Customer Care & Helpdesk (Tier 4)',
      level: 4,
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
      department: 'Support Helpdesk & Dispatch Coordination',
      icon: <LifeBuoy className="w-8 h-8 text-blue-600" />,
      canChangeRoles: false,
      portalRoute: 'helper_portal',
      permissions: [
        'Manage live customer support inquiry tickets',
        'Resolve delivery disputes with Kathmandu courier riders',
        'Verify customer wallet and payment inquiries',
        'No staff role alteration permissions'
      ]
    },
    seller: {
      title: 'Registered Business Seller',
      tier: 'Marketplace Merchant',
      level: 5,
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      department: 'Merchant Catalog & Fulfillment',
      icon: <Building className="w-8 h-8 text-emerald-600" />,
      canChangeRoles: false,
      portalRoute: 'seller_center',
      permissions: [
        'Manage seller store products & inventory',
        'Fulfill and pack incoming customer orders',
        'Request bank payout of earnings'
      ]
    },
    user: {
      title: 'Normal User / Customer',
      tier: 'Shopper Tier',
      level: 6,
      badgeColor: 'bg-gray-100 text-gray-900 border-gray-300',
      department: 'General User Account',
      icon: <CheckCircle2 className="w-8 h-8 text-gray-600" />,
      canChangeRoles: false,
      portalRoute: 'account',
      permissions: [
        'Browse catalog and buy products with COD/eSewa/Khalti',
        'Manage delivery address book and wishlist',
        'Post classified ads on Hamro Bazaar'
      ]
    }
  };

  const currentRoleInfo = roleConfig[role] || roleConfig.user;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl pb-20">
      {/* Header Profile Badge Card */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-primary-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8 relative overflow-hidden border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center p-3 shadow-inner shrink-0">
              {currentRoleInfo.icon}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border ${currentRoleInfo.badgeColor}`}>
                  RANK {currentRoleInfo.level}: {currentRoleInfo.tier}
                </span>
                {role === 'owner' && (
                  <span className="bg-gold-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    IMMUTABLE TOP ROLE
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{currentUser.name}</h1>
              <p className="text-xs text-gray-300 mt-0.5 font-medium">
                Official Staff ID: <span className="font-mono text-gold-300">NS-STAFF-{role.toUpperCase().slice(0, 5)}-01</span> · {currentRoleInfo.department}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate(currentRoleInfo.portalRoute)}
              className="bg-primary-600 hover:bg-primary-700 text-white font-extrabold px-5 py-3 rounded-xl text-xs sm:text-sm shadow-lg flex items-center gap-2 transition-all"
            >
              <span>Launch Workspace Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Role Privileges & Hierarchy Rules (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Hierarchy Rules Notice Box */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs">
            <h2 className="text-sm font-black text-gray-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary-600" />
              <span>Staff Hierarchy & Position Transition Protocol</span>
            </h2>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2 text-xs text-gray-700 leading-relaxed">
              <p>
                • <strong className="text-purple-900">Owner (Top Rank):</strong> The Owner role is permanent and cannot be modified or demoted by any admin or system action. The Owner has full authority to transfer Admins into Helpers, Normal Users, or any other position.
              </p>
              <p>
                • <strong className="text-red-900">Senior Admin:</strong> Cannot change the Owner role or appoint new Owners. Can re-assign and promote other roles (Helper, Brand Manager, Normal Users).
              </p>
              <p>
                • <strong className="text-gray-600">Helpers & Brand Managers:</strong> Dedicated operational execution without user role modification permissions.
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                Active Permissions Assigned to Your Account:
              </h3>
              <ul className="space-y-1.5 text-xs text-gray-600">
                {currentRoleInfo.permissions.map((perm, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{perm}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Staff Workspace Switcher */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs">
            <h3 className="text-sm font-black text-gray-900 mb-4">Operational Workspaces</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div
                onClick={() => navigate('admin_panel')}
                className="p-3.5 rounded-xl border border-gray-200 hover:border-purple-500 cursor-pointer hover:bg-purple-50/50 transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-gray-900">Owner / Admin Console</span>
                  <Crown className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-gray-500 text-[11px]">Manage GMV, moderation, staff positions & coupons.</p>
              </div>

              <div
                onClick={() => navigate('brand_portal')}
                className="p-3.5 rounded-xl border border-gray-200 hover:border-amber-500 cursor-pointer hover:bg-amber-50/50 transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-gray-900">Brand Manager Portal</span>
                  <Award className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-gray-500 text-[11px]">Official brands, hallmark verification & campaigns.</p>
              </div>

              <div
                onClick={() => navigate('helper_portal')}
                className="p-3.5 rounded-xl border border-gray-200 hover:border-blue-500 cursor-pointer hover:bg-blue-50/50 transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-gray-900">Helper Support Desk</span>
                  <LifeBuoy className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-gray-500 text-[11px]">Customer care tickets, dispute mediation & chats.</p>
              </div>

              <div
                onClick={() => navigate('seller_center')}
                className="p-3.5 rounded-xl border border-gray-200 hover:border-emerald-500 cursor-pointer hover:bg-emerald-50/50 transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-gray-900">Seller Center</span>
                  <Building className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-gray-500 text-[11px]">Products, stock matrix & courier dispatch.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Profile & Security Clearance (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-black text-gray-900 border-b border-gray-100 pb-3">
              Staff Clearance Details
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-bold">Email Address</span>
                  <span className="font-semibold text-gray-800">{currentUser.email || 'Not specified'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-bold">Mobile Phone</span>
                  <span className="font-semibold text-gray-800 font-mono">
                    {currentUser.phone ? `+977 ${currentUser.phone}` : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-bold">Appointment Date</span>
                  <span className="font-semibold text-gray-800">January 01, 2025</span>
                </div>
              </div>
            </div>

            {/* Security Status */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
                <div>
                  <p className="font-bold text-xs text-gray-900">Two-Factor Authentication (2FA)</p>
                  <p className="text-[11px] text-gray-500">Hardware token or SMS passcode</p>
                </div>
                <button
                  onClick={() => {
                    setTwoFactorEnabled(!twoFactorEnabled);
                    showToast(twoFactorEnabled ? '2FA disabled' : '2FA security enabled', 'info');
                  }}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                    twoFactorEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {twoFactorEnabled ? 'Active ✓' : 'Inactive'}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Return */}
          <button
            onClick={() => navigate('home')}
            className="w-full py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ← Return to Consumer Marketplace
          </button>
        </div>
      </div>
    </div>
  );
};
