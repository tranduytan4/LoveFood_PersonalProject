import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../store/authContext";
import { authApi } from "../api/auth.api";
import { addressApi } from "../api/address.api";
import Toast from "../components/ui/Toast";

const ProfilePage = () => {
  const { user, refreshProfile, isAuthenticated } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
  });

  const [addresses, setAddresses] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // New address state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    recipientName: user?.name || "",
    phone: user?.phone || "",
    addressLine: "",
    city: "Springfield",
    district: "Downtown",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
      });
    }
    if (isAuthenticated) {
      loadAddresses();
    }
  }, [user, isAuthenticated]);

  const loadAddresses = () => {
    addressApi
      .getAll()
      .then((res) => setAddresses(res.data?.data || []))
      .catch((err) => console.error("Error loading addresses", err));
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.updateProfile({
        name: formData.name,
        phone: formData.phone,
      });
      await refreshProfile();
      setIsEditingProfile(false);
      setToast({ type: "success", message: "Account profile updated successfully!" });
    } catch (err) {
      setToast({ type: "error", message: "Failed to update profile." });
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefaultAddress = async (id) => {
    try {
      await addressApi.setDefault(id);
      loadAddresses();
      setToast({ type: "success", message: "Set as default address successfully!" });
    } catch (err) {
      setToast({ type: "error", message: "Failed to set default." });
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await addressApi.delete(id);
      loadAddresses();
      setToast({ type: "success", message: "Address deleted from address book!" });
    } catch (err) {
      setToast({ type: "error", message: "Failed to delete address." });
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.addressLine.trim() || !newAddress.recipientName.trim() || !newAddress.phone.trim()) {
      setToast({ type: "error", message: "Please fill in all address fields." });
      return;
    }

    try {
      await addressApi.create(newAddress);
      setShowAddModal(false);
      setNewAddress({
        recipientName: user?.name || "",
        phone: user?.phone || "",
        addressLine: "",
        city: "Springfield",
        district: "Downtown",
      });
      loadAddresses();
      setToast({ type: "success", message: "Added new delivery address!" });
    } catch (err) {
      setToast({ type: "error", message: "Failed to add address." });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10 px-4 md:px-8 font-sans selection:bg-red-500 selection:text-white">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Title */}
        <div className="border-b border-slate-200/80 pb-5">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#ff3838] bg-red-50 border border-red-100 px-3 py-1 rounded-full">
            Account Preferences
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1.5">
            My <span className="text-[#ff3838]">Profile</span>
          </h1>
          <p className="text-slate-500 text-xs mt-0.5 font-medium">
            Manage your personal credentials, contact info, and delivery address book.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.03),0_10px_25px_-5px_rgba(0,0,0,0.02)] border border-slate-200/80 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#ff7b00] via-[#ff3838] to-[#e62e2e] h-32 relative">
            <div className="absolute -bottom-10 left-8 w-20 h-20 bg-white rounded-3xl p-1 shadow-lg border border-slate-100 overflow-hidden">
              <img
                src={
                  user?.avatarUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=ff3838&color=fff`
                }
                alt="Avatar"
                className="w-full h-full rounded-2xl object-cover"
              />
            </div>
          </div>

          <div className="pt-14 pb-8 px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{user?.name || "Customer"}</h2>
                <div className="flex items-center gap-2.5 mt-1">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-50 text-[#ff3838] border border-red-100">
                    {user?.role === "admin" ? "🛡️ System Administrator" : "⭐ Loyal Member"}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">• {user?.email}</span>
                </div>
              </div>

              {!isEditingProfile ? (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-2xl text-xs flex items-center gap-2 transition border border-slate-200/70 active:scale-95 shadow-sm"
                >
                  <i className="fas fa-edit text-[10px]"></i>
                  <span>Edit Profile</span>
                </button>
              ) : null}
            </div>

            {/* Profile Form */}
            {isEditingProfile ? (
              <form onSubmit={handleProfileSave} className="space-y-4 pt-4 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-4 focus:ring-red-100 focus:border-[#ff3838] outline-none transition"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-4 focus:ring-red-100 focus:border-[#ff3838] outline-none transition"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Email (Read-only)</label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full bg-slate-100 border border-slate-200 rounded-2xl p-3 text-xs font-semibold text-slate-400 cursor-not-allowed"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-5 py-2.5 border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-[#ff3838] hover:bg-[#e02d2d] text-white font-black rounded-2xl text-xs shadow-md shadow-red-200 transition active:scale-95"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">
                    Phone Number
                  </span>
                  <span className="text-sm font-bold text-slate-800 mt-1 block font-mono">
                    {user?.phone || "Not configured yet"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">
                    Email Address
                  </span>
                  <span className="text-sm font-bold text-slate-800 mt-1 block">
                    {user?.email}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Address Book Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_10px_25px_-5px_rgba(0,0,0,0.02)] border border-slate-200/80">
          <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <i className="fas fa-map-marked-alt text-[#ff3838]"></i>
                <span>Delivery Address Book</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Save default and secondary addresses for quick 1-click checkout.
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-[#ff3838] hover:bg-[#e02d2d] text-white font-bold rounded-2xl text-xs flex items-center gap-1.5 shadow-md shadow-red-200 transition active:scale-95"
            >
              <i className="fas fa-plus text-[10px]"></i>
              <span>Add Address</span>
            </button>
          </div>

          {addresses.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs font-medium">
              No saved addresses found. Click "Add Address" to store your destination.
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-slate-200 transition"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">
                        {addr.recipientName}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">({addr.phone})</span>
                      {addr.isDefault && (
                        <span className="text-[10px] bg-red-100 text-[#ff3838] font-black px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 font-medium">
                      {addr.addressLine}, {addr.district}, {addr.city}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {!addr.isDefault && (
                      <button
                        onClick={() => handleSetDefaultAddress(addr.id)}
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-[11px] transition shadow-2xs"
                      >
                        Set as Default
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-500 hover:text-white text-red-500 flex items-center justify-center text-xs transition"
                      title="Delete address"
                    >
                      <i className="fas fa-trash-alt text-[10px]"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[10000] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-7 max-w-md w-full shadow-2xl relative border border-slate-200/80 font-sans space-y-4 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs"
            >
              <i className="fas fa-times"></i>
            </button>

            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <i className="fas fa-plus-circle text-[#ff3838]"></i>
                <span>Add New Delivery Address</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Save a new recipient and location for fast checkout.
              </p>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Recipient Name</label>
                <input
                  type="text"
                  value={newAddress.recipientName}
                  onChange={(e) => setNewAddress({ ...newAddress, recipientName: e.target.value })}
                  placeholder="Alex Morgan"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 outline-none focus:bg-white focus:ring-4 focus:ring-red-100 focus:border-[#ff3838] transition font-medium"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Phone Number</label>
                <input
                  type="tel"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  placeholder="+1 555-0199"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 outline-none focus:bg-white focus:ring-4 focus:ring-red-100 focus:border-[#ff3838] transition font-medium"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Street Address & Apt</label>
                <input
                  type="text"
                  value={newAddress.addressLine}
                  onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                  placeholder="742 Evergreen Terrace, Apt 4B"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 outline-none focus:bg-white focus:ring-4 focus:ring-red-100 focus:border-[#ff3838] transition font-medium"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">District / Area</label>
                  <input
                    type="text"
                    value={newAddress.district}
                    onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 outline-none focus:bg-white focus:ring-4 focus:ring-red-100 focus:border-[#ff3838] transition font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">City / State</label>
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 outline-none focus:bg-white focus:ring-4 focus:ring-red-100 focus:border-[#ff3838] transition font-medium"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#ff3838] hover:bg-[#e02d2d] text-white rounded-2xl text-xs font-black shadow-md shadow-red-200 transition active:scale-95"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
