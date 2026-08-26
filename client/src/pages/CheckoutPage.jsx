import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CartContext } from "../store/cartContext";
import { AuthContext } from "../store/authContext";
import { addressApi } from "../api/address.api";
import { orderApi } from "../api/order.api";
import { formatCurrency } from "../utils/formatCurrency";
import Toast from "../components/ui/Toast";

const PAYMENT_METHODS = [
  {
    id: "COD",
    name: "Cash on Delivery (COD)",
    desc: "Pay directly with cash when driver delivers food to your door.",
    icon: "fa-money-bill-wave",
    badge: "Most Popular",
  },
  {
    id: "MOMO",
    name: "E-Wallet (MoMo / PayPal / Apple Pay)",
    desc: "Fast digital payment via QR code scan or instant mobile transfer.",
    icon: "fa-qrcode",
    badge: "Instant 24/7",
  },
  {
    id: "VNPAY",
    name: "Credit / Debit Card / ATM",
    desc: "Secured payment gateway via Visa, MasterCard or Online Banking.",
    icon: "fa-credit-card",
    badge: "100% Secure",
  },
];

const CheckoutPage = () => {
  const { items, subtotal, shippingFee, voucherDiscount, total, appliedVoucher, clearCart } =
    useContext(CartContext);
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState("COD");
  const [orderNote, setOrderNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // New / Guest address form state
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    recipientName: user?.name || "",
    phone: user?.phone || "",
    addressLine: "",
    city: "Springfield",
    district: "Downtown",
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
    }
  }, [items, navigate]);

  // Load user saved addresses
  useEffect(() => {
    if (isAuthenticated) {
      addressApi
        .getAll()
        .then((res) => {
          const list = res.data?.data || [];
          setAddresses(list);
          const defaultAddr = list.find((a) => a.isDefault) || list[0];
          if (defaultAddr) setSelectedAddressId(defaultAddr.id);
        })
        .catch((err) => console.error("Error loading addresses", err));
    }
  }, [isAuthenticated]);

  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.addressLine.trim() || !newAddress.recipientName.trim() || !newAddress.phone.trim()) {
      setToast({ type: "error", message: "Please fill in all address fields." });
      return;
    }

    try {
      const res = await addressApi.create(newAddress);
      const created = res.data?.data;
      setAddresses((prev) => [created, ...prev]);
      setSelectedAddressId(created.id);
      setShowNewAddressForm(false);
      setToast({ type: "success", message: "Delivery address saved to your account!" });
    } catch (err) {
      setToast({ type: "error", message: "Failed to save new address." });
    }
  };

  const handlePlaceOrder = async () => {
    let chosenRecipientName = "";
    let chosenPhone = "";
    let chosenAddressText = "";
    let chosenAddressId = null;

    if (isAuthenticated && addresses.length > 0 && selectedAddressId && !showNewAddressForm) {
      const found = addresses.find((a) => a.id === selectedAddressId);
      if (found) {
        chosenRecipientName = found.recipientName;
        chosenPhone = found.phone;
        chosenAddressText = `${found.addressLine}, ${found.district || ""}, ${found.city || ""}`;
        chosenAddressId = found.id;
      }
    }

    // Guest checkout fallback or manual input
    if (!chosenAddressText) {
      if (!newAddress.recipientName.trim() || !newAddress.phone.trim() || !newAddress.addressLine.trim()) {
        setToast({
          type: "error",
          message: "Please provide all required delivery information (recipient name, phone, and address).",
        });
        return;
      }
      chosenRecipientName = newAddress.recipientName.trim();
      chosenPhone = newAddress.phone.trim();
      chosenAddressText = `${newAddress.addressLine.trim()}${newAddress.district ? `, ${newAddress.district.trim()}` : ""}${newAddress.city ? `, ${newAddress.city.trim()}` : ""}`;
    }

    setSubmitting(true);
    try {
      const payload = {
        addressId: chosenAddressId,
        shippingAddress: chosenAddressText,
        shippingAddressSnapshot: chosenAddressText,
        recipientName: chosenRecipientName,
        recipientPhone: chosenPhone,
        voucherCode: appliedVoucher?.code || null,
        paymentMethod: selectedPayment,
        note: orderNote.trim(),
        items: items.map((item) => ({
          productId: item.productId || item.id || null,
          name: item.name,
          price: Number(item.price),
          quantity: item.qty || item.quantity || 1,
          options: item.options || {
            size: item.size || "Standard",
            toppings: item.toppings || [],
            itemNote: item.note || "",
          },
          imageUrl: item.imageUrl || item.img || "",
        })),
      };

      const res = await orderApi.create(payload);
      const createdOrder = res.data?.data;

      // Clear cart safely
      if (typeof clearCart === "function") {
        clearCart();
      }

      // Navigate to tracking page
      navigate(`/orders/track/${createdOrder.orderCode}`);
    } catch (err) {
      console.error("Order creation failed:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to place order. Please try again.";
      setToast({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setSubmitting(false);
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

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-5">
          <div>
            <Link to="/cart" className="text-xs font-bold text-slate-400 hover:text-[#ff3838] transition inline-flex items-center gap-1.5">
              <i className="fas fa-arrow-left text-[10px]"></i>
              <span>Return to Shopping Cart</span>
            </Link>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1.5">
              Checkout & <span className="text-[#ff3838]">Delivery</span>
            </h1>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200/60 hidden sm:inline-block">
            Step 2 of 2: Final Payment
          </span>
        </div>

        {/* 2-Column Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Delivery Address & Payment Methods */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Address Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_10px_25px_-5px_rgba(0,0,0,0.02)] border border-slate-200/80 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <i className="fas fa-map-marker-alt text-[#ff3838]"></i>
                  <span>1. Delivery Destination Address</span>
                </h3>
                {isAuthenticated && (
                  <button
                    onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                    className="text-xs font-bold text-[#ff3838] hover:underline"
                  >
                    {showNewAddressForm ? "Use Saved Address" : "+ Add New Address"}
                  </button>
                )}
              </div>

              {/* Saved addresses list */}
              {isAuthenticated && addresses.length > 0 && !showNewAddressForm && (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer flex items-start justify-between transition-all ${
                        selectedAddressId === addr.id
                          ? "border-[#ff3838] bg-red-50/30 text-slate-900 shadow-sm"
                          : "border-slate-100 hover:border-slate-200 bg-slate-50/40 text-slate-700"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="accent-[#ff3838] mt-1"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">
                              {addr.recipientName}
                            </span>
                            <span className="text-xs text-slate-500 font-mono">
                              ({addr.phone})
                            </span>
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
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {/* Inline Add Address / Guest Address Form */}
              {(showNewAddressForm || !isAuthenticated || addresses.length === 0) && (
                <form onSubmit={handleAddNewAddress} className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Recipient Name
                      </label>
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
                      <label className="block text-xs font-bold text-slate-700">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        placeholder="+1 555-0199"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 outline-none focus:bg-white focus:ring-4 focus:ring-red-100 focus:border-[#ff3838] transition font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Street Address & Apt
                    </label>
                    <input
                      type="text"
                      value={newAddress.addressLine}
                      onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                      placeholder="742 Evergreen Terrace, Apt 4B"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 outline-none focus:bg-white focus:ring-4 focus:ring-red-100 focus:border-[#ff3838] transition font-medium"
                      required
                    />
                  </div>

                  {isAuthenticated && (
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl text-xs transition active:scale-95 shadow-sm"
                    >
                      Save Address to Account
                    </button>
                  )}
                </form>
              )}
            </div>

            {/* 2. Payment Method Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_10px_25px_-5px_rgba(0,0,0,0.02)] border border-slate-200/80 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <i className="fas fa-credit-card text-[#ff3838]"></i>
                <span>2. Select Payment Method</span>
              </h3>

              <div className="space-y-3">
                {PAYMENT_METHODS.map((pm) => (
                  <label
                    key={pm.id}
                    onClick={() => setSelectedPayment(pm.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                      selectedPayment === pm.id
                        ? "border-[#ff3838] bg-red-50/30 text-slate-900 shadow-sm"
                        : "border-slate-100 hover:border-slate-200 bg-slate-50/40 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <input
                        type="radio"
                        name="payment"
                        checked={selectedPayment === pm.id}
                        onChange={() => setSelectedPayment(pm.id)}
                        className="accent-[#ff3838]"
                      />
                      <div className="w-9 h-9 rounded-xl bg-red-100/70 text-[#ff3838] flex items-center justify-center text-sm shrink-0 border border-red-200/60">
                        <i className={`fas ${pm.icon}`}></i>
                      </div>
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">
                          {pm.name}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">{pm.desc}</span>
                      </div>
                    </div>

                    <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-wider text-slate-500 bg-white border border-slate-200/70 px-2.5 py-1 rounded-full shadow-xs">
                      {pm.badge}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* 3. Driver Instructions */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_10px_25px_-5px_rgba(0,0,0,0.02)] border border-slate-200/80 space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <i className="fas fa-comment-dots text-[#ff3838]"></i>
                <span>3. Delivery Instructions for Driver</span>
              </h3>
              <textarea
                rows={2}
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                placeholder="e.g., Leave package at front door, ring the bell, call before arrival..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-800 outline-none focus:bg-white focus:ring-4 focus:ring-red-100 focus:border-[#ff3838] transition font-medium"
              />
            </div>
          </div>

          {/* Right Column: Order Items Breakdown & Place Order */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_10px_25px_-5px_rgba(0,0,0,0.02)] border border-slate-200/80 space-y-5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs text-slate-400 font-bold">{items.length} items</span>
              </h3>

              {/* Items preview list */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.cartItemId || item.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.imageUrl || item.img || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400"}
                        alt={item.name}
                        className="w-11 h-11 rounded-xl object-cover shrink-0 bg-slate-100 border border-slate-100"
                      />
                      <div>
                        <p className="font-bold text-slate-900 leading-snug">{item.name}</p>
                        <p className="text-[11px] text-slate-400 font-medium">
                          {item.qty || item.quantity || 1}x • {formatCurrency(item.price)}
                          {item.options?.size && item.options.size !== "Standard" && ` (${item.options.size})`}
                        </p>
                      </div>
                    </div>
                    <span className="font-black text-slate-900 tabular-nums">
                      {formatCurrency((item.price || 0) * (item.qty || item.quantity || 1))}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="border-t border-slate-100 pt-4 space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold text-slate-900 tabular-nums">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Delivery Fee</span>
                  <span className="font-bold text-slate-900 tabular-nums">{formatCurrency(shippingFee)}</span>
                </div>
                {voucherDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Voucher Discount</span>
                    <span className="tabular-nums">-{formatCurrency(voucherDiscount)}</span>
                  </div>
                )}
                <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline text-slate-900 font-black">
                  <span className="text-sm">Total Payment</span>
                  <span className="text-2xl text-[#ff3838] tabular-nums">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Place Order CTA Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={submitting}
                className="w-full py-4 bg-gradient-to-r from-[#ff7b00] to-[#ff3838] hover:from-[#ff3838] hover:to-[#e02d2d] text-white font-black text-sm rounded-2xl shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Place Order</span>
                    <i className="fas fa-arrow-right text-xs"></i>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
