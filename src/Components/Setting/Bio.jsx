"use client";
import React, { useState } from "react";

function Bio({ user, setUser, formData, setFormData }) {
  const [editState, setEditState] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditClick = () => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      address: user.address || "",
    });
    setEditState(true);
  };

  const handleCancelClick = () => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      address: user.address || "",
    });
    setEditState(false);
  };

  const handleSaveClick = async () => {
    try {
      const res = await fetch("/api/updateProfile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        setEditState(false);
      } else {
        alert(data.message || "Failed to update");
      }
    } catch (err) {
      alert("An error occurred");
    }
  };

  return (
    <div className="col-span-1 md:col-span-2 rounded-2xl border border-[#7c7c7c] bg-[#c9c9c9] p-5 sm:p-7 md:p-8 transition-all duration-300 hover:shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h2 className="text-lg sm:text-xl font-semibold text-[#222]">
          Bio & other details
        </h2>
        <div className="relative w-3 h-3 bg-emerald-600 rounded-full flex justify-center items-center">
          <span className="absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
        </div>
      </div>

      {/* Form or Display */}
      <div className="mt-6 sm:mt-8">
        {editState ? (
          <form className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="text-base sm:text-lg font-semibold text-[#333] border-b border-[#7c7c7c] outline-none bg-transparent focus:border-[#333] transition-all duration-150"
              placeholder="Enter name"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="text-sm sm:text-base font-medium text-[#333] border-b border-[#7c7c7c] outline-none bg-transparent focus:border-[#333] transition-all duration-150"
              placeholder="Enter email"
            />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="text-sm sm:text-base font-medium text-[#555] italic border-b border-[#7c7c7c] outline-none bg-transparent focus:border-[#333] transition-all duration-150"
              placeholder="Enter address"
            />
          </form>
        ) : (
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-[#333] mb-2 break-words">
              {user?.name || "No name provided"}
            </h2>
            <span className="block text-sm sm:text-base font-medium text-[#333] break-words">
              {user.email || "No email available"}
            </span>
            <address className="block text-xs sm:text-sm font-medium text-[#555] italic mt-2 break-words">
              {user.address || "No address provided"}
            </address>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-5">
        {editState ? (
          <>
            <button
              type="button"
              onClick={handleCancelClick}
              className="px-5 py-2 sm:px-6 sm:py-2.5 rounded-lg cursor-pointer bg-[#333] font-semibold text-white hover:bg-[#222] transition-all duration-150 text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveClick}
              className="px-5 py-2 sm:px-6 sm:py-2.5 rounded-lg cursor-pointer bg-green-600 font-semibold text-white hover:bg-green-700 transition-all duration-150 text-sm sm:text-base"
            >
              Save
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={handleEditClick}
            className="px-5 py-2 sm:px-6 sm:py-2.5 rounded-lg cursor-pointer bg-[#333] font-semibold text-white hover:bg-[#222] transition-all duration-150 text-sm sm:text-base"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

export default Bio;
