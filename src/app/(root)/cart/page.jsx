"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

const discounts = [
  { code: "a45c7e", discount: 20 },
  { code: "bz78wx", discount: 25 },
  { code: "hg569a", discount: 10 },
];

function CartPage() {
  const { cart, removeFromCart, clearCart, updateCartQuantity } = useCart();
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Login states
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleCheckout = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      router.push("/user/checkout");
    }
  };

  const updateQty = (productId, delta) => {
    const item = cart.find((i) => i.productId === productId);
    if (!item) return;
    const newQty = Math.max(1, item.quantity + delta);
    updateCartQuantity(productId, newQty);
  };

  const handlePromo = () => {
    const found = discounts.find(
      (dis) => dis.code === promo.trim().toLowerCase()
    );
    if (found) {
      setDiscount(found.discount);
    } else {
      setDiscount(0);
      alert("Invalid promo code");
    }
  };

  useEffect(() => {
    setDiscount(0);
  }, [promo]);

  // Example: Replace with your real backend auth check
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        const data = await res.json();
        setIsLoggedIn(!!data.user);
      } catch {
        setIsLoggedIn(false);
      }
    }
    checkAuth();
  }, []);

  // Lock scroll when any modal is open
  useEffect(() => {
    document.body.style.overflow =
      showLoginModal || showConfirmModal ? "hidden" : "auto";
  }, [showLoginModal, showConfirmModal]);

  // Close modal on ESC
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setShowLoginModal(false);
        setShowConfirmModal(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        window.dispatchEvent(new Event("userLogin"));
        setIsLoggedIn(true);
        setShowLoginModal(false);
        router.push("/user/checkout");
      } else {
        setLoginError(data.message || "Login failed");
      }
    } catch (error) {
      setLoginError("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + (item.offerPrice || item.regularPrice) * item.quantity,
    0
  );
  const shipping = subtotal > 55 ? 0 : 5;
  const totalBeforeDiscount = subtotal + shipping;
  const total = totalBeforeDiscount * (1 - discount / 100);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 md:px-12 lg:px-20">
      <div className="bg-white shadow rounded-lg p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
        {/* Cart Section */}
        <div className="md:col-span-2">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <h2 className="text-xl font-semibold mb-2 sm:mb-0">Shopping Cart</h2>
            <h2 className="text-base sm:text-lg font-semibold text-gray-600">
              {cart.length} {cart.length === 1 ? "Item" : "Items"}
            </h2>
          </div>

          {cart.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              Your cart is empty.
            </div>
          ) : (
            <div className="mt-6">
              {/* ✅ Mobile friendly card list */}
              <div className="block md:hidden space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg shadow-sm"
                  >
                    {/* Image wrapper fix */}
                    <div className="w-20 h-20 flex-shrink-0 relative">
                      <Image
                        src={item.productImage || "/default-product.png"}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover rounded"
                      />
                    </div>

                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-red-500">{item.category}</p>
                      <div className="flex items-center mt-2">
                        <button
                          className="bg-gray-200 px-2 rounded"
                          onClick={() => updateQty(item.productId, -1)}
                        >
                          −
                        </button>
                        <span className="mx-2">{item.quantity}</span>
                        <button
                          className="bg-gray-200 px-2 rounded"
                          onClick={() => updateQty(item.productId, 1)}
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm mt-2">
                        ${item.offerPrice || item.regularPrice} each
                      </p>
                      <p className="font-semibold">
                        $
                        {(
                          item.quantity *
                          (item.offerPrice || item.regularPrice)
                        ).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-xs text-blue-500 underline mt-1 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* ✅ Table for md+ screens */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Price
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cart.map((item) => (
                      <tr key={item.productId}>
                        <td className="flex items-center gap-3 px-4 py-2">
                          <div className="w-16 h-16 relative flex-shrink-0">
                            <Image
                              src={item.productImage || "/default-product.png"}
                              alt={item.name}
                              fill
                              sizes="64px"
                              className="object-cover rounded"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-red-500">
                              {item.category}
                            </p>
                            <button
                              onClick={() => removeFromCart(item.productId)}
                              className="text-xs text-blue-500 underline mt-1 cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center">
                            <button
                              className="bg-gray-200 px-2 rounded"
                              onClick={() => updateQty(item.productId, -1)}
                            >
                              −
                            </button>
                            <span className="mx-2">{item.quantity}</span>
                            <button
                              className="bg-gray-200 px-2 rounded"
                              onClick={() => updateQty(item.productId, 1)}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td>
                          <p className="text-sm">
                            ${item.offerPrice || item.regularPrice}
                          </p>
                        </td>
                        <td>
                          <p className="font-semibold">
                            $
                            {(
                              item.quantity *
                              (item.offerPrice || item.regularPrice)
                            ).toFixed(2)}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="flex justify-between py-1">
            <span>Items ({cart.length})</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Shipping</span>
            <span className="font-medium">${shipping.toFixed(2)}</span>
          </div>

          <div className="my-4">
            <label htmlFor="promo" className="text-sm">
              Promo Code
            </label>
            <div className="flex mt-1">
              <input
                id="promo"
                name="promo"
                type="text"
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                className="w-full px-2 py-1 border border-[#7e7e7e] rounded-l-md outline-none"
              />
              <button
                onClick={handlePromo}
                type="submit"
                className="bg-red-500 border border-red-500 text-white px-3 rounded-r-md"
              >
                Apply
              </button>
            </div>
          </div>

          <div className="border-t pt-4 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button
            onClick={handleCheckout}
            className="mt-6 w-full cursor-pointer bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Checkout
          </button>

          {cart.length > 0 && (
            <button
              onClick={() => setShowConfirmModal(true)}
              className="mt-3 w-full cursor-pointer bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
            >
              Clear Cart
            </button>
          )}
        </div>
        <Link
          href="/"
          className="text-sm text-blue-600 mt-4 inline-block hover:underline"
        >
          ← Continue Shopping
        </Link>
      </div>

      {/* ✅ Login Modal */}
      {showLoginModal && (
        <div
          className="fixed inset-0 bg-[#000000cb] flex items-center justify-center z-50 px-4"
          onClick={() => setShowLoginModal(false)}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">Login Required</h2>

            {loginError && (
              <p className="text-red-500 text-sm mb-3">{loginError}</p>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-3">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={loginData.email}
                onChange={handleChange}
                required
                className="border p-2 rounded"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleChange}
                required
                className="border p-2 rounded"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <button
              className="w-full bg-gray-300 hover:bg-gray-400 py-2 rounded-md mt-3"
              onClick={() => setShowLoginModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ✅ Clear Cart Confirmation Modal */}
      {showConfirmModal && (
        <div
          className="fixed inset-0 bg-[#000000cb] flex items-center justify-center z-50 px-4"
          onClick={() => setShowConfirmModal(false)}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4 text-center">
              Clear Cart?
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Are you sure you want to remove all items from your cart?
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-md"
                onClick={() => {
                  clearCart();
                  setShowConfirmModal(false);
                }}
              >
                Yes, Clear
              </button>
              <button
                className="flex-1 bg-gray-300 hover:bg-gray-400 py-2 rounded-md"
                onClick={() => setShowConfirmModal(false)}
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
