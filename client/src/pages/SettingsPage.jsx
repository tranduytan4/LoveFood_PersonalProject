import React, { useState } from "react";

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    emailNotif: true,
    smsNotif: false,
    promoEmails: true,
    darkMode: false,
    savePayment: true,
    locationTracking: true,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const ToggleSwitch = ({ label, description, stateKey }) => (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition px-3 rounded-2xl">
      <div className="flex flex-col pr-4">
        <span className="text-slate-900 font-black text-sm tracking-tight">{label}</span>
        <span className="text-slate-500 text-xs mt-0.5 leading-relaxed font-medium">
          {description}
        </span>
      </div>
      <button
        type="button"
        onClick={() => toggleSetting(stateKey)}
        className={`w-12 h-7 flex items-center shrink-0 rounded-full p-1 transition-colors duration-300 ${
          settings[stateKey] ? "bg-[#ff3838]" : "bg-slate-200"
        }`}
      >
        <div
          className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
            settings[stateKey] ? "translate-x-5" : "translate-x-0"
          }`}
        ></div>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10 px-4 md:px-8 font-sans selection:bg-red-500 selection:text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="border-b border-slate-200/80 pb-5">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#ff3838] bg-red-50 border border-red-100 px-3 py-1 rounded-full">
            Preferences & Controls
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1.5">
            App <span className="text-[#ff3838]">Settings</span>
          </h1>
          <p className="text-slate-500 text-xs mt-0.5 font-medium">
            Manage your account notifications, privacy permissions, and display preferences.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.03),0_10px_25px_-5px_rgba(0,0,0,0.02)] border border-slate-200/80 overflow-hidden p-6 md:p-8 space-y-8">
          
          {/* Section: Notifications */}
          <div>
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-2xl bg-red-50 text-[#ff3838] flex items-center justify-center text-sm border border-red-100">
                <i className="fas fa-bell"></i>
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Push & Email Notifications
                </h2>
                <p className="text-[11px] text-slate-400 font-medium">
                  Stay updated on your live cooking and delivery steps
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <ToggleSwitch
                label="Order Status Updates"
                description="Receive instant notifications when kitchen begins cooking and driver is on route."
                stateKey="emailNotif"
              />
              <ToggleSwitch
                label="SMS Delivery Alerts"
                description="Get direct text messages when courier arrives at your delivery location."
                stateKey="smsNotif"
              />
              <ToggleSwitch
                label="Weekly Promos & Coupons"
                description="Receive weekly exclusive secret codes and new seasonal combo releases."
                stateKey="promoEmails"
              />
            </div>
          </div>

          {/* Section: Privacy & App */}
          <div>
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm border border-blue-100">
                <i className="fas fa-sliders-h"></i>
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  General & Security Preferences
                </h2>
                <p className="text-[11px] text-slate-400 font-medium">
                  Manage checkout privacy and location permissions
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <ToggleSwitch
                label="Remember Payment Preferences"
                description="Securely prefill your default payment method for fast 1-click checkout."
                stateKey="savePayment"
              />
              <ToggleSwitch
                label="Automatic Location Tracking"
                description="Use high-precision geolocation to calculate accurate delivery arrival times."
                stateKey="locationTracking"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
