import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
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
        await register(formData);
        setToast({ type: "success", message: "Account created successfully! Welcome!" });
      } else {
        await login({ email: formData.email, password: formData.password });
        setToast({ type: "success", message: "Signed in successfully!" });
      }
      setTimeout(() => navigate("/"), 600);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
          "Sign in failed. Please verify your email and password."
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-gray-100 space-y-6">
        
        {/* Brand Logo & Header - Static Display (Non-clickable) */}
        <div className="text-center space-y-3">
          <Logo size="xl" clickable={false} className="justify-center" />
          <h2 className="text-2xl font-black text-gray-900 mt-2">
            {isRegister ? "Create an Account" : "Welcome Back"}
          </h2>
          <p className="text-xs text-gray-500">
            {isRegister
              ? "Sign up to start ordering fresh food and unlock exclusive deals."
              : "Sign in to manage your orders, saved addresses and preferences."}
          </p>
        </div>

        {/* Demo Fast Fill Buttons */}
        <div className="bg-red-50/60 p-3 rounded-2xl border border-red-100">
          <p className="text-[11px] font-bold text-gray-600 mb-2 text-center">
            🚀 Quick Demo Logins (Click to Autofill):
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount("customer")}
              className="py-2 px-3 bg-white hover:bg-gray-100 border border-gray-200 text-gray-800 rounded-xl text-xs font-bold transition shadow-sm"
            >
              👤 Customer
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount("admin")}
              className="py-2 px-3 bg-[#ff3838] hover:bg-[#e02d2d] text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              🛡️ Admin POS
            </button>
          </div>
        </div>

        {/* Error alert */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-xl flex items-center gap-2">
            <i className="fas fa-exclamation-circle"></i>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Alex Morgan"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-800 outline-none focus:bg-white focus:border-[#ff3838]"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="alex@example.com"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-800 outline-none focus:bg-white focus:border-[#ff3838]"
              required
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 555-0199"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-800 outline-none focus:bg-white focus:border-[#ff3838]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-800 outline-none focus:bg-white focus:border-[#ff3838]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-[#ff3838] hover:bg-[#e02d2d] text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-md shadow-red-200 transition active:scale-95 disabled:opacity-50"
          >
            {submitting ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : isRegister ? (
              "Sign Up"
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Switch tab */}
        <div className="text-center pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            {isRegister ? "Already have an account?" : "Don't have an account yet?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setErrorMsg("");
              }}
              className="font-bold text-[#ff3838] hover:underline ml-1"
            >
              {isRegister ? "Sign In" : "Sign Up for Free"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
