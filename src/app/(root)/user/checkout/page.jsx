"use client";
import { useState, useEffect, useMemo } from "react";
import { useCart } from "@/context/CartContext";
import {
  Smartphone,
  CreditCard,
  Wallet,
  Truck,
  ShieldCheck,
  MapPin,
  Phone,
  Lock,
} from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe-client";
import CheckoutForm from "@/components/CheckoutForm";
import Link from "next/link";
import Image from "next/image";

const paymentOptions = [
  {
    id: "bkash",
    label: "bKash",
    description: "Pay securely with your bKash wallet",
    icon: Smartphone,
    accent: "bg-[oklch(0.62_0.21_0)] text-white",
  },
  {
    id: "nagad",
    label: "Nagad",
    description: "Fast mobile payment via Nagad",
    icon: Wallet,
    accent: "bg-[oklch(0.65_0.18_40)] text-white",
  },
  {
    id: "card",
    label: "Credit / Debit Card",
    description: "Visa, Mastercard, Amex accepted",
    icon: CreditCard,
    accent: "bg-[#0f172b] text-white",
  },
  {
    id: "cod",
    label: "Cash on Delivery",
    description: "Pay in cash when your order arrives",
    icon: Truck,
    accent: "bg-[oklch(0.55_0.15_150)] text-white",
  },
];

function page() {
  const { cart } = useCart();
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [method, setMethod] = useState("card");
  const [form, setForm] = useState({
    name: "",
    district: "",
    thana: "",
    area: "",
    postal: "",
    phone: "",
    paymentPhone: "",
    trxId: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();
        if (res.ok && data.user) setUser(data.user);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!cart) return;

    const mappedProducts = cart.map((item, index) => ({
      id: index,
      name: item.name,
      variant: item.variant || "",
      price: parseFloat(item.offerPrice) || parseFloat(item.regularPrice) || 0,
      qty: item.quantity,
      image: item.productImage,
    }));

    setProducts(mappedProducts);
  }, [cart]);

  const subtotal = useMemo(
      () =>
        cart.reduce(
          (s, i) => s + (i.offerPrice || i.regularPrice) * i.quantity,
          0,
        ),
      [cart],
    );
  const shipping = subtotal > 2500 ? 0 : 120;
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = subtotal + shipping + tax;

  const handleChange = (e) => {
    const { id, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleOrder = () => {
    const orderData = {
      userId: user?._id,
      items: products,
      shipping: form,
      paymentMethod: payment,
      totalAmount: total,
    };

    console.log("ORDER DATA:", orderData);

    alert("Order Placed Successfully ✅");
  };

  const Field = (props) => (
    <label className="block">
      <span className="text-xs font-mono uppercase tracking-widest text-[#5e534a] mb-1.5 block">
        {props.label}
      </span>
      <input
        {...props}
        className="w-full bg-white border border-[#dfd6cb] rounded-full px-4 py-3 text-sm outline-none focus:border-[#17100b] transition"
      />
    </label>
  );

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
      <form className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Contact */}
          <section>
            <h2 className="font-fraunces text-2xl mb-5">Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Full name" required />
              <Field label="Email" type="email" required />
            </div>
          </section>

          {/* Shipping */}
          <section>
            <h2 className="font-fraunces text-2xl mb-5">Shipping address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Field label="Street address" required />
              </div>
              <Field label="City" required />
              <Field label="ZIP / Postal" required />
            </div>
          </section>

          {/* Payment */}
          <section>
            <h2 className="font-fraunces text-2xl mb-5">Payment</h2>
            <div className="flex gap-3 mb-5">
              {["card", "cod"].map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`px-5 py-2.5 rounded-full text-sm border-2 transition ${method === m ? "border-ink bg-ink text-cream" : "border-[#dfd6cb]"}`}
                >
                  {m === "card" ? "Credit Card" : "Cash on Delivery"}
                </button>
              ))}
            </div>
            {method === "card" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
                  <Field
                    label="Card number"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                <div className="md:col-span-2">
                  <Field label="Expiry" placeholder="MM/YY" />
                </div>
                <Field label="CVC" placeholder="123" />
              </div>
            )}
          </section>
        </div>

        {/* Summary */}
        <aside className="bg-cream border border-[#dfd6cb] rounded-3xl p-7 h-fit sticky top-32 space-y-5">
          <h2 className="font-fraunces text-2xl">Order summary</h2>
          <div className="space-y-5 max-h-72 overflow-auto pr-2">
            {cart.map((item) => {
              return (
                <div key={`${item.productId}`} className="flex gap-3">
                  <Link
                    href={`/product/${item.productId}`}
                    className="relative overflow-hidden w-18 h-20 rounded-xl shrink-0"
                  >
                    <Image
                      src={item.productImage}
                      alt={item.name}
                      width={500}
                      height={500}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{item.name}</p>
                    <div className="flex items-center gap-5">
                      <p className="text-sm text-[#5e534a]">
                        Qty {item.quantity}
                      </p>
                      <span className="text-sm text-[#5e534a] bg-[#dfd6cb] px-5 py-1.5 rounded">
                        {item.selectedOption?.type}
                      </span>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border border-[#ff5b4e]`}
                      style={{
                        backgroundColor: `${item.selectedColor?.hex}`,
                      }}
                    ></div>
                  </div>
                  <p className="text-sm font-medium">
                    {" "}
                    ৳ {item.quantity * (item.offerPrice || item.regularPrice)}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="border-t border-[#dfd6cb] pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#5e534a]">Subtotal</span>
              <span>৳ {Math.floor(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5e534a]">Shipping</span>
              <span>{shipping === 0 ? "Free" : `৳ ${shipping}`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5e534a]">Tax</span>
              <span>৳ {Math.floor(tax)}</span>
            </div>
            <div className="flex justify-between font-fraunces text-xl pt-2">
              <span>Total</span>
              <span>৳ {Math.floor(total)}</span>
            </div>
          </div>
          <button
            // type="submit"
            className="w-full bg-[#17100b] text-[#d9d3c7] rounded-full py-3.5 text-sm font-medium hover:bg-[#ff5b4e] transition-colors inline-flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" /> Place order
          </button>
        </aside>
      </form>
    </div>
  );
}

export default page;
