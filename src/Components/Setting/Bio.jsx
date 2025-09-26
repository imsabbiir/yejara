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
    <div className="col-span-2 rounded-xl border border-[#7c7c7c] bg-[#c9c9c9]">
      <div className="p-5 flex justify-between items-center">
        <h2 className="text-lg">Bio & other details</h2>
        <div className="w-3 h-3 bg-emerald-600 flex justify-center items-center rounded-full">
          <span className="inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
        </div>
      </div>

      <div className="px-10">
        {editState ? (
          <form className="flex flex-col">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="text-xl font-semibold text-[#333] mb-3 border-b border-[#7c7c7c] outline-none"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="text-lg font-medium text-[#333] border-b border-[#7c7c7c] outline-none"
            />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="text-sm font-medium text-[#7c7c7c] italic border-b border-[#7c7c7c] outline-none mt-2"
            />
          </form>
        ) : (
          <div>
            <h2 className="text-xl font-semibold text-[#333] mb-3">
              {user?.name}
            </h2>
            <span className="text-lg font-medium text-[#333]">
              {user.email}
            </span>
            <address className="text-sm font-medium text-[#7c7c7c] mt-2">
              {user.address}
            </address>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-5">
          <div className="flex gap-5">
            {editState ? (
              <>
                <button
                  className="px-5 py-2 rounded cursor-pointer bg-[#333] font-semibold text-white hover:bg-[#222] transition-all duration-100"
                  onClick={handleCancelClick}
                >
                  Cancel
                </button>
                <button
                  className="px-5 py-2 rounded cursor-pointer bg-green-600 font-semibold text-white hover:bg-green-700 transition-all duration-100"
                  onClick={handleSaveClick}
                >
                  Save
                </button>
              </>
            ) : (
              <button
                className="px-5 py-2 rounded cursor-pointer bg-[#333] font-semibold text-white hover:bg-[#222] transition-all duration-100"
                onClick={handleEditClick}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bio;
