"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  ChevronRight,
  FastForward,
  Package,
  Trash2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

// Config Data
const ORDER_STATUSES = [
  "Placed",
  "Processing",
  "Shipped",
  "Out For Delivery",
  "Delivered",
];

const STATUS_COLORS = {
  Placed: "bg-[#f2eadd] text-[#17100b]",
  Processing: "bg-[#8047e1]/20 text-[#17100b]",
  Shipped: "bg-[#d5e43f]/40 text-[#17100b]",
  "Out For Delivery": "bg-[#ff5b4e]/20 text-[#17100b]",
  Delivered: "bg-[#17100b] text-[#f2eadd]",
  Cancelled: "bg-[#ee0f1f]/15 text-[#ee0f1f]",
};

// ==========================================
// SUB-COMPONENTS
// ==========================================
function CancelModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full mx-4 shadow-xl border border-[#dfd6cb]">
        <h3 className="font-fraunces text-xl mb-2">Cancel Order?</h3>
        <p className="text-sm text-[#5e534a] mb-6">
          Are you sure you want to cancel this order? This action cannot be
          undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs rounded-full border border-[#dfd6cb]"
          >
            No, Keep It
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-xs rounded-full bg-[#ee0f1f] text-white"
          >
            Yes, Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
}

function Tracker({ status }) {
  if (status === "Cancelled") {
    return (
      <div className="rounded-2xl bg-[#ee0f1f]/10 text-[#ee0f1f] px-4 py-3 text-sm font-medium flex items-center gap-2">
        <X className="w-4 h-4" /> Order cancelled
      </div>
    );
  }
  const idx = ORDER_STATUSES.findIndex(
    (s) => s.toLowerCase() === status.toLowerCase(),
  );
  return (
    <div className="flex items-center gap-2">
      {ORDER_STATUSES.map((s, i) => {
        const done = i <= idx;
        const current = i === idx;
        return (
          <div key={s} className="flex-1 flex items-center gap-2 min-w-0">
            <div className="flex-1">
              <div
                className={`h-2 rounded-full transition ${done ? "bg-[#ff5b4e]" : "bg-[#f2eadd]"}`}
              />
              <p
                className={`mt-2 text-[10px] font-mono uppercase tracking-widest truncate ${current ? "text-coral font-semibold" : done ? "text-foreground" : "text-[#5e534a]"}`}
              >
                {done && !current && (
                  <Check className="inline w-3 h-3 mr-0.5" />
                )}{" "}
                {s}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function OrderHistoryPage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState({
    isOpen: false,
    orderId: null,
  });

  // 1. Fetch User Profile
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

  // 2. Fetch Orders Based on Profile User Account
  useEffect(() => {
    if (!user?._id) return;
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/orders/user/${user._id}`);
        const data = await res.json();
        if (res.ok) {
          const formatted = data.orders.map((order) => ({
            ...order,
            items: order.items.map((item) => ({
              ...item,
              image: item.image,
              title: item.name,
              quantity: item.qty,
            })),
          }));
          setOrders(formatted);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  // Workflow Handlers
  const getButtonLabel = (status) =>
    status === "Delivered Confirm" ? "Completed" : "Move to Next Step";

  const getNextStatus = (currentStatus) => {
    const index = ORDER_STATUSES.findIndex(
      (s) => s.toLowerCase() === currentStatus?.toLowerCase(),
    );
    if (index === -1 || index === ORDER_STATUSES.length - 1)
      return currentStatus;
    return ORDER_STATUSES[index + 1];
  };

  const handleNextStatus = async (orderId, currentStatus) => {
    const nextStatus = getNextStatus(currentStatus);
    try {
      const res = await fetch(`/api/orders/order/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setOrders((prev) =>
        prev.map((order) =>
          order._id !== orderId
            ? order
            : {
                ...order,
                orderStatus: nextStatus,
                statusHistory: [
                  ...(order.statusHistory || []),
                  { status: nextStatus, date: new Date().toISOString() },
                ],
              },
        ),
      );
      toast.success(`Status updated to ${nextStatus}`);
    } catch (error) {
      toast.error(error.message || "Update failed");
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      const res = await fetch(`/api/orders/order/${orderId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setOrders((prev) => prev.filter((order) => order._id !== orderId));
      toast.success("Order history cleared");
    } catch (error) {
      toast.error(error.message || "Delete failed");
    }
  };

  // Safe Cancel Request Trigger Interceptor
  const handleCancelClick = (orderId, currentStatus) => {
    if (currentStatus === "Shipped" || currentStatus === "Out For Delivery") {
      toast.error(
        "Cannot cancel right now. You can cancel after accepting your delivery.",
      );
      return;
    }
    setModalState({ isOpen: true, orderId });
  };

  const confirmCancelOrder = async () => {
    const { orderId } = modalState;
    setModalState({ isOpen: false, orderId: null });
    try {
      const res = await fetch(`/api/orders/order/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: "Cancelled" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setOrders((prev) =>
        prev.map((order) =>
          order._id !== orderId
            ? order
            : {
                ...order,
                orderStatus: "Cancelled",
                statusHistory: [
                  ...(order.statusHistory || []),
                  { status: "Cancelled", date: new Date().toISOString() },
                ],
              },
        ),
      );
      toast.success("Order cancelled successfully");
    } catch (error) {
      toast.error(error.message || "Cancellation failed");
    }
  };

  if (loading)
    return (
      <div className="px-6 py-12 text-center text-sm font-mono">
        Loading your story...
      </div>
    );

  return (
    <div className="px-6 py-12">
      <div className="mb-10 flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#ff5b4e] mb-2">
            Order history
          </p>
          <h1 className="font-fraunces text-5xl">Your orders</h1>
        </div>
        <p className="text-xs text-[#5e534a] font-mono">
          You can cancel orders before shipping or after final delivery
          processing.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-[#dfd6cb] rounded-3xl">
          <Package className="w-12 h-12 mx-auto text-[#ff5b4e] mb-4" />
          <p className="text-[#5e534a] mb-6">
            No orders yet — your story starts here.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#17100b] text-[#d9d3c7] rounded-full px-6 py-3 text-sm"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          {orders.map((order) => {
            const isFinished =
              order.orderStatus === "Delivered" ||
              order.orderStatus === "Cancelled";
            return (
              <div
                key={order._id}
                className="bg-white rounded-3xl p-7 shadow-soft border border-[#ff5b4e]/30"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-5 pb-5 border-b border-[#dfd6cb]">
                  <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-[#5e534a]">
                      ORD-{order._id}
                    </p>
                    <p className="text-xs text-[#5e534a] mt-1">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        dateStyle: "long",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full ${STATUS_COLORS[order?.orderStatus]}`}
                    >
                      {order?.orderStatus}
                    </span>
                    <span className="font-fraunces text-xl font-semibold">
                      ৳ {Math.floor(order?.totalAmount)}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <Tracker status={order.orderStatus} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    {order.items.map((item) => (
                      <Link
                        key={item?._id}
                        href={`/product/${item?.productId}`}
                        className="flex gap-3 items-center hover:opacity-70"
                      >
                        <Image
                          src={item?.image}
                          alt={item?.title}
                          width={80}
                          height={100}
                          className="w-14 h-16 object-cover bg-red-300 rounded-lg shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {item.title}
                          </p>
                          <p className="text-xs text-[#5e534a] flex gap-7">
                            <span>Qty {item.quantity}</span>
                            <span>৳ {item.price * item.quantity}</span>
                          </p>
                          <div className="flex gap-5">
                            {item.color && (
                              <div className="flex items-center gap-2 h-10">
                                <h2>Color: </h2>
                                <h3
                                  className="w-5 h-5 rounded border-2 border-[#8047e1]"
                                  style={{ backgroundColor: `${item.color}` }}
                                ></h3>
                              </div>
                            )}
                            {item.type && (
                              <div className="flex items-center gap-2 h-10">
                                <h2>Type: </h2>
                                <h3>{item.type}</h3>
                              </div>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#5e534a]" />
                      </Link>
                    ))}
                  </div>

                  <div className="text-sm">
                    <p className="text-xs font-mono uppercase tracking-widest text-foreground mb-2">
                      Shipping to
                    </p>
                    <p>{order.shipping.name}</p>
                    <p className="text-[#5e534a]">
                      {order.shipping.address}, {order.shipping.zip}
                    </p>
                    <div className="mt-5">
                      <p className="text-xs font-mono uppercase tracking-widest mb-2">
                        Timeline
                      </p>
                      <div className="space-y-2">
                        {order.statusHistory?.map((item, i) => (
                          <div
                            key={i}
                            className="text-xs flex justify-between pb-1"
                          >
                            <span>{item.status}</span>
                            <span className="text-[#5e534a]">
                              {new Date(item.date).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-[#dfd6cb] flex flex-wrap gap-2">
                  {!isFinished && (
                    <button
                      onClick={() =>
                        handleNextStatus(order._id, order.orderStatus)
                      }
                      className="inline-flex items-center gap-2 bg-[#17100b] text-[#d9d3c7] rounded-full px-4 py-2 text-xs"
                    >
                      <FastForward className="w-3.5 h-3.5" />{" "}
                      {getButtonLabel(order.orderStatus)}
                    </button>
                  )}
                  {isFinished ? (
                    <button
                      onClick={() => deleteOrder(order._id)}
                      className="inline-flex items-center gap-2 text-[#ee0f1f] border border-[#ee0f1f]/30 rounded-full px-4 py-2 text-xs hover:bg-[#ee0f1f]/10 ml-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        handleCancelClick(order._id, order.orderStatus)
                      }
                      className="inline-flex items-center gap-2 border border-[#dfd6cb] rounded-full px-4 py-2 text-xs hover:bg-[#f2eadd] ml-auto"
                    >
                      <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CancelModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, orderId: null })}
        onConfirm={confirmCancelOrder}
      />
    </div>
  );
}
