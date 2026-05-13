"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import {
  Smartphone,
  CreditCard,
  Wallet,
  Truck,
  ShieldCheck,
  MapPin,
  Phone,
} from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe-client";
import CheckoutForm from "@/components/CheckoutForm";

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
  const [payment, setPayment] = useState("card");
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

  const subtotal = products.reduce((s, p) => s + p.price * p.qty, 0);
  const shipping = subtotal > 0 ? 80 : 0;
  const total = subtotal + shipping;

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

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <h1 className="text-xl font-bold tracking-tight">Checkout</h1>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-[oklch(0.55_0.15_150)]" />
            Secure SSL Checkout
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6 ">
          {/* Shipping */}
          <div className="rounded-xl bg-white shadow">
            <div className="flex flex-col space-y-1.5 p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold leading-none tracking-tight">
                <MapPin className="h-5 w-5 text-primary" />
                Shipping Address
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 p-6 pt-0">
              <div className="space-y-2 sm:col-span-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="name"
                >
                  Full Name
                </label>
                <input
                  onChange={handleChange}
                  type=""
                  className="input-style"
                  id="name"
                  placeholder="e.g. Rahim Uddin"
                />
              </div>
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="district"
                >
                  District
                </label>
                <input
                  onChange={handleChange}
                  type=""
                  className="input-style"
                  id="district"
                  placeholder="e.g. Dhaka"
                />
              </div>
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="thana"
                >
                  Police Station (Thana)
                </label>
                <input
                  onChange={handleChange}
                  type=""
                  className="input-style"
                  id="thana"
                  placeholder="e.g. Mirpur Model"
                />
              </div>
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="village"
                >
                  Village / Area
                </label>
                <input
                  onChange={handleChange}
                  type=""
                  className="input-style"
                  id="village"
                  placeholder="e.g. Pallabi"
                />
              </div>
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="postal"
                >
                  Postal Code
                </label>
                <input
                  onChange={handleChange}
                  type=""
                  className="input-style"
                  id="postal"
                  placeholder="e.g. 1216"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1"
                  htmlFor="phone"
                >
                  <Phone className="h-3.5 w-3.5" /> Phone Number
                </label>
                <input
                  onChange={handleChange}
                  type="tel"
                  className="input-style"
                  id="phone"
                  placeholder="01XXXXXXXXX"
                />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-xl bg-white  shadow">
            <div className="flex flex-col space-y-1.5 p-6">
              <h2 className="text-lg font-semibold leading-none tracking-tight">
                Payment Method
              </h2>
            </div>
            <div className="p-6 pt-0">
              <div className="grid gap-3 sm:grid-cols-2 ">
                {paymentOptions.map((opt) => {
                  const Icon = opt.icon;
                  const active = payment === opt.id;
                  return (
                    <label
                      key={opt.id}
                      htmlFor={opt.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg shadow border border-gray-300 p-4 transition-all text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                        active
                          ? "bg-[#f6f6f7] ring-2 ring-gray-400"
                          : "hover:border-gray-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={opt.id}
                        id={opt.id}
                        checked={payment === opt.id}
                        onChange={() => setPayment(opt.id)}
                        className="hidden"
                      />
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-md ${opt.accent}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h2 className="font-semibold">{opt.label}</h2>
                        <span className="text-xs font-light">
                          {opt.description}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
              <div className="bg-[#f6f9fb] p-4 mt-4 rounded-xl border border-gray-200">
                {(payment === "bkash" || payment === "nagad") && (
                  <div className="grid gap-3 rounded-lg sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {payment === "bkash" ? "bKash" : "Nagad"} Number
                      </label>
                      <input
                        onChange={handleChange}
                        type=""
                        className="input-style"
                        placeholder="01XXXXXXXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Transaction ID
                      </label>
                      <input
                        onChange={handleChange}
                        type=""
                        className="input-style"
                        placeholder="TrxID"
                      />
                    </div>
                  </div>
                )}

                {payment === "card" && (
                  <Elements stripe={stripePromise}>
                    <CheckoutForm total={total} />
                  </Elements>
                )}

                {payment === "cod" && (
                  <p className="rounded-lg text-sm text-[#62748e]">
                    Pay{" "}
                    <span className="font-semibold text-gray-800">
                      ৳{total}
                    </span>{" "}
                    in cash when your order is delivered.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <aside>
          <div className="lg:sticky lg:top-6 rounded-xl bg-white shadow">
            <div className="flex flex-col space-y-1.5 p-6">
              <h2 className="text-lg font-semibold leading-none tracking-tight">
                Order Summary
              </h2>
            </div>
            <div className="space-y-4 p-6 pt-0">
              {products.map((p) => (
                <div key={p.id} className="flex gap-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-16 w-16 flex-shrink-0 rounded-md border object-cover"
                  />
                  <div className="flex-1 text-sm">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {p.variant}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Qty: {p.qty}
                    </div>
                  </div>
                  <div className="text-sm font-semibold">৳{p.price}</div>
                </div>
              ))}

              <div className="shrink-0 bg-[#e4eaf2] h-[1px] w-full"></div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>৳{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>৳{shipping}</span>
                </div>
              </div>

              <div className="shrink-0 bg-[#e4eaf2] h-[1px] w-full"></div>

              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span>৳{total}</span>
              </div>
              <p className="text-center text-xs text-muted-foreground">
                By placing your order you agree to our Terms & Privacy Policy.
              </p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default page;
