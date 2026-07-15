"use client";

import Link from "next/link";
import { useState } from "react";
function page() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/forget-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(
          "A password reset link has been sent.",
        );
        setEmail("");
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
          Account recovery
        </p>

        <h1 className="font-fraunces text-6xl leading-none mb-6">
          Forgot
          <br />
          password?
        </h1>

        <p className="text-[#5e534a] max-w-sm">
          No worries. Enter your email and we’ll send you a link to reset your
          password.
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl p-8 shadow border border-[#dfd6cb] space-y-5"
      >
        <h2 className="font-fraunces text-3xl">Reset password</h2>

        {/* Success message */}
        {message && (
          <p className="text-sm text-green-700 bg-green-100 rounded-lg p-3">
            {message}
          </p>
        )}

        {/* Error message */}
        {error && (
          <p className="text-sm text-[#ee0f1f] bg-[#ee0f1f]/10 rounded-lg p-3">
            {error}
          </p>
        )}

        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-widest">
            Email
          </label>

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Your email"
            required
            className="w-full bg-[#f2eadd]/60 rounded-full px-4 py-3 text-sm outline-none focus:ring focus:ring-[#ff5b4e]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#17100b] text-[#d9d3c7] rounded-full py-3.5 text-sm font-medium hover:bg-[#ff5b4e] transition"
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>

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

export default page;
