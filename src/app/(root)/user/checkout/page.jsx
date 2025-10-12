"use client";
import React, { useEffect, useRef, useState } from "react";
import { BsShieldLockFill } from "react-icons/bs";
import Image from "next/image";
import bkash from "@/media/bkash.png";
import nagad from "@/media/nagad.png";
import card from "@/media/card.png";
import wallet from "@/media/wallet.png";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState({
    village: "",
    district: "",
    policeStation: "",
    postalCode: "",
    phone: "",
  });

  const [cardNumbers, setCardNumbers] = useState(["", "", "", ""]);
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [errors, setErrors] = useState({});
  const cardRefs = [useRef(), useRef(), useRef(), useRef()];

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

  const subtotal = cart.reduce(
    (sum, item) => sum + (parseFloat(item.offerPrice) || parseFloat(item.regularPrice)) * item.quantity,
    0
  );
  const shipping = subtotal > 55 ? 0 : 5;
  const total = subtotal + shipping;

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCardChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newValues = [...cardNumbers];
    newValues[index] = value.slice(0, 4);
    setCardNumbers(newValues);
    if (value.length === 4 && index < 3) cardRefs[index + 1].current.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (pasted.length === 16) {
      e.preventDefault();
      const parts = pasted.match(/.{1,4}/g);
      setCardNumbers(parts);
      cardRefs[3].current.focus();
    }
  };

  const isValidPostalCode = (code) => /^\d{4}$/.test(code);
  const isValidBDPhone = (phone) => /^(01[3-9]\d{8})$/.test(phone);

  const handleCheckout = async () => {
    const newErrors = {};
    if (!address.village) newErrors.village = "Village is required";
    if (!address.district) newErrors.district = "District is required";
    if (!address.policeStation) newErrors.policeStation = "Police Station is required";
    if (!address.postalCode) newErrors.postalCode = "Postal Code is required";
    else if (!isValidPostalCode(address.postalCode))
      newErrors.postalCode = "Enter a valid 4-digit postal code";
    if (!address.phone) newErrors.phone = "Phone Number is required";
    else if (!isValidBDPhone(address.phone))
      newErrors.phone = "Enter a valid Bangladeshi phone number";

    if (selectedPayment === "card") {
      if (cardNumbers.some((n) => n.length < 4)) newErrors.cardNumbers = "Complete your card number";
      if (!expiry) newErrors.expiry = "Expiry date is required";
      if (!cvv) newErrors.cvv = "CVV is required";
      if (!cardName) newErrors.cardName = "Cardholder name is required";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    if (!user?._id) {
      alert("⚠️ Please log in before placing an order.");
      return;
    }

    setLoading(true);
    try {
      const orderItems = cart.map((item) => ({
        productId: item.productId,
        title: item.name,
        price: parseFloat(item.offerPrice) || parseFloat(item.regularPrice),
        quantity: item.quantity,
        image: item.productImage,
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          items: orderItems,
          address,
          paymentMethod: selectedPayment,
          totalAmount: total,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Order placed successfully!");
        clearCart?.();
      } else {
        alert("❌ Failed to place order. Please try again.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong during checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full py-10 bg-gray-100 min-h-screen">
      <div className="w-[95%] md:w-[90%] lg:w-[85%] mx-auto flex flex-col lg:flex-row gap-6">

        {/* LEFT SIDE */}
        <div className="lg:w-2/5 bg-[#1e1e28] text-white rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Delivery Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {["village", "policeStation", "district", "postalCode"].map((field) => (
                <div key={field}>
                  <input
                    type="text"
                    name={field}
                    value={address[field]}
                    onChange={handleAddressChange}
                    placeholder={field.replace(/([A-Z])/g, " $1")}
                    className={`bg-transparent border rounded-md px-3 py-2 w-full ${
                      errors[field] ? "border-red-500" : "border-gray-500 focus:border-red-400"
                    }`}
                  />
                  {errors[field] && <p className="text-red-400 text-xs mt-1">{errors[field]}</p>}
                </div>
              ))}
            </div>
            <div className="mt-3">
              <input
                type="text"
                name="phone"
                value={address.phone}
                onChange={handleAddressChange}
                placeholder="Phone Number"
                className={`bg-transparent border rounded-md px-3 py-2 w-full ${
                  errors.phone ? "border-red-500" : "border-gray-500 focus:border-red-400"
                }`}
              />
              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div className="mt-6 border-t border-gray-500 pt-4 text-sm">
            <div className="flex justify-between mb-1">
              <p>Items ({cart.length})</p>
              <p>BDT {subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between mb-1">
              <p>Shipping</p>
              <p>BDT {shipping.toFixed(2)}</p>
            </div>
            <div className="flex justify-between font-bold text-red-400 mt-2">
              <p>TOTAL</p>
              <p>BDT {total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:w-3/5 bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-gray-800 font-semibold text-2xl mb-4">
            Choose a Payment Method
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { id: "bkash", name: "Bkash", img: bkash },
              { id: "nagad", name: "Nagad", img: nagad },
              { id: "card", name: "Credit Card", img: card },
              { id: "cod", name: "Cash On Delivery", img: wallet },
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedPayment(method.id)}
                className={`border rounded-lg p-3 flex flex-col items-center transition ${
                  selectedPayment === method.id ? "border-red-400 bg-red-50" : "border-gray-300 hover:border-red-300"
                }`}
              >
                <Image src={method.img} alt={method.name} className="w-7 h-7" />
                <p className="text-xs font-semibold mt-2 text-gray-700">{method.name}</p>
              </button>
            ))}
          </div>

          {/* Credit Card */}
          {selectedPayment === "card" && (
            <div className="mb-4">
              <div className="grid grid-cols-4 gap-2 mb-2">
                {cardNumbers.map((num, idx) => (
                  <input
                    key={idx}
                    ref={cardRefs[idx]}
                    type="text"
                    maxLength={4}
                    value={num}
                    onChange={(e) => handleCardChange(idx, e.target.value)}
                    onPaste={idx === 0 ? handlePaste : undefined}
                    placeholder="0000"
                    className={`border-b px-2 py-1 text-center ${
                      errors.cardNumbers ? "border-red-500" : "border-gray-400 focus:border-red-400"
                    }`}
                  />
                ))}
              </div>
              {errors.cardNumbers && <p className="text-red-400 text-xs mb-2">{errors.cardNumbers}</p>}
              <div className="flex flex-col sm:flex-row gap-4 mb-2">
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className={`border-b w-full sm:w-1/2 px-2 py-1 ${
                    errors.expiry ? "border-red-500" : "border-gray-400 focus:border-red-400"
                  }`}
                />
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => /^\d{0,3}$/.test(e.target.value) && setCvv(e.target.value)}
                  placeholder="CVV"
                  className={`border-b w-full sm:w-1/2 px-2 py-1 ${
                    errors.cvv ? "border-red-500" : "border-gray-400 focus:border-red-400"
                  }`}
                />
              </div>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Cardholder Name"
                className={`border-b w-full px-2 py-1`}
              />
            </div>
          )}

          <div className="flex items-center text-sm text-gray-600 mb-5">
            <BsShieldLockFill className="text-lg mr-2 text-red-500" />
            Secure Payment - Your data is encrypted and safe.
          </div>

          <button
            disabled={loading}
            onClick={handleCheckout}
            className={`w-full ${loading ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"} text-white py-3 rounded-md font-semibold transition`}
          >
            {loading ? "Processing..." : "Confirm & Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
}
