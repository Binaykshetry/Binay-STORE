import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import { Role } from '../types/models';
import { Logo } from '../components/ui/Logo';
import {
  Phone,
  Mail,
  Building2,
  Lock,
  User as UserIcon,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  KeyRound
} from 'lucide-react';

interface AuthViewProps {
  initialMode?: 'login' | 'signup';
}

export const AuthView: React.FC<AuthViewProps> = ({ initialMode = 'login' }) => {
  const { loginWithCredentials, signupWithCredentials, loginAs } = useAuthStore();
  const { navigate, showToast } = useUIStore();

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [signupMethod, setSignupMethod] = useState<'phone' | 'email' | 'business'>('phone');

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [role, setRole] = useState<Role>('user');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Login identifier
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // OTP Step Simulation
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [pendingSignupPayload, setPendingSignupPayload] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Password length validation: User specifically asked for "more than 7line" (i.e. length > 7)
  const isPasswordLengthValid = password.length > 7;
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  const isPasswordStrong = isPasswordLengthValid && hasNumber && hasLetter;

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (password.length <= 7) {
      setErrorMsg('Password must be more than 7 characters (minimum 8 characters).');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (signupMethod === 'phone') {
      const cleanPhone = phone.replace(/[\s-+]/g, '').replace(/^977/, '');
      if (!/^(98|97)\d{8}$/.test(cleanPhone)) {
        setErrorMsg('Please provide a valid 10-digit Nepali mobile number (98... or 97...).');
        return;
      }
    } else if (signupMethod === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setErrorMsg('Please provide a valid email address.');
        return;
      }
    } else if (signupMethod === 'business') {
      if (!businessName.trim()) {
        setErrorMsg('Please provide your registered store or company name.');
        return;
      }
      if (!/^\d{9}$/.test(panNumber.trim())) {
        setErrorMsg('Please enter a valid 9-digit PAN/VAT number.');
        return;
      }
    }

    // Trigger OTP modal to verify ownership
    setPendingSignupPayload({
      name,
      phone: signupMethod === 'phone' || signupMethod === 'business' ? phone : undefined,
      email: signupMethod === 'email' || signupMethod === 'business' ? email : undefined,
      password,
      accountType: signupMethod,
      role: signupMethod === 'business' ? 'seller' : role,
      businessName: signupMethod === 'business' ? businessName : undefined,
      panNumber: signupMethod === 'business' ? panNumber : undefined
    });
    setShowOtpModal(true);
  };

  const handleVerifyOtpAndComplete = async () => {
    if (otpCode.trim() !== '123456') {
      setErrorMsg('Invalid OTP. Use test code 123456.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const user = await signupWithCredentials(pendingSignupPayload);
      setShowOtpModal(false);
      showToast(`Account created! Welcome, ${user.name} (${user.role.toUpperCase()})`, 'success');

      // Navigate to corresponding landing dashboard
      if (user.role === 'owner' || user.role === 'sradmin') {
        navigate('admin_panel');
      } else if (user.role === 'seller') {
        navigate('seller_center');
      } else {
        navigate('home');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to complete signup');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginIdentifier.trim() || !loginPassword) {
      setErrorMsg('Please enter both your identifier and password.');
      return;
    }

    if (loginPassword.length <= 7) {
      setErrorMsg('Password must be more than 7 characters.');
      return;
    }

    setLoading(true);
    try {
      const user = await loginWithCredentials(loginIdentifier, loginPassword);
      showToast(`Welcome back, ${user.name}! (${user.role.toUpperCase()})`, 'success');

      if (user.role === 'owner' || user.role === 'sradmin') {
        navigate('admin_panel');
      } else if (user.role === 'seller') {
        navigate('seller_center');
      } else {
        navigate('home');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-xl">
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-lg">
        {/* Logo & Heading */}
        <div className="flex flex-col items-center text-center mb-8">
          <Logo size="lg" />
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-4 tracking-tight">
            {mode === 'login' ? 'Sign in to NepaleseStore' : 'Create Your NepaleseStore Account'}
          </h2>
          <p className="text-xs text-gray-500 mt-1 max-w-sm">
            Access shopping, track shipments, post ads on Hamro Bazaar, or manage your business.
          </p>
        </div>

        {/* Toggle Login / Signup */}
        <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-6 text-xs font-bold">
          <button
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              mode === 'login' ? 'bg-white text-gray-900 shadow-sm font-extrabold' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('signup');
              setErrorMsg('');
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              mode === 'signup' ? 'bg-white text-primary-600 shadow-sm font-extrabold' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            New Registration
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* --- LOGIN FORM --- */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">
                Mobile Number or Email
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="9841234567 or email@domain.com"
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-gray-700">Password</label>
                <button
                  type="button"
                  onClick={() => showToast('Test password is: password123', 'info')}
                  className="text-primary-600 hover:underline text-[11px]"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Minimum 8 characters (> 7 characters)"
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-extrabold rounded-xl shadow-md text-sm transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* --- SIGNUP FORM --- */}
        {mode === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-4 text-xs">
            {/* Account Type Selector */}
            <div>
              <label className="font-bold text-gray-700 block mb-1.5 uppercase text-[10px] tracking-wider">
                Registration Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSignupMethod('phone')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    signupMethod === 'phone'
                      ? 'border-primary-600 bg-primary-50 text-primary-700 font-bold ring-1 ring-primary-500'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-[11px]">Phone No</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSignupMethod('email')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    signupMethod === 'email'
                      ? 'border-primary-600 bg-primary-50 text-primary-700 font-bold ring-1 ring-primary-500'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span className="text-[11px]">Email</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSignupMethod('business')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    signupMethod === 'business'
                      ? 'border-secondary-600 bg-secondary-50 text-secondary-700 font-bold ring-1 ring-secondary-500'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span className="text-[11px]">Business</span>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="font-bold text-gray-700 block mb-1">
                {signupMethod === 'business' ? 'Authorized Representative Name *' : 'Full Name *'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-1 focus:ring-primary-500"
              />
            </div>

            {/* Phone input */}
            {(signupMethod === 'phone' || signupMethod === 'business') && (
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Nepal Mobile Number (+977) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-mono font-bold text-xs">
                    +977
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9841234567"
                    className="w-full pl-14 pr-3 py-2.5 border border-gray-300 rounded-xl font-mono focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>
            )}

            {/* Email input */}
            {(signupMethod === 'email' || signupMethod === 'business') && (
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-1 focus:ring-primary-500"
                />
              </div>
            )}

            {/* Business Specific Fields */}
            {signupMethod === 'business' && (
              <div className="p-4 bg-secondary-50/70 border border-secondary-200 rounded-2xl space-y-3">
                <span className="text-[10px] font-black text-secondary-800 uppercase tracking-wider block">
                  Company / Seller Verification
                </span>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Registered Store or Business Name *</label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Himalayan Weaves & Handicrafts"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">9-Digit PAN / VAT Number *</label>
                  <input
                    type="text"
                    required
                    maxLength={9}
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value)}
                    placeholder="e.g. 601293847"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white font-mono"
                  />
                </div>
              </div>
            )}

            {/* Role Selection for Personal accounts */}
            {signupMethod !== 'business' && (
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Assign Account Role (Role-based access)
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl bg-white font-semibold text-gray-800"
                >
                  <option value="user">Normal User (Customer / Buyer)</option>
                  <option value="helper">Helper (Customer Support & Dispute Ticket Resolution)</option>
                  <option value="brand_manager">Brand Manager (Official Brand Stores & Campaigns)</option>
                  <option value="sradmin">Senior Admin (Catalog Moderation & Order Overrides)</option>
                  <option value="owner">Owner (Full Platform Governance & Financials)</option>
                </select>
              </div>
            )}

            {/* Password input with > 7 characters requirement */}
            <div>
              <label className="font-bold text-gray-700 block mb-1">
                Password <span className="text-primary-600 font-extrabold">(Must be more than 7 characters)</span> *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters (> 7 characters)"
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-1 focus:ring-primary-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Real-time Password Strength Feedback */}
              <div className="mt-2 space-y-1 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${isPasswordLengthValid ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    {isPasswordLengthValid ? '✓' : '•'}
                  </span>
                  <span className={isPasswordLengthValid ? 'text-emerald-700 font-semibold' : 'text-gray-500'}>
                    More than 7 characters (Current: {password.length})
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${hasNumber ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    {hasNumber ? '✓' : '•'}
                  </span>
                  <span className={hasNumber ? 'text-emerald-700 font-semibold' : 'text-gray-500'}>
                    Contains at least one number
                  </span>
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="font-bold text-gray-700 block mb-1">Confirm Password *</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-extrabold rounded-xl shadow-md text-sm transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Continue to Verification</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* --- QUICK DEMO PERSONAS FOR INSTANT TESTING --- */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider text-center mb-3">
            Instant One-Click Login (All Roles)
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => {
                loginAs('owner');
                showToast('Logged in as Platform Owner (Binay Kshetry)', 'success');
                navigate('admin_panel');
              }}
              className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 font-bold text-left flex items-center gap-1.5"
            >
              👑 Owner
            </button>

            <button
              type="button"
              onClick={() => {
                loginAs('sradmin');
                showToast('Logged in as Senior Admin (Rohan Sharma)', 'success');
                navigate('admin_panel');
              }}
              className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-900 border border-red-200 font-bold text-left flex items-center gap-1.5"
            >
              🛡️ Sr. Admin
            </button>

            <button
              type="button"
              onClick={() => {
                loginAs('brand_manager');
                showToast('Logged in as Brand Manager (Sita Dahal)', 'success');
                navigate('catalog', { categorySlug: 'all' });
              }}
              className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-left flex items-center gap-1.5"
            >
              🏷️ Brand Mgr
            </button>

            <button
              type="button"
              onClick={() => {
                loginAs('helper');
                showToast('Logged in as Helper Support (Bikash Tamang)', 'success');
                navigate('contact');
              }}
              className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-bold text-left flex items-center gap-1.5"
            >
              🤝 Helper
            </button>

            <button
              type="button"
              onClick={() => {
                loginAs('seller');
                showToast('Logged in as Seller (Tenzing Sherpa)', 'success');
                navigate('seller_center');
              }}
              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold text-left flex items-center gap-1.5"
            >
              🏪 Business / Seller
            </button>

            <button
              type="button"
              onClick={() => {
                loginAs('user');
                showToast('Logged in as Normal User (Aarav Sharma)', 'success');
                navigate('account');
              }}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-left flex items-center gap-1.5"
            >
              👤 Normal User
            </button>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-3">
              <KeyRound className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-gray-900">Enter Verification Code</h3>
            <p className="text-xs text-gray-500 mt-1 mb-4">
              We sent an SMS/Email OTP to confirm your identity.
            </p>

            <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-xs text-amber-800 font-semibold mb-4">
              Test OTP Code: <span className="font-mono font-bold text-primary-700">123456</span>
            </div>

            <input
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="123456"
              className="w-full text-center tracking-widest text-xl font-mono font-black p-3 border-2 border-gray-300 focus:border-primary-600 rounded-xl mb-4 focus:outline-none"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleVerifyOtpAndComplete}
                className="flex-1 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-md"
              >
                {loading ? 'Verifying...' : 'Verify & Enter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
