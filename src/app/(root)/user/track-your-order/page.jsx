"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaBoxOpen,
  FaCheckCircle,
  FaShippingFast,
  FaTruck,
} from "react-icons/fa";
import Image from "next/image";

export default function TrackOrderPage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();
        if (res.ok && data.user) {
          setUser(data.user);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);

  // 🔹 Fetch orders after user is loaded
  useEffect(() => {
    if (!user?._id) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/orders/${user._id}`);
        const data = await res.json();
        if (res.ok) {
          const formattedOrders = data.orders.map((order) => ({
            ...order,
            items: order.items.map((item) => ({
              ...item,
              // Use image field from API, fallback to placeholder
              image: item.image || "/placeholder.png",
              // Use title from API or fallback
              title: item.title || "Product Name",
            })),
          }));
          setOrders(formattedOrders);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusSteps = (status) => {
    const steps = ["pending", "confirmed", "shipped", "delivered"];
    const currentIndex = steps.indexOf(status);
    return steps.map((step, index) => ({
      label: step.charAt(0).toUpperCase() + step.slice(1),
      done: index <= currentIndex,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-700 dark:text-gray-200">
        Loading your orders...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <p className="text-lg text-gray-700 dark:text-gray-200 mb-3">
          Please log in to view your orders.
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <p className="text-lg text-gray-700 dark:text-gray-200 mb-3">
          You haven’t placed any orders yet.
        </p>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gray-50 dark:bg-[#191923] p-4 sm:p-6 lg:p-10">
    <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
      Track Your Orders
    </h1>

    <div className="max-w-5xl mx-auto space-y-6">
      {orders.map((order, index) => {
        const steps = getStatusSteps(order.status);
        return (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-[#1e1e28] shadow-lg rounded-2xl p-4 sm:p-6"
          >
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
              <h2 className="font-semibold text-gray-800 dark:text-gray-100 text-sm sm:text-lg break-all">
                Order ID: <span className="font-normal">{order._id}</span>
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${
                  order.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.status === "confirmed"
                    ? "bg-blue-100 text-blue-700"
                    : order.status === "shipped"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {order.status.toUpperCase()}
              </span>
            </div>

            {/* Items */}
            <div className="space-y-3 mb-6">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 border-b border-gray-200 dark:border-gray-700 pb-3"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={70}
                    height={70}
                    className="rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-gray-800 dark:text-gray-100 font-medium text-sm sm:text-base">
                      {item.title}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                      {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-gray-800 dark:text-gray-100 font-semibold text-sm sm:text-base">
                    ${(item.quantity * item.price).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Tracking Steps */}
            <div className="flex flex-wrap justify-between items-center mt-4 sm:mt-6 gap-4">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center w-1/4 sm:w-auto"
                >
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full transition-colors ${
                      step.done
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-300 dark:bg-gray-600 text-gray-400"
                    }`}
                  >
                    {i === 0 && <FaBoxOpen />}
                    {i === 1 && <FaCheckCircle />}
                    {i === 2 && <FaShippingFast />}
                    {i === 3 && <FaTruck />}
                  </div>
                  <p className="text-xs sm:text-sm mt-1 sm:mt-2 text-gray-600 dark:text-gray-300 font-medium text-center">
                    {step.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  </div>
);

}
