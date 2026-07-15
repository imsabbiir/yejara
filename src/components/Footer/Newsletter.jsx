"use client";

import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message);
        return;
      }

      setMessage("Subscribed successfully!");
      setEmail("");
    } catch (error) {
      console.log(error);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-350 mx-auto px-6 py-20 bg-[#fcf6e9]">
      <div className="text-center max-w-3xl mx-auto">
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#ff5b4e] mb-4">
          Letters · Once a season
        </p>

        <h2 className="text-5xl md:text-7xl mb-6 leading-[0.9] font-fraunces">
          A note, not
          <br />a <span className="italic">notification.</span>
        </h2>

        <p className="text-[#5e534a] mb-10 max-w-md mx-auto font-inter">
          Quarterly drops, founder notes, and members-only previews. No spam,
          ever.
        </p>

        <form
          onSubmit={handleSubscribe}
          className="flex items-center gap-2 max-w-md mx-auto bg-white rounded-full p-2 shadow"
        >
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 bg-transparent px-4 py-2 outline-none text-sm"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-[#17100b] text-[#fcf6e9] rounded-full px-5 py-2.5 text-sm font-medium hover:bg-coral transition-colors inline-flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Subscribe"}

            <ArrowUpRight className="w-4 h-4" />
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-[#5e534a]">{message}</p>
        )}
      </div>
    </section>
  );
}