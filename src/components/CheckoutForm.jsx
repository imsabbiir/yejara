"use client";

import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import { forwardRef, useImperativeHandle, useEffect, useState } from "react";

const elementStyle = {
  style: {
    base: {
      color: "#5e534a",
      fontSize: "16px",
      fontFamily: "Inter, sans-serif",
      "::placeholder": {
        color: "#a1a1aa",
      },
    },
    invalid: {
      color: "#ef4444",
    },
  },
};

const CheckoutForm = forwardRef(({ total }, ref) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loadingIntent, setLoadingIntent] = useState(true);
  const [clientSecret, setClientSecret] = useState("");

  // create payment intent
  useEffect(() => {
    if (!total) return;

    setLoadingIntent(true);

    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: total }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .finally(() => setLoadingIntent(false));
  }, [total]);

  // expose function to parent (NO UI CHANGE)
  useImperativeHandle(ref, () => ({
    async submitPayment() {
      if (!stripe || !elements) {
        return { success: false, message: "Stripe not ready" };
      }

      if (!clientSecret) {
        alert("Payment is still loading. Try again in 2 seconds.");
        return;
      }

      const cardElement = elements.getElement(CardNumberElement);

      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        },
      );

      if (error) {
        return {
          success: false,
          message: error.message,
        };
      }

      if (paymentIntent?.status === "succeeded") {
        return {
          success: true,
          paymentIntent,
        };
      }

      return {
        success: false,
        message: "Payment failed",
      };
    },
  }));

  return (
    <div className="space-y-3">
      <div className="space-y-4">
        {/* Card Number */}
        <div className="border border-[#dfd6cb] rounded-full bg-white px-4 py-3">
          <CardNumberElement options={elementStyle} />
        </div>

        {/* Expiry + CVC */}
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-[#dfd6cb] rounded-full bg-white px-4 py-3">
            <CardExpiryElement options={elementStyle} />
          </div>

          <div className="border border-[#dfd6cb] rounded-full bg-white px-4 py-3">
            <CardCvcElement options={elementStyle} />
          </div>
        </div>
      </div>
    </div>
  );
});

CheckoutForm.displayName = "CheckoutForm";

export default CheckoutForm;
