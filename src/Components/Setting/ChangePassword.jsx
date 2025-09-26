"use client";
import React, { useState } from "react";

function ChangePassword() {
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
    try {
      const res = await fetch("/api/changePassword", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          currentPassword: changePasswordFormData.currentPassword,
          newPassword: changePasswordFormData.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Password changed successfully");
        setChangePasswordFormData({ currentPassword: "", newPassword: "" });
      } else {
        alert(data.message || "Failed to change password");
      }
    } catch (err) {
      alert("An error occurred while changing password");
    }
  };
  return (
    <div className="mt-10 rounded-xl border border-[#7c7c7c] bg-[#c9c9c9] p-5">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold text-[#333]">Change Password</h2>
      </div>

      <form className="grid grid-cols-3 gap-5" autoComplete="off">
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
        <input
          type="password"
          name="currentPassword"
          autoComplete="current-password"
          value={changePasswordFormData.currentPassword}
          onChange={handlePasswordInputChange}
          placeholder="Current Password"
          className="px-3 py-2 rounded border border-[#7c7c7c] bg-white text-[#333] outline-none"
        />
        <input
          type="password"
          name="newPassword"
          autoComplete="new-password"
          value={changePasswordFormData.newPassword}
          onChange={handlePasswordInputChange}
          placeholder="New Password"
          className="px-3 py-2 rounded border border-[#7c7c7c] bg-white text-[#333] outline-none"
        />
        <button
          type="button"
          onClick={handlePasswordChange}
          className="px-5 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition-all duration-100 w-fit"
        >
          Change Password
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;
