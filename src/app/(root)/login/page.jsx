"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function page() {
  const route = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const validateForm = () => {
    if (!formData.email.trim()) {
      toast.error("Please enter your email.", {
        position: "bottom-right",
        icon: "❌",
        style: {
          background: "#17100b",
          color: "white",
        },
      });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email.", {
        position: "bottom-right",
        icon: "❌",
        style: {
          background: "#17100b",
          color: "white",
        },
      });
      return false;
    }

    if (!formData.password) {
      toast.error("Please enter your password.", {
        position: "bottom-right",
        icon: "❌",
        style: {
          background: "#17100b",
          color: "white",
        },
      });
      return false;
    }

    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setErr("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
        credentials: "include", // 🔥 important so cookie gets saved
      });

      const data = await res.json();

      if (res.ok) {
        // 🔥 Trigger UserMenu to re-fetch user immediately
        window.dispatchEvent(new Event("userLogin"));

        //redirect
        route.push("/profile");
        // window.location.reload();
        toast("You are logged in Successfully!", {
          duration: 4000,
          position: "bottom-right",
          style: {
            background: "#007a56",
            color: "white",
          },
          className: "",
          icon: "✅",
          removeDelay: 1000,
        });
      } else {
        setErr(data.message || "Login failed");
        toast(data.message, {
          position: "bottom-right",
          style: {
            background: "#17100b",
            color: "#fff",
          },
          icon: "❌",
        });
      }
    } catch (error) {
      setErr("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-275 mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
      <div className="hidden md:block">
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#ff5b4e] mb-3">
          Members only
        </p>
        <h1 className="font-fraunces text-6xl leading-none mb-6">
          Welcome
          <br />
          back.
        </h1>
        <p className="text-[#5e534a] max-w-sm">
          Sign in to track orders, save your wishlist, and check out faster.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl p-8 shadow border border-[#dfd6cb] space-y-5"
      >
        <h2 className="font-fraunces text-3xl">Sign in</h2>
        {/* {err && (
          <p className="text-sm text-[#ee0f1f] bg-[#ee0f1f]/10 rounded-lg p-3">
            {err}
          </p>
        )} */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase tracking-widest">
            Email
          </label>
          <input
            value={formData.email}
            name="email"
            onChange={handleChange}
            type="email"
            placeholder="Your email"
            className="w-full bg-[#f2eadd]/60 rounded-xl px-4 py-3 text-sm outline-none focus:ring focus:ring-[#ff5b4e]"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase tracking-widest">
            Password
          </label>
          <input
            value={formData.password}
            name="password"
            onChange={handleChange}
            type="password"
            placeholder="Password"
            className="w-full bg-[#f2eadd]/60 rounded-xl px-4 py-3 text-sm outline-none focus:ring focus:ring-[#ff5b4e]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#17100b] text-[#d9d3c7] rounded-full py-3.5 text-sm font-medium hover:bg-[#ff5b4e] transition"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
        <div className="flex justify-between items-center">
          <p className="text-sm text-center text-[#5e534a]">
            New here?{" "}
            <Link
              href="/signup"
              className="text-[#17100b] underline underline-offset-4"
            >
              Create an account
            </Link>
          </p>
          <p className="text-sm text-center text-[#5e534a]">
            Forget Password?{" "}
            <Link
              href="/forget-password"
              className="text-[#17100b] underline underline-offset-4"
            >
              Reset Here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
