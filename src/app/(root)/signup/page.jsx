"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function page() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to sign up");

      setMessage("✅ Account created successfully!");
      setFormData({ name: "", email: "", password: "" });
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
      <div className="w-full max-w-md bg-gray-50 p-8 rounded-2xl shadow-md border border-red-200">
        <h2 className="text-2xl font-bold text-center text-red-400 mb-6">
          Create Your Account
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-red-400">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-red-300 rounded-lg shadow-sm focus:outline-none focus:ring-red-400 focus:border-red-400"
              placeholder="Your Name"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-red-400">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-red-300 rounded-lg shadow-sm focus:outline-none focus:ring-red-400 focus:border-red-400"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-red-400">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-red-300 rounded-lg shadow-sm focus:outline-none focus:ring-red-400 focus:border-red-400 pr-10"
              placeholder="Create a password"
              required
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 cursor-pointer text-red-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-red-400 text-white font-semibold rounded-lg shadow-md hover:bg-red-500 transition cursor-pointer"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-red-500">{message}</p>
        )}

        <p className="mt-6 text-center text-sm text-red-400">
          Already have an account?{" "}
          <Link href="/login" className="text-red-500 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
