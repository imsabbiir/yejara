"use client";
import { useEffect, useState } from "react";
import { LogOut, Trash2, Save, KeyRound, Package, Heart } from "lucide-react";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
export default function page() {
  const { wishlist } = useWishlist();
  const [user, setUser] = useState();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
  });
  const [pw, setPw] = useState({ current: "", next: "" });

  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    router.push("/");
  };

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
  const initial = user?.name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
    if(!user){
      return(
        <div className="max-w-md mx-auto px-6 py-24 text-center">
          <h1 className="font-fraunces text-4xl mb-3">Sign in required</h1>
          <p className="text-[#5e534a] mb-6">Create an account or sign in to view your profile.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/login" className="bg-[#17100b] text-[#fcf6e9] rounded-full px-6 py-3 text-sm">Sign in</Link>
            <Link href="/signup" className="border border-[#dfd6cb] rounded-full px-6 py-3 text-sm">Create account</Link>
          </div>
        </div>
      )
    }
    
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12">
      <div className="bg-white rounded-3xl p-8 shadow-soft border border-[#dfd6cb] mb-8 flex flex-wrap items-center gap-6">
        <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-fraunces font-semibold text-[#fcf6e9] shrink-0 bg-[#ff5b4e]">
          {initial}
        </div>
        <div className="flex-1 min-w-[200px]">
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
        <div className="flex gap-2">
          <Link
            href="/orders"
            className="px-4 py-2.5 rounded-full bg-[#f2eadd] text-sm flex items-center gap-2"
          >
            <Package className="w-4 h-4" /> orders
          </Link>
          <Link
            href="/wishlist"
            className="px-4 py-2.5 rounded-full bg-[#f2eadd] text-sm flex items-center gap-2"
          >
            <Heart className="w-4 h-4" /> {wishlist.length}
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-full bg-[#17100b] text-[#fcf6e9] text-sm flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </div>


      <div className="grid lg:grid-cols-3 gap-6">
        <form className="lg:col-span-2 bg-white rounded-3xl p-7 shadow-soft border border-[#dfd6cb]">
          <h2 className="font-frauncces text-2xl mb-5">
            Account details
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {([
                ["Full name", "name"], ["Email", "email"],
                ["Phone", "phone"], ["ZIP", "zip"],
                ["Address", "address"], ["City", "city"],
              ]).map(([label, key]) => (
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

          <button className="mt-6 inline-flex items-center gap-2 bg-[#17100b] text-[#fcf6e9] rounded-full px-5 py-2.5 text-sm cursor-pointer">
            <Save className="w-4 h-4" /> Save changes
          </button>
        </form>
        <div className="space-y-6">
            <form className="bg-card rounded-3xl p-7 shadow-soft border border-[#dfd6cb]">
              <h2 className="text-display text-2xl mb-5 flex items-center gap-2"><KeyRound className="w-5 h-5" /> Password</h2>
              <input value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} type="password" placeholder="Current" className="w-full bg-[#f2eadd]/60 rounded-xl px-4 py-3 text-sm outline-none mb-3" />
              <input value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} type="password" placeholder="New password" className="w-full bg-[#f2eadd]/60 rounded-xl px-4 py-3 text-sm outline-none mb-4" />
              <button className="w-full bg-[#ff5b4e] text-[#fcf6e9] rounded-full py-2.5 text-sm">Update password</button>
            </form>

            <div className="bg-card rounded-3xl p-7 shadow-soft border border-[#ee0f1f]/30">
              <h2 className="font-fraunces text-2xl mb-2 text-[#ee0f1f]">Danger zone</h2>
              <p className="text-sm text-[#5e534a] mb-4">Permanently delete your account and personal data.</p>
              <button className="inline-flex items-center gap-2 border border-[#ee0f1f] text-[#ee0f1f] rounded-full px-5 py-2.5 text-sm hover:bg-[#ee0f1f] hover:text-[#f8f8f8] transition cursor-pointer"><Trash2 className="w-4 h-4" /> Delete account</button>
            </div>
          </div>
      </div>
    </div>
  );
}
