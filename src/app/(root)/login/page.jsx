"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const form = e.target;
  const email = form.email.value;
  const password = form.password.value;

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (res.ok) {
    alert(data.message);
    
  } else {
    alert(data.error);
  }
};

  return (
    <div className="py-20 flex items-center bg-gray-100 justify-center px-4">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-md border border-red-200">
        <h2 className="text-2xl font-bold text-center text-red-500 mb-6">
          Welcome Back!
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-red-400"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-red-300 rounded-lg shadow-sm focus:outline-none focus:ring-red-400 focus:border-red-400"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-red-400"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-red-300 rounded-lg shadow-sm focus:outline-none focus:ring-red-400 focus:border-red-400 pr-10"
              placeholder="••••••••"
              required
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 cursor-pointer text-red-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-sm text-red-400">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                className="form-checkbox text-red-400"
              />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-sm text-red-400 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-red-400 text-white font-semibold rounded-lg shadow-md hover:bg-red-500 transition cursor-pointer"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-red-400">
          Don't have an account?{" "}
          <Link href="/signup" className="text-red-500 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
