import React, { useState } from 'react';
import { X, Eye, EyeOff, Mail, Lock, Phone, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useAuthStore } from '../../store/useAuthStore';
import { SEED_USERS } from '../../mocks/seed-data';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authModalMode, authModalTab, closeAuthModal, setAuthModalMode, setAuthModalTab, showToast } =
    useUIStore();
  const { loginWithCredentials, signupWithCredentials, loginWithGoogle, loginWithFacebook, loginWithPhoneOtp, loginAs } =
    useAuthStore();

  const [identifier, setIdentifier] = useState('bkc01805@gmail.com');
  const [password, setPassword] = useState('secretPass123');
  const [showPassword, setShowPassword] = useState(false);

  // Phone OTP tab state
  const [phone, setPhone] = useState('9841234567');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Signup fields
  const [fullName, setFullName] = useState('');
  const [signupType, setSignupType] = useState<'email' | 'phone' | 'business'>('email');
  const [businessName, setBusinessName] = useState('');
  const [panNumber, setPanNumber] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  // Handle Password-based Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!identifier.trim() || !password) {
      setErrorMsg('Please enter both your Phone/Email and password.');
      return;
    }
    if (password.length <= 7) {
      setErrorMsg('Password must be more than 7 characters (minimum 8 characters).');
      return;
    }

    try {
      setIsLoading(true);
      const user = await loginWithCredentials(identifier, password);
      showToast(`Welcome back, ${user.name}!`);
      closeAuthModal();
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Phone OTP Login
  const handlePhoneOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!otpSent) {
      // Send OTP step
      if (!phone || phone.replace(/\D/g, '').length < 10) {
        setErrorMsg('Please enter a valid 10-digit Nepali mobile number.');
        return;
      }
      setOtpSent(true);
      setOtp('123456'); // Pre-fill test code for convenience
      showToast('Verification SMS sent! Test OTP code: 123456', 'info');
      return;
    }

    // Verify OTP step
    if (otp !== '123456' && otp.length < 4) {
      setErrorMsg('Invalid OTP. Use test code 123456.');
      return;
    }

    try {
      setIsLoading(true);
      const user = await loginWithPhoneOtp(phone, otp);
      showToast(`Welcome, ${user.name}!`);
      closeAuthModal();
    } catch (err: any) {
      setErrorMsg(err.message || 'OTP verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google 1-Click Login / Signup
  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      const user = await loginWithGoogle(identifier.includes('@') ? identifier : 'bkc01805@gmail.com');
      showToast(`Signed in with Google as ${user.name}!`);
      closeAuthModal();
    } catch (err: any) {
      showToast('Google sign-in failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Facebook Auth
  const handleFacebookAuth = async () => {
    try {
      setIsLoading(true);
      const user = await loginWithFacebook();
      showToast(`Signed in with Facebook as ${user.name}!`);
      closeAuthModal();
    } catch (err: any) {
      showToast('Facebook sign-in failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle New Registration
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (password.length <= 7) {
      setErrorMsg('Password must be strictly more than 7 characters (min 8 characters).');
      return;
    }

    try {
      setIsLoading(true);
      const user = await signupWithCredentials({
        name: fullName,
        accountType: signupType,
        email: signupType === 'email' ? identifier : undefined,
        phone: signupType === 'phone' ? identifier : undefined,
        password,
        businessName: signupType === 'business' ? businessName : undefined,
        panNumber: signupType === 'business' ? panNumber : undefined,
        role: signupType === 'business' ? 'seller' : 'user'
      });
      showToast(`Account created successfully! Welcome ${user.name}`);
      closeAuthModal();
    } catch (err: any) {
      setErrorMsg(err.message || 'Signup failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Tabs matching reference screenshot */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 pt-5 pb-3">
          {authModalMode === 'login' ? (
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => setAuthModalTab('password')}
                className={`text-lg font-bold pb-2 transition-all border-b-2 ${
                  authModalTab === 'password'
                    ? 'text-gray-900 border-primary-600'
                    : 'text-gray-400 border-transparent hover:text-gray-700'
                }`}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => setAuthModalTab('phone')}
                className={`text-lg font-bold pb-2 transition-all border-b-2 ${
                  authModalTab === 'phone'
                    ? 'text-gray-900 border-primary-600'
                    : 'text-gray-400 border-transparent hover:text-gray-700'
                }`}
              >
                Phone Number
              </button>
            </div>
          ) : (
            <h2 className="text-xl font-bold text-gray-900">Create NepaleseStore Account</h2>
          )}

          <button
            type="button"
            onClick={closeAuthModal}
            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              <span>{errorMsg}</span>
            </div>
          )}

          {authModalMode === 'login' ? (
            /* --- LOGIN MODE --- */
            <div>
              {authModalTab === 'password' ? (
                /* Tab 1: Password Login */
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="Please enter your Phone or Email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all placeholder:text-gray-400"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Please enter your password"
                        className="w-full px-4 py-3 pr-11 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all placeholder:text-gray-400"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="flex justify-end mt-1.5">
                      <button
                        type="button"
                        onClick={() => showToast('Password reset link sent to registered email/phone.', 'info')}
                        className="text-xs text-gray-500 hover:text-primary-600 transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                  </div>

                  {/* Main LOGIN button matching reference image */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 bg-[#F25A24] hover:bg-[#e04f1a] active:bg-[#c94112] text-white font-black tracking-wide rounded-lg text-sm shadow-md transition-all uppercase"
                  >
                    {isLoading ? 'SIGNING IN...' : 'LOGIN'}
                  </button>

                  <div className="text-center text-xs text-gray-600 pt-1">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthModalMode('signup')}
                      className="text-primary-600 hover:underline font-bold"
                    >
                      Sign up
                    </button>
                  </div>
                </form>
              ) : (
                /* Tab 2: Phone Number OTP Login */
                <form onSubmit={handlePhoneOtpLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Nepal Mobile Number (+977)
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3.5 border border-r-0 border-gray-300 bg-gray-50 text-gray-600 text-sm font-semibold rounded-l-lg">
                        +977
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="98XXXXXXXX"
                        maxLength={10}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all placeholder:text-gray-400 font-mono"
                        required
                      />
                    </div>
                  </div>

                  {otpSent && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-gray-700">Enter OTP Verification Code</label>
                        <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                          Test code: 123456
                        </span>
                      </div>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="6-digit OTP code"
                        maxLength={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center tracking-widest font-mono text-base font-bold focus:ring-2 focus:ring-primary-500 outline-none"
                        required
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 bg-[#F25A24] hover:bg-[#e04f1a] text-white font-black tracking-wide rounded-lg text-sm shadow-md transition-all uppercase"
                  >
                    {isLoading
                      ? 'VERIFYING...'
                      : otpSent
                      ? 'VERIFY & LOGIN'
                      : 'SEND VERIFICATION OTP'}
                  </button>

                  <div className="text-center text-xs text-gray-600 pt-1">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthModalMode('signup')}
                      className="text-primary-600 hover:underline font-bold"
                    >
                      Sign up
                    </button>
                  </div>
                </form>
              )}

              {/* Social Login Divider & Buttons matching reference screenshot */}
              <div className="mt-6 pt-5 border-t border-gray-200">
                <p className="text-center text-xs text-gray-500 mb-4">Or, login with</p>
                <div className="grid grid-cols-2 gap-3">
                  {/* Google Direct Login */}
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    className="flex items-center justify-center gap-2.5 py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors shadow-2xs"
                  >
                    {/* Official Multi-Color Google G */}
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Google</span>
                  </button>

                  {/* Facebook Login */}
                  <button
                    type="button"
                    onClick={handleFacebookAuth}
                    className="flex items-center justify-center gap-2.5 py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors shadow-2xs"
                  >
                    <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>Facebook</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* --- SIGN UP MODE --- */
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              {/* Registration Type Select */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-700">
                <button
                  type="button"
                  onClick={() => setSignupType('email')}
                  className={`py-2 rounded-md transition-all ${
                    signupType === 'email' ? 'bg-white shadow-xs text-primary-600' : 'text-gray-500'
                  }`}
                >
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setSignupType('phone')}
                  className={`py-2 rounded-md transition-all ${
                    signupType === 'phone' ? 'bg-white shadow-xs text-primary-600' : 'text-gray-500'
                  }`}
                >
                  Phone No
                </button>
                <button
                  type="button"
                  onClick={() => setSignupType('business')}
                  className={`py-2 rounded-md transition-all ${
                    signupType === 'business' ? 'bg-white shadow-xs text-primary-600' : 'text-gray-500'
                  }`}
                >
                  Business
                </button>
              </div>

              <div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name (e.g. Aarav Sharma)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  required
                />
              </div>

              <div>
                <input
                  type={signupType === 'email' ? 'email' : 'text'}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    signupType === 'email'
                      ? 'Email Address (e.g. bkc01805@gmail.com)'
                      : signupType === 'phone'
                      ? 'Nepali Phone Number (+977 98XXXXXXXX)'
                      : 'Contact Email or Phone'
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  required
                />
              </div>

              {signupType === 'business' && (
                <>
                  <div>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Store / Company Name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={panNumber}
                      onChange={(e) => setPanNumber(e.target.value)}
                      placeholder="9-digit PAN/VAT Number"
                      maxLength={9}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none font-mono"
                      required
                    />
                  </div>
                </>
              )}

              <div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create Password (min 8 characters)"
                    className="w-full px-4 py-3 pr-11 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 text-[11px]">
                  <span className={`w-2 h-2 rounded-full ${password.length > 7 ? 'bg-emerald-500' : 'bg-red-400'}`}></span>
                  <span className={password.length > 7 ? 'text-emerald-700 font-semibold' : 'text-gray-500'}>
                    Must be strictly more than 7 characters (Current: {password.length})
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-[#F25A24] hover:bg-[#e04f1a] text-white font-black tracking-wide rounded-lg text-sm shadow-md transition-all uppercase"
              >
                {isLoading ? 'CREATING ACCOUNT...' : 'CONTINUE & REGISTER'}
              </button>

              <div className="text-center text-xs text-gray-600 pt-1">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthModalMode('login')}
                  className="text-primary-600 hover:underline font-bold"
                >
                  Log in
                </button>
              </div>

              {/* Direct Google 1-Click Signup */}
              <div className="pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Sign up directly with Google</span>
                </button>
              </div>
            </form>
          )}

          {/* Quick Demo Role Switcher at the bottom */}
          <div className="mt-5 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold mb-2 uppercase tracking-wider">
              <span>Instant One-Click Login (Demo Roles)</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  loginAs('owner');
                  showToast('Logged in as Platform Owner (Binay Kshetry)');
                  closeAuthModal();
                }}
                className="p-1.5 rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold truncate text-left"
              >
                👑 Owner
              </button>
              <button
                type="button"
                onClick={() => {
                  loginAs('sradmin');
                  showToast('Logged in as Senior Admin (Rohan Sharma)');
                  closeAuthModal();
                }}
                className="p-1.5 rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold truncate text-left"
              >
                🛡️ Sr. Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  loginAs('seller');
                  showToast('Logged in as Artisan Seller (Tenzing Sherpa)');
                  closeAuthModal();
                }}
                className="p-1.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold truncate text-left"
              >
                🏪 Seller
              </button>
              <button
                type="button"
                onClick={() => {
                  loginAs('brand_manager');
                  showToast('Logged in as Brand Manager (Sita Dahal)');
                  closeAuthModal();
                }}
                className="p-1.5 rounded-md bg-amber-50 text-amber-700 hover:bg-amber-100 font-semibold truncate text-left"
              >
                🏷️ Brand Mgr
              </button>
              <button
                type="button"
                onClick={() => {
                  loginAs('helper');
                  showToast('Logged in as Support Helper (Bikash Tamang)');
                  closeAuthModal();
                }}
                className="p-1.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold truncate text-left"
              >
                🤝 Helper
              </button>
              <button
                type="button"
                onClick={() => {
                  loginAs('user');
                  showToast('Logged in as Customer (Aarav Sharma)');
                  closeAuthModal();
                }}
                className="p-1.5 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 font-semibold truncate text-left"
              >
                👤 Customer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

