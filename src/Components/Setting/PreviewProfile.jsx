import Image from "next/image";
import React from "react";

function PreviewProfile({
  showImageModal,
  setShowImageModal,
  selectedImage,
  setSelectedImage,
  setUser
}) {
  const imgbbAPIKey = "5b2ef45b60d101944000e14136cc59a6";
  const uploadImage = async (file) => {
  if (!file) {
    console.error("No file found for upload.");
    return;
  }

  console.log("Uploading file:", file);

  const formData = new FormData();
  formData.append("image", file); 

  try {
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    

    if (!res.ok) {
      console.error("Upload failed:", data);
      alert(data.message || "Upload failed");
      return;
    }

    alert("Image uploaded successfully!");
    console.log("image url", data.data.url)
    const updateRes = await fetch("/api/updateProfile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photo: data.data.url}),
    });

    const updateData = await updateRes.json();

    if (updateRes.ok) {
      setUser((prev) => ({ ...prev, photo: updateData.user.photo }));
      alert("Profile photo updated");
    } else {
      alert(updateData.message || "Failed to update profile photo");
    }
  } catch (err) {
    console.error("Upload error:", err);
    alert("Network error: " + err.message);
  }
};

console.log("Selected Image:", selectedImage); 
console.log("File:", selectedImage?.file);



  return (
    <>
      {showImageModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md text-center">
            <h2 className="text-lg font-semibold mb-4">Preview Image</h2>
            <Image
              src={selectedImage.preview}
              alt="Preview"
              width={500}
              height={500}
              className="w-40 h-40 object-cover rounded-full mx-auto mb-4 border"
            />
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  uploadImage(selectedImage.file);
                  setShowImageModal(false);
                  setSelectedImage(null);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setSelectedImage(null);
                  setShowImageModal(false);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PreviewProfile;
