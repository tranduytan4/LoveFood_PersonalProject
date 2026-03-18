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
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition px-2 rounded-xl">
      <div className="flex flex-col pr-4">
        <span className="text-gray-800 font-bold text-lg">{label}</span>
        <span className="text-gray-500 text-sm mt-1 leading-relaxed">
          {description}
        </span>
      </div>
      <button
        onClick={() => toggleSetting(stateKey)}
        className={`w-14 h-8 flex items-center shrink-0 rounded-full p-1 transition-colors duration-300 ${
          settings[stateKey] ? "bg-[#ff3838]" : "bg-gray-300"
        }`}
      >
        <div
          className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
            settings[stateKey] ? "translate-x-6" : "translate-x-0"
          }`}
        ></div>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0d1b2a] mb-2">
            App <span className="text-[#ff3838]">Settings</span>
          </h1>
          <p className="text-gray-500 text-lg">
            Manage your app preferences and notification settings.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden p-6 md:p-8">
          
          {/* Section: Notifications */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-red-50 text-[#ff3838] flex items-center justify-center text-lg">
                <i className="fas fa-bell"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Notifications
              </h2>
            </div>
            <div className="pl-4 md:pl-12 flex flex-col gap-2">
              <ToggleSwitch
                label="Email Notifications"
                description="Receive order updates, receipts, and delivery statuses via email."
                stateKey="emailNotif"
              />
              <ToggleSwitch
                label="SMS Alerts"
                description="Get instant text messages when your driver is approaching."
                stateKey="smsNotif"
              />
              <ToggleSwitch
                label="Promotional Emails"
                description="Receive weekly exclusive deals, combos, and new menu items."
                stateKey="promoEmails"
              />
            </div>
          </div>

          {/* Section: Privacy & App */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-lg">
                <i className="fas fa-sliders-h"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                General & Privacy
              </h2>
            </div>
            <div className="pl-4 md:pl-12 flex flex-col gap-2">
              <ToggleSwitch
                label="Dark Mode"
                description="Switch to a dark theme for easier viewing in low-light environments."
                stateKey="darkMode"
              />
              <ToggleSwitch
                label="Save Payment Methods"
                description="Securely store your cards for faster 1-click checkout next time."
                stateKey="savePayment"
              />
              <ToggleSwitch
                label="Location Tracking"
                description="Allow the app to use your GPS to suggest nearby restaurants."
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
