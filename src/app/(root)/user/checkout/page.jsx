"use client";
import React, { useEffect, useState } from "react";
import { BsShieldLockFill } from "react-icons/bs";
import Image from "next/image";
import bkash from "@/media/bkash.png";
import nagad from "@/media/nagad.png";
import card from "@/media/card.png";
import wallet from "@/media/wallet.png";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCart() {
      try {
        const res = await fetch("/api/cart-items", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        setCart(data.cart || []);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCart();
  }, []);

  const subtotal =cart.reduce((sum, item) => {
        const price =
          item?.productDetails?.variants?.options[0]?.offer?.offerPrice ||
          item?.productDetails?.variants?.options[0]?.regularPrice;
        return sum + price * item.quantity;
      }, 0)
    console.log("subtotal", subtotal)

  const shipping = subtotal > 55 ? 0 : 5;
  const total = subtotal + shipping;

  if (loading) return <p className="p-10">Loading checkout...</p>;

  return (
    <div className="w-full py-12">
      <div className="w-8/10 mx-auto">
        <div className="w-full grid grid-cols-3 rounded-2xl overflow-hidden bg-[#c9c9c9]">
          
          {/* LEFT SIDE (Address + Totals) */}
          <div className="bg-[#454955] col-span-1 p-5">
            <h2 className="text-2xl pt-5 font-semibold mb-6 text-[#fff]">
              Delivery Address
            </h2>
            {/* address inputs */}
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Division" className="border border-red-300 rounded py-1 px-2 outline-none text-white focus:border-red-400"/>
                <input type="text" placeholder="District" className="border border-red-300 rounded py-1 px-2 outline-none text-white focus:border-red-400"/>
                <input type="text" placeholder="Police Station" className="border border-red-300 rounded py-1 px-2 outline-none text-white focus:border-red-400"/>
                <input type="text" placeholder="Postal Code" className="border border-red-300 rounded py-1 px-2 outline-none text-white focus:border-red-400"/>
              </div>
              <input type="text" placeholder="Phone Number" className="border border-red-300 rounded py-1 px-2 outline-none text-white focus:border-red-400"/>
            </div>

            {/* totals */}
            <div className="border-t border-gray-400 my-4"></div>
            <div className="text-sm mb-4">
              <div className="flex justify-between">
                <p>Items</p>
                <p>EUR {subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>Shipping</p>
                <p>EUR {shipping.toFixed(2)}</p>
              </div>
              <div className="flex justify-between font-bold text-red-400 mt-2">
                <p>TOTAL</p>
                <p>EUR {total.toFixed(2)}</p>
              </div>
            </div>
            <p className="text-red-400 mt-4 cursor-pointer">Cancel and return</p>
          </div>

          {/* RIGHT SIDE (Payment) */}
          <div className="col-span-2 p-10">
            <h2 className="text-gray-700 font-medium mb-4 text-2xl">
              Choose a payment method
            </h2>
            {/* payment methods */}
            <div className="grid grid-cols-4 gap-5 mb-6">
              <button className="border p-2 rounded-md flex flex-col items-center cursor-pointer">
                <Image src={bkash} alt="Bkash" className="w-5 object-contain" />
                <p className="text-sm font-semibold text-[#48494e] mt-1">Bkash</p>
              </button>
              <button className="border p-2 rounded-md flex flex-col items-center cursor-pointer">
                <Image src={nagad} alt="nagad" className="w-5 object-contain" />
                <p className="text-xs font-semibold text-[#48494e] mt-1">nagad</p>
              </button>
              <button className="border-2 border-red-400 p-2 rounded-md flex flex-col items-center text-center cursor-pointer">
                <Image src={card} alt="card" className="w-5 object-contain" />
                <p className="text-xs font-semibold text-[#48494e] mt-1">Credit Card</p>
              </button>
              <button className="border p-2 rounded-md flex flex-col items-center text-center cursor-pointer">
                <Image src={wallet} alt="wallet" className="w-5 object-contain" />
                <p className="text-xs font-semibold text-[#48494e] mt-1">Cash On Delivery</p>
              </button>
            </div>

            {/* payment form */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              <input type="text" placeholder="5248" className="border-b px-2 py-1 col-span-1"/>
              <input type="text" placeholder="0216" className="border-b px-2 py-1 col-span-1"/>
              <input type="text" placeholder="9274" className="border-b px-2 py-1 col-span-1"/>
              <input type="text" placeholder="8472" className="border-b px-2 py-1 col-span-1"/>
            </div>
            <div className="flex gap-4 mb-4">
              <input type="text" placeholder="05/2028" className="border-b px-2 py-1 w-1/2"/>
              <input type="password" placeholder="•••" className="border-b px-2 py-1 w-1/2"/>
            </div>
            <div className="mb-4">
              <input type="text" placeholder="A. Lovela" className="border-b px-2 py-1 w-full"/>
            </div>

            {/* secure note */}
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <BsShieldLockFill className="text-lg mr-2 text-red-500" />
              Secure Card Payment - We use the power of Odin to protect data.
            </div>

            <button className="w-full bg-red-400 hover:bg-red-500 text-white py-3 rounded-md font-semibold transition">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
