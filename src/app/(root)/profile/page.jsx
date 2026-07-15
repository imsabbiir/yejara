"use client";

import { useEffect, useState } from "react";
import { LogOut, Trash2, Save, KeyRound, Package, Heart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/context/WishlistContext";
import toast from "react-hot-toast";

export default function Page() {
  const router = useRouter();
  const { wishlist } = useWishlist();

  const [user, setUser] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    photo: "",
  });

  const [pw, setPw] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  // =========================
  // Get User
  // =========================
  useEffect(() => {
    async function getUser() {
      try {
        const res = await fetch("/api/me", {
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          setUser(data.user);

          setFormData({
            name: data.user.name || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
            address: data.user.address || "",
            city: data.user.city || "",
            zip: data.user.zip || "",
            photo: data.user.photo || "",
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    getUser();
  }, []);

  // =========================
  // Logout
  // =========================
  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
    router.push("/");
    // window.location.reload();
    toast("You are logged out!", {
      duration: 4000,
      position: "bottom-right",
      style: {
        background: "#ff5b4e",
        color: "white",
      },
      className: "",
      icon: "✅",
      removeDelay: 1000,
    });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ instant preview (no waiting)
    const localPreview = URL.createObjectURL(file);
    setPreviewPhoto(localPreview);

    const form = new FormData();
    form.append("image", file);

    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: form,
        },
      );

      const data = await res.json();

      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          photo: data.data.url,
        }));

        setPreviewPhoto(null); // clear preview after success
      } else {
        alert("Upload failed");
        setPreviewPhoto(null);
      }
    } catch (err) {
      console.log(err);
      setPreviewPhoto(null);
    }
  };

  // =========================
  // Update Profile
  // =========================
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        return alert(data.message || "Failed to update profile");
      }

      setUser(data.user);

      alert("Profile updated successfully");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Update Password
  // =========================
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    try {
      setPwLoading(true);

      const res = await fetch("/api/change-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(pw),
      });

      const data = await res.json();

      if (!res.ok) {
        return alert(data.message || "Password update failed");
      }

      alert("Password updated successfully");

      setPw({
        currentPassword: "",
        newPassword: "",
      });
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setPwLoading(false);
    }
  };

  // =========================
  // Delete Account
  // =========================
  const handleDeleteAccount = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete your account?",
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch("/api/deleteAccount", {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        return alert(data.message || "Failed to delete account");
      }

      alert("Account deleted successfully");

      router.push("/");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  // =========================
  // Loading State
  // =========================
  if (loading) {
    return <div className="py-32 text-center text-lg">Loading profile...</div>;
  }

  // =========================
  // Not Logged In
  // =========================
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <h1 className="font-fraunces text-4xl mb-3">Sign in required</h1>

        <p className="text-[#5e534a] mb-6">
          Create an account or sign in to view your profile.
        </p>

        <div className="flex gap-3 justify-center">
          <Link
            href="/login"
            className="bg-[#17100b] text-[#fcf6e9] rounded-full px-6 py-3 text-sm"
          >
            Sign in
          </Link>

          <Link
            href="/signup"
            className="border border-[#dfd6cb] rounded-full px-6 py-3 text-sm"
          >
            Create account
          </Link>
        </div>
      </div>
    );
  }

  const initial = user?.name
    ?.split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="max-w-300 mx-auto px-6 py-12">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-8 shadow-soft border border-[#dfd6cb] mb-8 flex flex-wrap items-center gap-6">
        <div className="w-24 h-24 rounded-full relative flex items-center justify-center text-3xl font-fraunces font-semibold text-[#fcf6e9] shrink-0 bg-[#ff5b4e] overflow-hidden group cursor-pointer">
          {previewPhoto || user?.photo ? (
            <img
              src={previewPhoto || user.photo}
              className="w-full h-full object-cover"
              alt="profile"
            />
          ) : (
            initial
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
              <div className="bg-white/90 text-black p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
              </div>
            </label>
          </div>
        </div>

        <div className="flex-1 min-w-50">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#ff5b4e] mb-1">
            Member since{" "}
            {new Date(user?.createdAt).toLocaleDateString(undefined, {
              month: "short",
              year: "numeric",
            })}
          </p>

          <h1 className="font-fraunces text-4xl">{user?.name}</h1>

          <p className="text-[#5e534a] text-sm">{user?.email}</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Link
            href="/orders"
            className="px-4 py-2.5 rounded-full bg-[#f2eadd] text-sm flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            Orders
          </Link>

          <Link
            href="/wishlist"
            className="px-4 py-2.5 rounded-full bg-[#f2eadd] text-sm flex items-center gap-2"
          >
            <Heart className="w-4 h-4" />
            {wishlist.length}
          </Link>

          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-full bg-[#17100b] text-[#fcf6e9] text-sm flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Form */}
        <form
          onSubmit={handleProfileUpdate}
          className="lg:col-span-2 bg-white rounded-3xl p-7 shadow-soft border border-[#dfd6cb]"
        >
          <h2 className="font-fraunces text-2xl mb-5">Account details</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              ["Full name", "name"],
              ["Email", "email"],
              ["Phone", "phone"],
              ["ZIP", "zip"],
              ["Address", "address"],
              ["City", "city"],
            ].map(([label, key]) => (
              <div
                key={key}
                className={key === "address" ? "sm:col-span-2" : ""}
              >
                <label className="text-xs font-mono uppercase tracking-widest">
                  {label}
                </label>

                <input
                  value={formData[key] || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [key]: e.target.value,
                    })
                  }
                  className="mt-1.5 w-full bg-[#f2eadd]/60 rounded-xl px-4 py-3 text-sm outline-none focus:ring focus:ring-[#ff5b4e]"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-6 inline-flex items-center gap-2 bg-[#17100b] text-[#fcf6e9] rounded-full px-5 py-2.5 text-sm cursor-pointer disabled:opacity-60"
          >
            <Save className="w-4 h-4" />

            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>

        {/* Right Side */}
        <div className="space-y-6">
          {/* Password Form */}
          <form
            onSubmit={handlePasswordUpdate}
            className="bg-card rounded-3xl p-7 shadow-soft border border-[#dfd6cb]"
          >
            <h2 className="font-fraunces text-2xl mb-5 flex items-center gap-2">
              <KeyRound className="w-5 h-5" />
              Password
            </h2>

            <input
              value={pw.currentPassword}
              onChange={(e) =>
                setPw({
                  ...pw,
                  currentPassword: e.target.value,
                })
              }
              type="password"
              placeholder="Current password"
              className="w-full bg-[#f2eadd]/60 rounded-xl px-4 py-3 text-sm outline-none mb-3"
            />

            <input
              value={pw.newPassword}
              onChange={(e) =>
                setPw({
                  ...pw,
                  newPassword: e.target.value,
                })
              }
              type="password"
              placeholder="New password"
              className="w-full bg-[#f2eadd]/60 rounded-xl px-4 py-3 text-sm outline-none mb-4"
            />

            <button
              type="submit"
              disabled={pwLoading}
              className="w-full bg-[#ff5b4e] text-[#fcf6e9] rounded-full py-2.5 text-sm disabled:opacity-60"
            >
              {pwLoading ? "Updating..." : "Update password"}
            </button>
          </form>

          {/* Danger Zone */}
          <div className="bg-card rounded-3xl p-7 shadow-soft border border-[#ee0f1f]/30">
            <h2 className="font-fraunces text-2xl mb-2 text-[#ee0f1f]">
              Danger zone
            </h2>

            <p className="text-sm text-[#5e534a] mb-4">
              Permanently delete your account and personal data.
            </p>

            <button
              onClick={handleDeleteAccount}
              className="inline-flex items-center gap-2 border border-[#ee0f1f] text-[#ee0f1f] rounded-full px-5 py-2.5 text-sm hover:bg-[#ee0f1f] hover:text-[#f8f8f8] transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Delete account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
