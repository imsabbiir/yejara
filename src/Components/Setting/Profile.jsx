"use client";
import React, { useRef } from "react";
import Image from "next/image";

function Profile({ user, setSelectedImage, setShowImageModal }) {
  const fileInputRef = useRef(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setSelectedImage({ preview, file });
      setShowImageModal(true);
    }
  };

  return (
    <div className="relative col-span-1 rounded-xl border border-[#7c7c7c] px-10 py-5 text-center bg-[#c9c9c9] group">
      <Image
        src={user?.photo || "/default-avatar.png"}
        alt={user?.name}
        width={1200}
        height={1200}
        className="w-full rounded-full border-16 border-[#8c8c8c] object-cover"
      />

      <button
        onClick={() => fileInputRef.current.click()}
        className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        title="Change Photo"
      >
        📁
      </button>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden"
      />
    </div>
  );
}

export default Profile;
