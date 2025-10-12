"use client";
import React, { useState } from "react";

function ChangePassword({ user }) {
  const [changePasswordFormData, setChangePasswordFormData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const handlePasswordInputChange = (e) => {
    setChangePasswordFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordChange = async () => {
    if (!changePasswordFormData.currentPassword || !changePasswordFormData.newPassword) {
      alert("Please fill in both fields before changing password.");
      return;
    }

    try {
      const res = await fetch("/api/changePassword", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user?.email,
          currentPassword: changePasswordFormData.currentPassword,
          newPassword: changePasswordFormData.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Password changed successfully!");
        setChangePasswordFormData({ currentPassword: "", newPassword: "" });
      } else {
        alert(data.message || "Failed to change password");
      }
    } catch (err) {
      alert("An error occurred while changing password");
    }
  };

  return (
    <div className="mt-10 rounded-2xl border border-[#7c7c7c] bg-[#c9c9c9] p-5 sm:p-7 md:p-8 transition-all duration-300 hover:shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-[#333]">Change Password</h2>
      </div>

      {/* Form Section */}
      <form
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        autoComplete="off"
      >
        {/* Hidden inputs (for browser autocomplete issues) */}
        <input
          type="text"
          name="fakeusernameremembered"
          autoComplete="username"
          style={{ display: "none" }}
        />
        <input
          type="password"
          name="fakepasswordremembered"
          autoComplete="current-password"
          style={{ display: "none" }}
        />

        {/* Current Password */}
        <input
          type="password"
          name="currentPassword"
          autoComplete="current-password"
          value={changePasswordFormData.currentPassword}
          onChange={handlePasswordInputChange}
          placeholder="Current Password"
          className="px-4 py-2.5 rounded-lg border border-[#7c7c7c] bg-white text-[#333] outline-none focus:border-[#333] transition-all duration-150 text-sm sm:text-base"
        />

        {/* New Password */}
        <input
          type="password"
          name="newPassword"
          autoComplete="new-password"
          value={changePasswordFormData.newPassword}
          onChange={handlePasswordInputChange}
          placeholder="New Password"
          className="px-4 py-2.5 rounded-lg border border-[#7c7c7c] bg-white text-[#333] outline-none focus:border-[#333] transition-all duration-150 text-sm sm:text-base"
        />

        {/* Submit Button */}
        <button
          type="button"
          onClick={handlePasswordChange}
          className="px-5 py-2.5 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all duration-150 w-full sm:w-auto"
        >
          Change Password
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;
