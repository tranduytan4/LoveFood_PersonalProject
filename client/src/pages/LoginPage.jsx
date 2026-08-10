import { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../store/authContext";

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: '' }

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "tun.nguyen@example.com",
    password: "password123",
    confirmPassword: "",
  });

  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const triggerToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isRegister) {
      if (!formData.name.trim()) {
        triggerToast("error", "Please enter your full name.");
        return;
      }
      if (!formData.email.trim()) {
        triggerToast("error", "Please enter your email or phone number.");
        return;
      }
      if (formData.password.length < 6) {
        triggerToast("error", "Password must be at least 6 characters.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        triggerToast("error", "Confirm password does not match.");
        return;
      }
      if (!agreeTerms) {
        triggerToast("error", "You must agree to the Terms & Privacy Policy.");
        return;
      }

      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        register({
          name: formData.name,
          email: formData.email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=ff3838&color=fff`,
        });
        triggerToast("success", "Account registered successfully! Redirecting...");
        setTimeout(() => navigate(from, { replace: true }), 1000);
      }, 1200);
    } else {
      if (!formData.email.trim()) {
        triggerToast("error", "Please enter your email or phone number.");
        return;
      }
      if (!formData.password) {
        triggerToast("error", "Please enter your password.");
        return;
      }

      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        login({
          name: formData.name || "Tun Nguyen",
          email: formData.email,
          avatar: "https://ui-avatars.com/api/?name=Tun+Nguyen&background=ff3838&color=fff",
        });
        triggerToast("success", "Login successful! Welcome back.");
        setTimeout(() => navigate(from, { replace: true }), 1000);
      }, 1000);
    }
  };

  const handleSocialLogin = (provider) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login({
        name: `User (${provider})`,
        email: `user.${provider.toLowerCase()}@example.com`,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(provider)}&background=ff3838&color=fff`,
      });
      triggerToast("success", `Successfully logged in with ${provider}!`);
      setTimeout(() => navigate(from, { replace: true }), 1000);
    }, 1200);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      triggerToast("error", "Please enter your recovery email address.");
      return;
    }
    setForgotSubmitted(true);
    setTimeout(() => {
      setForgotSubmitted(false);
      setShowForgotModal(false);
      setForgotEmail("");
      triggerToast("success", "Password reset link has been sent to your email.");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-gray-50 to-orange-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl transition-all transform animate-bounce ${
            toast.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          <i
            className={`fas ${
              toast.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"
            } text-xl`}
          />
          <span className="font-semibold text-sm sm:text-base">{toast.message}</span>
        </div>
      )}

      {/* Main Container Card */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px] border border-gray-100">
        
        {/* Left Section: Branding & Visual Banner */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#ff3838] via-[#e02d2d] to-[#c01c1c] p-10 flex-col justify-between text-white relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-orange-400/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Logo */}
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-3 text-2xl font-black text-white hover:opacity-90 transition-opacity">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <i className="fas fa-utensils text-xl text-white" />
              </div>
              <span>LoveFood</span>
            </Link>
          </div>

          {/* Center Showcase Content */}
          <div className="relative z-10 space-y-6 my-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold tracking-wide uppercase border border-white/20">
              <i className="fas fa-fire text-amber-300" /> Smart Food Delivery
            </div>

            <h2 className="text-3xl font-extrabold leading-tight">
              {isRegister ? "Join the LoveFood Community!" : "Delicious food delivered right to your door!"}
            </h2>

            <p className="text-white/80 text-sm leading-relaxed">
              Discover thousands of tasty dishes, exclusive daily deals, and lightning-fast 15-minute delivery.
            </p>

            {/* Testimonial Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 text-xs">
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <span className="text-white font-bold ml-1">4.9/5</span>
              </div>
              <p className="text-xs text-white/90 italic">
                "The fastest and most convenient food ordering app I have ever used!"
              </p>
              <div className="flex items-center gap-2 pt-1">
                <div className="w-6 h-6 rounded-full bg-white/30 text-xs flex items-center justify-center font-bold">
                  A
                </div>
                <span className="text-xs font-medium text-white/80">Alex M. - Verified Customer</span>
              </div>
            </div>
          </div>

          {/* Bottom Footer Info */}
          <div className="relative z-10 text-xs text-white/60 flex items-center justify-between border-t border-white/10 pt-4">
            <span>© 2026 LoveFood Inc.</span>
            <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
              Home <i className="fas fa-arrow-right text-[10px]" />
            </Link>
          </div>
        </div>

        {/* Right Section: Interactive Auth Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-white">
          
          {/* Header Mobile / Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="lg:hidden flex items-center gap-2 text-xl font-extrabold text-[#ff3838]">
              <i className="fas fa-utensils" />
              <span>LoveFood</span>
            </Link>

            <Link
              to="/"
              className="ml-auto text-xs font-semibold text-gray-500 hover:text-[#ff3838] transition-colors flex items-center gap-1.5 py-1.5 px-3 rounded-full hover:bg-red-50"
            >
              <i className="fas fa-arrow-left" /> Back to home
            </Link>
          </div>

          {/* Tab Switcher: Sign In vs Sign Up */}
          <div className="max-w-md mx-auto w-full">
            <div className="flex items-center bg-gray-100 p-1.5 rounded-2xl mb-8">
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-200 ${
                  !isRegister
                    ? "bg-white text-[#ff3838] shadow-md"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <i className="fas fa-sign-in-alt mr-2" /> Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-200 ${
                  isRegister
                    ? "bg-white text-[#ff3838] shadow-md"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <i className="fas fa-user-plus mr-2" /> Sign Up
              </button>
            </div>

            {/* Title & Subtitle */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {isRegister ? "Create a new account 🚀" : "Welcome back! 👋"}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {isRegister
                  ? "Fill in your details below to experience seamless food ordering."
                  : "Enter your credentials to continue."}
              </p>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {/* Google */}
              <button
                type="button"
                onClick={() => handleSocialLogin("Google")}
                className="flex items-center justify-center gap-2 py-2.5 px-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-semibold text-xs text-gray-700 active:scale-95"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                  />
                </svg>
                <span>Google</span>
              </button>

              {/* Facebook */}
              <button
                type="button"
                onClick={() => handleSocialLogin("Facebook")}
                className="flex items-center justify-center gap-2 py-2.5 px-3 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all font-semibold text-xs text-gray-700 active:scale-95"
              >
                <i className="fab fa-facebook text-blue-600 text-base" />
                <span>Facebook</span>
              </button>

              {/* Apple */}
              <button
                type="button"
                onClick={() => handleSocialLogin("Apple")}
                className="flex items-center justify-center gap-2 py-2.5 px-3 border border-gray-200 rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-all font-semibold text-xs text-gray-700 active:scale-95"
              >
                <i className="fab fa-apple text-gray-900 text-base" />
                <span>Apple</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center mb-6">
              <div className="border-t border-gray-200 w-full" />
              <span className="bg-white px-3 text-xs text-gray-400 font-medium uppercase tracking-wider shrink-0">
                Or with Email
              </span>
              <div className="border-t border-gray-200 w-full" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Register: Full Name */}
              {isRegister && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                  <div className="relative flex items-center">
                    <i className="fas fa-user absolute left-4 text-gray-400 text-sm" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm text-gray-800 focus:bg-white focus:border-[#ff3838] focus:ring-2 focus:ring-red-100 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email or Phone */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email or Phone Number</label>
                <div className="relative flex items-center">
                  <i className="fas fa-envelope absolute left-4 text-gray-400 text-sm" />
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com or +123456789"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm text-gray-800 focus:bg-white focus:border-[#ff3838] focus:ring-2 focus:ring-red-100 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
                <div className="relative flex items-center">
                  <i className="fas fa-lock absolute left-4 text-gray-400 text-sm" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-11 text-sm text-gray-800 focus:bg-white focus:border-[#ff3838] focus:ring-2 focus:ring-red-100 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} text-sm`} />
                  </button>
                </div>
              </div>

              {/* Register: Confirm Password */}
              {isRegister && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Confirm Password</label>
                  <div className="relative flex items-center">
                    <i className="fas fa-lock absolute left-4 text-gray-400 text-sm" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-11 text-sm text-gray-800 focus:bg-white focus:border-[#ff3838] focus:ring-2 focus:ring-red-100 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} text-sm`} />
                    </button>
                  </div>
                </div>
              )}

              {/* Options: Remember Me & Forgot Password */}
              {!isRegister ? (
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-medium text-gray-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-[#ff3838] focus:ring-[#ff3838] border-gray-300"
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs font-bold text-[#ff3838] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              ) : (
                /* Terms agreement */
                <div className="pt-1">
                  <label className="flex items-start gap-2 cursor-pointer select-none text-xs text-gray-600">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-[#ff3838] focus:ring-[#ff3838] border-gray-300 shrink-0"
                    />
                    <span>
                      I agree to the{" "}
                      <span className="font-bold text-[#ff3838] hover:underline cursor-pointer">
                        Terms of Service
                      </span>{" "}
                      and{" "}
                      <span className="font-bold text-[#ff3838] hover:underline cursor-pointer">
                        Privacy Policy
                      </span>{" "}
                      of LoveFood.
                    </span>
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#ff3838] hover:bg-[#e02d2d] text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-red-200 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm disabled:opacity-70 active:scale-[0.99] mt-2"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin text-lg" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>{isRegister ? "Create Account" : "Sign In"}</span>
                    <i className="fas fa-arrow-right text-xs" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Toggle Note */}
            <div className="text-center mt-6 text-xs text-gray-500">
              {isRegister ? (
                <p>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsRegister(false)}
                    className="font-bold text-[#ff3838] hover:underline"
                  >
                    Sign in now
                  </button>
                </p>
              ) : (
                <p>
                  Don't have a LoveFood account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsRegister(true)}
                    className="font-bold text-[#ff3838] hover:underline"
                  >
                    Create one now
                  </button>
                </p>
              )}
            </div>
          </div>

          {/* Footer Terms Note */}
          <div className="text-center text-[11px] text-gray-400 mt-6 border-t border-gray-100 pt-4">
            By continuing, you agree to LoveFood's Terms & Conditions.
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-[10000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
            >
              <i className="fas fa-times text-lg" />
            </button>

            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-[#ff3838] mb-4 text-xl">
              <i className="fas fa-key" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-1">Reset Password 🔑</h3>
            <p className="text-xs text-gray-500 mb-6">
              Enter your registered email address. We will send you a password reset link.
            </p>

            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Registered Email</label>
                <div className="relative flex items-center">
                  <i className="fas fa-envelope absolute left-4 text-gray-400 text-sm" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm text-gray-800 focus:bg-white focus:border-[#ff3838] focus:ring-2 focus:ring-red-100 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotSubmitted}
                  className="flex-1 py-3 bg-[#ff3838] hover:bg-[#e02d2d] text-white rounded-xl text-xs font-bold shadow-md shadow-red-200 flex items-center justify-center gap-2"
                >
                  {forgotSubmitted ? (
                    <>
                      <i className="fas fa-spinner fa-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Send Reset Link</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
