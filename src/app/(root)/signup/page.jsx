"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
export default function page() {
  const route = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };
  const validateForm = () => {
    if (!formData.name.trim()) {
      toast("Please enter your full name.", {
        position: "bottom-right",
        icon: "❌",
        style: {
          background: "#17100b",
          color: "white",
        },
      });
      return false;
    }

    if (formData.name.trim().length < 3) {
      toast.error("Name must be at least 3 characters.", {
        position: "bottom-right",
        icon: "❌",
        style: {
          background: "#17100b",
          color: "white",
        },
      });
      return false;
    }

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

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters.", {
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
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.err || "Failed to sign up");

      setErr("✅ Account created successfully!");
      setFormData({ name: "", email: "", password: "" });
      route.push("/login");
    } catch (error) {
      setErr(`❌ setErr("Something went wrong. Try again later.");`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-275 mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
      <div className="hidden md:block">
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#ff5b4e] mb-3">
          Join yejara
        </p>
        <h1 className="font-fraunces text-6xl leading-none mb-6">
          Become
          <br />a member.
        </h1>
        <ul className="space-y-2 text-sm text-[#5e534a] max-w-sm">
          <li>✦ Free shipping on first order</li>
          <li>✦ Track every shipment in real time</li>
          <li>✦ Early access to drops</li>
        </ul>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl p-8 shadow border border-[#dfd6cb] space-y-5"
      >
        <h2 className="font-fraunces text-3xl">Create account</h2>
        {err && (
          <p className="text-sm text-[#ee0f1f] bg-[#ee0f1f]/10 rounded-lg p-3">
            {err}
          </p>
        )}
        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase tracking-widest">
            Full Name
          </label>
          <input
            value={formData.name}
            id="name"
            onChange={handleChange}
            type="text"
            placeholder="Your Name"
            className="w-full bg-[#f2eadd]/60 rounded-xl px-4 py-3 text-sm outline-none focus:ring focus:ring-[#ff5b4e]"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase tracking-widest">
            Email
          </label>
          <input
            value={formData.email}
            id="email"
            onChange={handleChange}
            type="email"
            placeholder="Your email"
            className="w-full bg-[#f2eadd]/60 rounded-xl px-4 py-3 text-sm outline-none focus:ring focus:ring-[#ff5b4e]"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase tracking-widest">
            Password (Min 6)
          </label>
          <input
            value={formData.password}
            id="password"
            onChange={handleChange}
            type="password"
            placeholder="Password"
            className="w-full bg-[#f2eadd]/60 rounded-xl px-4 py-3 text-sm outline-none focus:ring focus:ring-[#ff5b4e]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#ff5b4e] text-[#d9d3c7] rounded-full py-3.5 text-sm font-medium hover:bg-[#17100b] transition"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
        <p className="text-sm text-center text-[#5e534a]">
          Already a member?{" "}
          <Link
            href="/login"
            className="text-[#17100b] underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
