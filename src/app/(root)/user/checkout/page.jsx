"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe-client";
import { Lock, User } from "lucide-react";
import toast from "react-hot-toast";

import { useCart } from "@/context/CartContext";
import CheckoutForm from "@/components/CheckoutForm";

function Field({ label, ...rest }) {
  return (
    <label className="block">
      <span className="text-xs font-mono uppercase tracking-widest text-[#5e534a] mb-1.5 block">
        {label} <span className="text-red-500">*</span>
      </span>
      <input
        {...rest}
        className="w-full bg-white border border-[#dfd6cb] rounded-full px-4 py-3 text-sm outline-none focus:border-[#17100b] transition"
      />
    </label>
  );
}
export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();

  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [useSavedInfo, setUseSavedInfo] = useState(false);
  const [method, setMethod] = useState("card");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();
        if (res.ok && data.user) setUser(data.user);
      } catch (err) {
        console.error("User fetch error:", err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (useSavedInfo && user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        zip: user.zip || "",
      });
    }
  }, [useSavedInfo, user]);

  useEffect(() => {
    if (!cart) return;
    const mapped = cart.map((item, index) => ({
      id: index,
      name: item.name,
      price: parseFloat(item.offerPrice) || parseFloat(item.regularPrice) || 0,
      qty: item.quantity,
      image: item.productImage,
      color: item.selectedColor?.hex,
      type: item.selectedOption?.type,
    }));
    setProducts(mapped);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      const price = Number(item.offerPrice) || Number(item.regularPrice) || 0;
      return acc + price * item.quantity;
    }, 0);
  }, [cart]);

  const shipping = subtotal > 2500 ? 0 : 120;
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = subtotal + shipping + tax;

  const toggleSavedInfo = () => {
    if (useSavedInfo) {
      setForm({ name: "", phone: "", address: "", city: "", zip: "" });
    }
    setUseSavedInfo((prev) => !prev);
  };

  // VALIDATION LOGIC
  const validateForm = () => {
    const phoneRegex = /^(\+8801|01)[3-9]\d{8}$/;
    const zipRegex = /^\d{4}$/;
    if (!form.name.trim()) return "Full name is required";
    if (!form.phone.trim()) return "Phone number is required";
    if (!phoneRegex.test(form.phone.trim()))
      return "Invalid Bangladeshi phone number";
    if (!form.address.trim()) return "Street address is required";
    if (!form.city.trim()) return "City is required";
    if (!form.zip.trim()) return "ZIP / Postal code is required";
    if (!zipRegex.test(form.zip.trim()))
      return "ZIP code must be exactly 4 digits";
    return null;
  };

  const handleOrder = async (e) => {
    e.preventDefault();

    // 1. Client-side Form Validation
    const errorMessage = validateForm();
    if (errorMessage) {
      toast.error(errorMessage, {
        position: "bottom-right",
      });
      return;
    }

    try {
      let paymentResult = null;

      if (method === "payment") {
        const res = await fetch("/api/ssl-payment/payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            total_amount: total,
            cus_name: form.name,
            cus_phone: form.phone,
            cus_add: form.address,
            cus_city: form.city,
            cus_zip: form.zip,
          }),
        });

        const data = await res.json();

        // Check if SSLCommerz successfully initiated and returned a Gateway URL
        if (res.ok && data?.SSLResJSON?.GatewayPageURL) {
          toast.loading("Redirecting to payment gateway...");
          window.location.href = data.SSLResJSON.GatewayPageURL;
          return; // Stop execution here as the user is leaving the site
        } else {
          return toast.error(
            data?.SSLResJSON?.failedreason ||
              "SSLCommerz payment failed to init.",
            {
              position: "bottom-right",
            },
          );
        }
      }

      const orderData = {
        userId: user?._id,
        items: products,
        shipping: form,
        paymentMethod: method,
        totalAmount: total,
        payment: paymentResult?.paymentIntent || null,
      };

      // 3. API Request & Error Handling
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (!res.ok)
        return toast.error(data.message || "Failed to place order", {
          position: "bottom-right",
        });
      try {
        await fetch("/api/send-sms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: form.phone.trim(),
            name: form.name,
            total: Math.floor(total),
          }),
        });
      } catch (err) {
        console.error("WhatsApp notification failed:", err);
      }
      toast.success("Order placed successfully ✅", {
        position: "bottom-right",
      });
      clearCart();
      setForm({ name: "", phone: "", address: "", city: "", zip: "" });
      setUseSavedInfo(false);
      router.push("/cart");
    } catch (err) {
      console.error("ORDER ERROR:", err);
      toast.error("Something went wrong. Please try again.", {
        position: "bottom-right",
      });
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="font-fraunces text-4xl mb-4">Nothing to check out</h1>
        <p className="text-[#5e534a] mb-8">Your bag is empty.</p>
        <Link
          href="/"
          className="inline-block bg-[#17100b] text-[#d9d3c7] rounded-full px-6 py-3 text-sm"
        >
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 py-12">
      <h1 className="font-fraunces text-5xl mb-10">Checkout</h1>

      <form
        onSubmit={handleOrder}
        className="grid grid-cols-1 lg:grid-cols-3 gap-10"
      >
        <div className="lg:col-span-2 space-y-10">
          <section>
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-full border border-[#dfd6cb] mb-6">
              <div className="flex items-center gap-2">
                <User size={18} />
                <span>Use saved profile info</span>
              </div>
              <button
                type="button"
                onClick={toggleSavedInfo}
                className={`w-12 h-6 rounded-full transition ${useSavedInfo ? "bg-green-500" : "bg-gray-300"}`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition transform ${useSavedInfo ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>

            <h2 className="font-fraunces text-2xl mb-5">Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Field
                label="Phone"
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </section>

          <section>
            <h2 className="font-fraunces text-2xl mb-5">Shipping address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Field
                  label="Street address"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </div>
              <Field
                label="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
              <Field
                label="ZIP / Postal"
                value={form.zip}
                onChange={(e) => setForm({ ...form, zip: e.target.value })}
              />
            </div>
          </section>

          <section>
            <h2 className="font-fraunces text-2xl mb-5">Payment</h2>
            <div className="flex gap-3 mb-5">
              {["payment", "cod"].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={`px-5 py-2.5 rounded-full text-sm border-2 transition ${method === m ? "border-black bg-black text-white" : "border-[#dfd6cb]"}`}
                >
                  {m === "payment" ? "Payment" : "Cash on Delivery"}
                </button>
              ))}
            </div>
          </section>
        </div>

        <aside className="bg-cream border border-[#dfd6cb] rounded-3xl p-7 h-fit sticky top-32 space-y-5">
          <h2 className="font-fraunces text-2xl">Order summary</h2>
          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>৳ {Math.floor(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `৳ ${shipping}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>৳ {Math.floor(tax)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>৳ {Math.floor(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-full flex items-center justify-center gap-2 bg-[#17100b] text-[#d9d3c7]`}
          >
            <Lock className="w-4 h-4" />
            {method === "payment" ? "Pay & Place Order" : "Place Order"}
          </button>
        </aside>
      </form>
    </div>
  );
}
