"use client";
import {
  Check,
  ChevronRight,
  FastForward,
  Package,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function page() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const OrderStatus = [
    "Placed",
    "Processing",
    "Shipped",
    "Out for delivery",
    "Delivered",
    "Cancelled",
  ];
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

  console.log("user orders", orders);

  const statusColor = {
    Placed: "bg-[#f2eadd] text-[#17100b]",
    Processing: "bg-[#8047e1]/20 text-[#17100b]",
    Shipped: "bg-[#d5e43f]/40 text-[#17100b]",
    "Out for delivery": "bg-[#ff5b4e]/20 text-[#17100b]",
    Delivered: "bg-[#17100b] text-[#f2eadd]",
    Cancelled: "bg-[#ee0f1f]/15 text-[#ee0f1f]",
  };
  function Tracker({ status }) {
    if (status === "Cancelled") {
      return (
        <div className="rounded-2xl bg-destructive/10 text-destructive px-4 py-3 text-sm font-medium flex items-center gap-2">
          <X className="w-4 h-4" /> Order cancelled
        </div>
      );
    }
    const idx = OrderStatus.indexOf(status);
    return (
      <div className="flex items-center gap-2">
        {OrderStatus.map((s, i) => {
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
                  )}
                  {s}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  return (
    <div className="max-w-[1100px] mx-auto px-6 py-12">
      <div className="mb-10 flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#ff5b4e] mb-2">
            Order history
          </p>
          <h1 className="font-fraunces text-5xl">Your orders</h1>
        </div>
        <p className="text-xs text-[#5e534a] font-mono">
          You can cancle your order before the product give to the shipping
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
        <div>
          {orders.map((order) => {
            const canAdvance =
              order.status !== "Delivered" && order.status !== "Cancelled";
            return (
              <div
                key={order._id}
                className={`bg-white rounded-3xl p-7 shadow-soft border border-[#ff5b4e]/30`}
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
                      className={`text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full ${statusColor[order?.status]} `}
                    >
                      {order?.status}
                    </span>
                    <span className="font-fraunces text-xl font-semibold">
                      ${Math.floor(order?.totalAmount)}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <Tracker status={order.status} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    {order.items.map((item) => {
                      return (
                        <Link
                          key={item?._id}
                          href={`/product/${item?.productId}`}
                          className="flex gap-3 items-center hover:opacity-70"
                        >
                          <Image
                            src={item?.image}
                            alt={item?.title}
                            width={2500}
                            height={2500}
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
                            {/* {item.size ? ` · ${item.size}` : ""} ·
                              {item.size ? ` · ${item.size}` : ""} ·  */}
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#5e534a]" />
                        </Link>
                      );
                    })}
                  </div>
                  <div className="text-sm">
                    <p className="text-xs font-mono uppercase tracking-widest text-foreground mb-2">
                      Shipping to
                    </p>
                    <p>{order.userId}</p>
                    <p className="text-[#5e534a]">
                      {order.address?.village} | {order.address?.district} |{" "}
                      {order.address?.policeStation} |{" "}
                      {order.address?.postalCode}
                    </p>

                    <p className="text-xs font-mono uppercase tracking-widest text-foreground mt-5 mb-2">
                      Timeline
                    </p>
                    <p className="text-sm">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        dateStyle: "long",
                      })}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-[#dfd6cb] flex flex-wrap gap-2">
                  {canAdvance && (
                    <button className="inline-flex items-center gap-2 bg-[#17100b] text-[#d9d3c7] rounded-full px-4 py-2 text-xs">
                      <FastForward className="w-3.5 h-3.5" /> Advance status
                    </button>
                  )}
                  <button className="inline-flex items-center gap-2 border border-[#dfd6cb] rounded-full px-4 py-2 text-xs hover:bg-[#f2eadd]">
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>

                  <button className="inline-flex items-center gap-2 text-[#ee0f1f] border border-[#ee0f1f]/30 rounded-full px-4 py-2 text-xs hover:bg-[#ee0f1f]/10 ml-auto">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default page;
