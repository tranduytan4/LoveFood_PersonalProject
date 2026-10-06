import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../store/authContext";
import Toast from "../components/ui/Toast";
import Logo from "../components/ui/Logo";

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      if (isRegister) {
        const res = await register(formData);
        if (!res.success) {
          setErrorMsg(res.message || "Failed to create account. Please try again.");
          return;
        }
        setToast({ type: "success", message: "Account created successfully! Welcome to LoveFood!" });
      } else {
        const res = await login({ email: formData.email, password: formData.password });
        if (!res.success) {
          setErrorMsg(res.message || "Invalid email or password. Please try again.");
          return;
        }
        setToast({ type: "success", message: "Welcome back! Signed in successfully." });
      }
      setTimeout(() => navigate("/"), 600);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
          "An unexpected error occurred. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Quick fill demo credentials
  const fillDemoAccount = (role) => {
    if (role === "admin") {
      setFormData({
        name: "Admin User",
        email: "admin@lovefood.com",
        phone: "+1 555-0100",
        password: "admin123",
      });
    } else {
      setFormData({
        name: "Alex Morgan",
        email: "tun.nguyen@example.com",
        phone: "+1 555-0199",
        password: "password123",
      });
    }
    setIsRegister(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-red-500 selection:text-white">
      {/* Ambient background decoration */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-red-100/60 to-orange-100/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-tl from-red-100/60 to-pink-100/40 rounded-full blur-3xl pointer-events-none"></div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-[440px] w-full relative z-10 space-y-6">
        
        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-[28px] p-8 sm:p-9 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.06),0_10px_10px_-5px_rgba(0,0,0,0.02)] border border-slate-200/80 space-y-6">
          
          {/* Header Brand */}
          <div className="text-center space-y-3">
            <Logo size="xl" clickable={false} className="justify-center" />
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {isRegister ? "Create Your Account" : "Welcome Back"}
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {isRegister
                  ? "Join 130+ team members enjoying fresh daily gourmet meals."
                  : "Sign in to order food, track deliveries, and unlock vouchers."}
              </p>
            </div>

            {/* Segmented Pill Selector */}
            <div className="p-1 bg-slate-100/90 rounded-2xl flex items-center gap-1 border border-slate-200/60">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setErrorMsg("");
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  !isRegister
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsRegister(true);
                  setErrorMsg("");
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  isRegister
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Quick Demo Autofill Bar */}
          <div className="bg-slate-50/90 p-3 rounded-2xl border border-slate-200/70 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
              <span>⚡ Fast Demo Access</span>
              <span className="text-slate-400">1-Click Fill</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount("customer")}
                className="py-2 px-3 bg-white hover:bg-slate-100/80 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>👤</span>
                <span>Customer</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount("admin")}
                className="py-2 px-3 bg-[#ff3838] hover:bg-[#e02d2d] text-white rounded-xl text-xs font-bold transition shadow-sm shadow-red-200 flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>🛡️</span>
                <span>Admin POS</span>
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-200/80 text-red-600 text-xs p-3.5 rounded-2xl flex items-center gap-2.5 animate-in fade-in duration-150">
              <i className="fas fa-circle-exclamation shrink-0"></i>
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none text-xs">
                    <i className="fas fa-user"></i>
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Alex Morgan"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-9 pr-3.5 py-3 text-xs text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:ring-4 focus:ring-red-100 focus:border-[#ff3838] transition font-medium"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none text-xs">
                  <i className="fas fa-envelope"></i>
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="alex@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-9 pr-3.5 py-3 text-xs text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:ring-4 focus:ring-red-100 focus:border-[#ff3838] transition font-medium"
                  required
                />
              </div>
            </div>

            {isRegister && (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none text-xs">
                    <i className="fas fa-phone"></i>
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 555-0199"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-9 pr-3.5 py-3 text-xs text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:ring-4 focus:ring-red-100 focus:border-[#ff3838] transition font-medium"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none text-xs">
                  <i className="fas fa-lock"></i>
                </span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-9 pr-3.5 py-3 text-xs text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:ring-4 focus:ring-red-100 focus:border-[#ff3838] transition font-medium"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#ff7b00] to-[#ff3838] hover:from-[#ff3838] hover:to-[#e02d2d] text-white font-black rounded-2xl text-xs sm:text-sm shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 mt-2"
            >
              {submitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Authenticating...</span>
                </>
              ) : isRegister ? (
                <>
                  <span>Create Free Account</span>
                  <i className="fas fa-arrow-right text-xs"></i>
                </>
              ) : (
                <>
                  <span>Sign In to Account</span>
                  <i className="fas fa-arrow-right text-xs"></i>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back to Home Link */}
        <div className="text-center">
          <Link
            to="/"
            className="text-xs font-bold text-slate-400 hover:text-slate-600 transition inline-flex items-center gap-1.5"
          >
            <i className="fas fa-arrow-left text-[10px]"></i>
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
