import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import { authService } from '../services/authService';
import {
  ShieldAlert,
  Lock,
  UserCheck,
  KeyRound,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Crown,
  ShieldCheck,
  Award,
  LifeBuoy
} from 'lucide-react';

export const StaffLoginView: React.FC = () => {
  const { setUser } = useAuthStore();
  const { navigate, showToast } = useUIStore();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [staffPin, setStaffPin] = useState('990011');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const routeByRole = (role: string) => {
    if (role === 'owner' || role === 'sradmin') {
      navigate('admin_panel');
    } else if (role === 'brand_manager') {
      navigate('brand_portal');
    } else if (role === 'helper') {
      navigate('helper_portal');
    } else {
      navigate('staff_profile');
    }
  };

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length <= 7) {
      setErrorMsg('Staff security passcode must be more than 7 characters.');
      return;
    }

    setLoading(true);
    try {
      const { user } = await authService.staffLogin(identifier, password, staffPin);
      setUser(user);
      showToast(`Staff verified: Welcome, ${user.name} (${user.role.toUpperCase()})`, 'success');
      routeByRole(user.role);
    } catch (err: any) {
      setErrorMsg(err.message || 'Staff authentication rejected.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStaffLogin = async (staffEmail: string) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const { user } = await authService.staffLogin(staffEmail, 'password123', '990011');
      setUser(user);
      showToast(`Authenticated as ${user.name} (${user.role.toUpperCase()})`, 'success');
      routeByRole(user.role);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed quick staff login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-slate-950 text-gray-100 py-12">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-900/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />

        {/* Security Crest */}
        <div className="flex flex-col items-center text-center mb-8 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-primary-500/20 border border-amber-500/30 flex items-center justify-center text-gold-400 mb-3 shadow-lg">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <span className="bg-red-500/20 border border-red-500/30 text-red-300 font-mono text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest mb-2">
            RESTRICTED INTERNAL OPERATIONS
          </span>

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            NepaleseStore Staff Operations Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Dedicated internal gateway for Platform Owner, Senior Administrators, Brand Managers, and Helpers.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Staff Login Form */}
        <form onSubmit={handleStaffLogin} className="space-y-4 text-xs relative z-10">
          <div>
            <label className="font-bold text-slate-300 block mb-1 uppercase text-[10px] tracking-wider">
              Work Email or Official Phone
            </label>
            <div className="relative">
              <UserCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="kshetrybinay@gmail.com or 9801122334"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1 uppercase text-[10px] tracking-wider">
              Security Passcode <span className="text-amber-400">(Must be more than 7 characters)</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Passcode (> 7 characters)"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Length: {password.length} characters {password.length > 7 ? '✓' : '(Must be > 7)'}
            </p>
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1 uppercase text-[10px] tracking-wider">
              Internal 2FA Security Token / PIN
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={staffPin}
                onChange={(e) => setStaffPin(e.target.value)}
                placeholder="e.g. 990011"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 mt-4"
          >
            <span>{loading ? 'Validating Staff Credentials...' : 'Authenticate Staff Access'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Staff Tier Access Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-800 relative z-10">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider text-center mb-3">
            Quick Authorized Staff Personnel
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQuickStaffLogin('kshetrybinay@gmail.com')}
              className="p-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-950/80 border border-purple-800 text-left transition-colors flex items-center gap-2"
            >
              <Crown className="w-4 h-4 text-gold-400 shrink-0" />
              <div>
                <p className="font-bold text-purple-200">Binay Kshetry</p>
                <span className="text-[10px] text-purple-400 uppercase font-bold">👑 Top Owner</span>
              </div>
            </button>

            <button
              onClick={() => handleQuickStaffLogin('rohan.sradmin@nepalstore.test')}
              className="p-2.5 rounded-xl bg-red-950/40 hover:bg-red-950/80 border border-red-800 text-left transition-colors flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-red-400 shrink-0" />
              <div>
                <p className="font-bold text-red-200">Rohan Sharma</p>
                <span className="text-[10px] text-red-400 uppercase font-bold">🛡️ Sr. Admin</span>
              </div>
            </button>

            <button
              onClick={() => handleQuickStaffLogin('sita.brands@nepalstore.test')}
              className="p-2.5 rounded-xl bg-amber-950/40 hover:bg-amber-950/80 border border-amber-800 text-left transition-colors flex items-center gap-2"
            >
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <p className="font-bold text-amber-200">Sita Dahal</p>
                <span className="text-[10px] text-amber-400 uppercase font-bold">🏷️ Brand Mgr</span>
              </div>
            </button>

            <button
              onClick={() => handleQuickStaffLogin('bikash.helper@nepalstore.test')}
              className="p-2.5 rounded-xl bg-blue-950/40 hover:bg-blue-950/80 border border-blue-800 text-left transition-colors flex items-center gap-2"
            >
              <LifeBuoy className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <p className="font-bold text-blue-200">Bikash Tamang</p>
                <span className="text-[10px] text-blue-400 uppercase font-bold">🤝 Helper Desk</span>
              </div>
            </button>
          </div>

          <div className="mt-5 text-center">
            <button
              onClick={() => navigate('auth')}
              className="text-xs text-slate-400 hover:text-white transition-colors underline"
            >
              ← Return to Customer Store Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
