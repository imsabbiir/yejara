"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function page({ params }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/reset-password/${params.token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Password reset successful! Redirecting...");
        setFormData({ password: "", confirmPassword: "" });

        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-275 mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
      {/* LEFT SIDE */}
      <div className="hidden md:block">
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#ff5b4e] mb-3">
          Secure reset
        </p>

        <h1 className="font-fraunces text-6xl leading-none mb-6">
          Create
          <br />
          new password
        </h1>

        <p className="text-[#5e534a] max-w-sm">
          Choose a strong password to secure your account. Make sure it is
          unique and hard to guess.
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl p-8 shadow border border-[#dfd6cb] space-y-5"
      >
        <h2 className="font-fraunces text-3xl">Reset password</h2>

        {/* Success */}
        {message && (
          <p className="text-sm text-green-700 bg-green-100 rounded-lg p-3">
            {message}
          </p>
        )}

        {/* Error */}
        {error && (
          <p className="text-sm text-[#ee0f1f] bg-[#ee0f1f]/10 rounded-lg p-3">
            {error}
          </p>
        )}

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase tracking-widest">
            New Password
          </label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter new password"
            required
            className="w-full bg-[#f2eadd]/60 rounded-xl px-4 py-3 text-sm outline-none focus:ring focus:ring-[#ff5b4e]"
          />
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase tracking-widest">
            Confirm Password
          </label>

          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
            required
            className="w-full bg-[#f2eadd]/60 rounded-xl px-4 py-3 text-sm outline-none focus:ring focus:ring-[#ff5b4e]"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#17100b] text-[#d9d3c7] rounded-full py-3.5 text-sm font-medium hover:bg-[#ff5b4e] transition"
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>

        {/* Back */}
        <p className="text-sm text-center text-[#5e534a]">
          Remember password?{" "}
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