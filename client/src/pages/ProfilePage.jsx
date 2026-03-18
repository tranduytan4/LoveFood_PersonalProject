import React, { useState } from "react";

const ProfilePage = () => {
  // Mock User Data State
  const [user, setUser] = useState({
    firstName: "Trần Duy",
    lastName: "Tân",
    email: "tranduytannd13@gmail.com",
    phone: "0793 946 182",
    address: "556 Hoàng Diệu, Bình Thuận, Hải Châu, Đà Nẵng",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Simulated save logic
    setUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#0d1b2a] mb-8 text-center md:text-left">
          My <span className="text-[#ff3838]">Profile</span>
        </h1>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header/Banner Section */}
          <div className="bg-gradient-to-r from-[#ff7b00] to-[#ff3838] h-32 relative">
            <div className="absolute -bottom-12 left-8 w-24 h-24 bg-white rounded-full p-1 shadow-md">
              <img
                src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&size=150`}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>

          <div className="pt-16 pb-8 px-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-500">Food Lover & Premium Member</p>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition flex items-center gap-2"
                >
                  <i className="fas fa-edit"></i> Edit Profile
                </button>
              )}
            </div>

            {/* Form Details Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* First Name */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff3838] transition"
                  />
                ) : (
                  <p className="text-lg text-gray-800 font-medium">
                    {user.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff3838] transition"
                  />
                ) : (
                  <p className="text-lg text-gray-800 font-medium">
                    {user.lastName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff3838] transition"
                  />
                ) : (
                  <p className="text-lg text-gray-800 font-medium">
                    {user.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff3838] transition"
                  />
                ) : (
                  <p className="text-lg text-gray-800 font-medium whitespace-pre-wrap">
                    {user.phone || "Not provided"}
                  </p>
                )}
              </div>

              {/* Address (Full width) */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Delivery Address
                </label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff3838] transition resize-none"
                  ></textarea>
                ) : (
                  <p className="text-lg text-gray-800 font-medium whitespace-pre-wrap">
                    {user.address || "Not provided"}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons (Visible only while editing) */}
            {isEditing && (
              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-100 justify-end flex-wrap">
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition min-w-[120px]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-[#ff3838] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-[#e62e2e] hover:-translate-y-1 transition-all active:scale-95 min-w-[120px]"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
