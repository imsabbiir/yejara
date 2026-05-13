"use client";

import { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
const cardStyle = {
  style: {
    base: {
      fontSize: "16px",
      color: "#0f172b",
      "::placeholder": {
        color: "#94a3b8",
      },
    },
    invalid: {
      color: "#ef4444",
    },
  },
};
export default function CheckoutForm({ total }) {
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      body: JSON.stringify({ amount: total }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [total]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      alert(result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
      alert("Payment Successful ✅");

      // 👉 HERE call your order API
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <CardElement options={cardStyle} />
      <button
        type="submit"
        className="bg-[#0f172b] text-white items-center justify-center gap-2 whitespace-nowrap text-sm font-medium shadow hover:bg-[#0f172b]/90 h-10 rounded-md px-8 w-full cursor-pointer transition-all duration-200 ease-in-out"
      >
        Pay ৳{total}
      </button>
    </form>
  );
}
