"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const discounts = [
  { code: "a45c7e", discount: 20 },
  { code: "bz78wx", discount: 25 },
  { code: "hg569a", discount: 10 },
];

function CartPage() {
  const [cart, setCart] = useState([]);
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchCartItems = async () => {
      const res = await fetch("/api/cart-items");
      const data = await res.json();
      setCart(Array.isArray(data) ? data : []);
    };
    fetchCartItems();
  }, []);

  console.log("Cart Items form front end:", cart);

  const handleCheckout = () => {
    router.push("/user/checkout");
  };

  const updateQty = async (id, delta) => {
    // Find current quantity
    const item = cart.find((item) => item._id === id);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + delta);

    try {
      const res = await fetch("/api/cart-items", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, quantity: newQuantity }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update quantity");
      }

      const updatedItem = await res.json();

      // Update state locally with new quantity from server response
      setCart((prev) =>
        prev.map((cartItem) =>
          cartItem._id === id
            ? { ...cartItem, quantity: updatedItem.quantity }
            : cartItem
        )
      );
    } catch (error) {
      console.error("Update quantity error:", error.message);
    }
  };

  const removeItem = async (id) => {
    try {
      const res = await fetch(`/api/cart-items?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to remove item");
      }

      setCart((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Remove item error:", error.message);
    }
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
    setDiscount(0); // Clear discount if promo code is edited
  }, [promo]);

  const subtotal = Array.isArray(cart)
    ? cart.reduce((sum, item) => {
        const price =
          item?.productDetails?.variants?.options[0]?.offer?.offerPrice ||
          item?.productDetails?.variants?.options[0]?.regularPrice;
        return sum + price * item.quantity;
      }, 0)
    : 0;

  const shipping = subtotal > 55 ? 0 : 5;
  const totalBeforeDiscount = subtotal + shipping;
  const total = totalBeforeDiscount * (1 - discount / 100);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-20">
      <div className="bg-white shadow rounded-lg p-6 grid md:grid-cols-3 gap-10">
        {/* Cart Section */}
        <div className="md:col-span-2">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold mb-4">Shopping Cart</h2>
            <h2 className="text-xl font-semibold mb-4">{cart.length} Items</h2>
          </div>

          {cart.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              Your cart is empty.
            </div>
          ) : (
            <div className="overflow-x-auto mt-6">
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
                  {Array.isArray(cart) &&
                    cart.map((item) => {
                      const price =
                        Number(
                          item?.productDetails?.variants?.options[0]?.offer
                            ?.offerPrice ??
                            item?.productDetails?.variants?.options[0]
                              ?.regularPrice
                        ) || 0;

                      return (
                        <tr key={item._id}>
                          <td className="flex items-center gap-3 px-4 py-2">
                            <Image
                              src={item?.productDetails?.images[0]}
                              alt={item?.productDetails?.productName}
                              width={64}
                              height={64}
                              className="object-cover rounded"
                            />
                            <div>
                              <p className="font-medium">
                                {item?.productDetails?.productName}
                              </p>
                              <p className="text-sm text-red-500">
                                {item?.productDetails?.category}
                              </p>
                              <button
                                onClick={() => removeItem(item._id)}
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
                                onClick={() => updateQty(item._id, -1)}
                              >
                                −
                              </button>
                              <span className="mx-2">{item.quantity}</span>
                              <button
                                className="bg-gray-200 px-2 rounded"
                                onClick={() => updateQty(item._id, 1)}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td>
                            <p className="text-sm">${price.toFixed(2)}</p>
                          </td>
                          <td>
                            <p className="font-semibold">
                              ${(price * item.quantity).toFixed(2)}
                            </p>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}

          <Link
            href="/"
            className="text-sm text-blue-600 mt-4 inline-block hover:underline"
          >
            ← Continue Shopping
          </Link>
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
        </div>
      </div>
    </div>
  );
}

export default CartPage;
