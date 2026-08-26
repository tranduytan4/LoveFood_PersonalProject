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
      setToast({ type: "success", message: "Profile updated successfully!" });
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
      setToast({ type: "success", message: "Address deleted successfully!" });
    } catch (err) {
      setToast({ type: "error", message: "Failed to delete address." });
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.addressLine.trim()) return;

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
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8 font-sans">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#0d1b2a]">
            My <span className="text-[#ff3838]">Profile</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your personal account settings and delivery address book.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-orange-500 to-[#ff3838] h-32 relative">
            <div className="absolute -bottom-10 left-8 w-20 h-20 bg-white rounded-2xl p-1 shadow-md overflow-hidden">
              <img
                src={
                  user?.avatarUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=ff3838&color=fff`
                }
                alt="Avatar"
                className="w-full h-full rounded-xl object-cover"
              />
            </div>
          </div>

          <div className="pt-14 pb-8 px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user?.name || "Customer"}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-100 text-[#ff3838]">
                    {user?.role === "admin" ? "System Administrator" : "Loyal Member"}
                  </span>
                  <span className="text-xs text-gray-400">• {user?.email}</span>
                </div>
              </div>

              {!isEditingProfile ? (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs flex items-center gap-2 transition"
                >
                  <i className="fas fa-edit"></i> Edit Profile
                </button>
              ) : null}
            </div>

            {/* Profile Form */}
            {isEditingProfile ? (
              <form onSubmit={handleProfileSave} className="space-y-4 pt-4 border-t">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold text-gray-800 focus:bg-white focus:border-[#ff3838] outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold text-gray-800 focus:bg-white focus:border-[#ff3838] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email (Read-only)</label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-xs font-semibold text-gray-400 cursor-not-allowed"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-5 py-2.5 border rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-[#ff3838] hover:bg-[#e02d2d] text-white font-bold rounded-xl text-xs shadow-md shadow-red-200"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t">
                <div>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">
                    Phone Number
                  </span>
                  <span className="text-sm font-bold text-gray-800 mt-1 block">
                    {user?.phone || "Not set"}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">
                    Email Address
                  </span>
                  <span className="text-sm font-bold text-gray-800 mt-1 block">
                    {user?.email}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Address Book Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <i className="fas fa-map-marked-alt text-[#ff3838]"></i>
                <span>Delivery Address Book</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Save multiple delivery addresses for faster checkout.
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-[#ff3838] hover:bg-[#e02d2d] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-red-200 transition"
            >
              <i className="fas fa-plus"></i> Add Address
            </button>
          </div>

          {addresses.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs">
              No saved addresses found.
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-gray-200 transition"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900">
                        {addr.recipientName}
                      </span>
                      <span className="text-xs text-gray-500 font-mono">({addr.phone})</span>
                      {addr.isDefault && (
                        <span className="text-[10px] bg-red-100 text-[#ff3838] font-bold px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {addr.addressLine}, {addr.district}, {addr.city}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {!addr.isDefault && (
                      <button
                        onClick={() => handleSetDefaultAddress(addr.id)}
                        className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold rounded-lg text-[11px] transition"
                      >
                        Set as Default
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-500 hover:text-white text-red-500 flex items-center justify-center text-xs transition"
                      title="Delete address"
                    >
                      <i className="fas fa-trash-alt"></i>
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
        <div className="fixed inset-0 z-[10000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative border border-gray-100 font-sans">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2"
            >
              <i className="fas fa-times"></i>
            </button>

            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i className="fas fa-plus-circle text-[#ff3838]"></i>
              <span>Add New Address</span>
            </h3>

            <form onSubmit={handleAddAddress} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Recipient Name</label>
                <input
                  type="text"
                  value={newAddress.recipientName}
                  onChange={(e) => setNewAddress({ ...newAddress, recipientName: e.target.value })}
                  placeholder="Alex Morgan"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  placeholder="+1 555-0199"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={newAddress.addressLine}
                  onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                  placeholder="742 Evergreen Terrace, Apt 4B"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-800"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">District / Area</label>
                  <input
                    type="text"
                    value={newAddress.district}
                    onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">City / State</label>
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-800"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 border rounded-xl text-xs font-bold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#ff3838] text-white rounded-xl text-xs font-bold shadow-md shadow-red-200"
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
