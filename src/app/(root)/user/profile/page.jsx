"use client";
import { useEffect, useState } from "react";
import Title from "@/Components/Setting/Title";
import Profile from "@/Components/Setting/Profile";
import Bio from "@/Components/Setting/Bio";
import ChangePassword from "@/Components/Setting/ChangePassword";
import DeleteAccount from "@/Components/Setting/DeleteAccount";
import PreviewProfile from "@/Components/Setting/PreviewProfile";

function Page() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    async function getUser() {
      const res = await fetch("/api/me");
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setFormData({
          name: data.user.name || "",
          email: data.user.email || "",
          address: data.user.address || "",
        });
      }
    }
    getUser();
  }, []);

  if (!user) return <p className="text-center py-10 text-gray-500">Loading user info...</p>;

  return (
    <div className="p-5 sm:p-8 lg:p-10">
      {/* Title Section */}
      <Title />

      {/* Profile & Bio Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 mt-7">
        <Profile
          user={user}
          setSelectedImage={setSelectedImage}
          setShowImageModal={setShowImageModal}
        />

        <Bio
          user={user}
          setUser={setUser}
          formData={formData}
          setFormData={setFormData}
        />
      </div>

      {/* Other Settings */}
      <div className="mt-10 md:space-y-10">
        <ChangePassword />
        <DeleteAccount />
      </div>

      {/* Preview Modal */}
      <PreviewProfile
        showImageModal={showImageModal}
        setShowImageModal={setShowImageModal}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        setUser={setUser}
      />
    </div>
  );
}

export default Page;
