"use client";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

export default function page() {
  const { cart, removeFromCart, updateCartQuantity } = useCart();

  const updateQty = (productId, delta) => {
    const item = cart.find((i) => i.productId === productId);
    if (!item) return;
    const newQty = Math.max(1, item.quantity + delta);
    updateCartQuantity(productId, newQty);
  };

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

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      <h1 className="font-fraunces text-5xl mb-10">Your bag</h1>

      {cart.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-[#dfd6cb] rounded-3xl">
          <ShoppingBag className="w-12 h-12 mx-auto text-[#ff5b4e] mb-4" />
          <p className="text-[#5e534a] mb-6">Your bag is empty.</p>
          <Link
            href="/"
            className="inline-block bg-[#17100b] text-[#fcf6e9] rounded-full px-6 py-3 text-sm"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              return (
                <div
                  key={item.productId}
                  className="flex gap-4 p-4 bg-white rounded-2xl shadow-soft"
                >
                  <Link
                    href={`/product/${item.productId}`}
                    className="relative overflow-hidden w-24 h-32 rounded-xl shrink-0"
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
                    <div className="flex justify-between gap-3 items-start">
                      <div className="flex flex-col">
                        <Link
                          href={`/subcategory/${item.subCategorySlug}`}
                          className="text-xs font-mono uppercase text-[#5e534a]"
                        >
                          {item.subCategory}
                        </Link>
                        <Link
                          href={`/product/${item.productId}`}
                          className="font-medium hover:text-[#ff5b4e]"
                        >
                          {item.name}
                        </Link>
                        <div className="flex gap-3 items-center">
                          <div
                            className={`w-5 h-5 rounded-full border border-[#ff5b4e]`}
                            style={{
                              backgroundColor: `${item.selectedColor?.hex}`,
                            }}
                          ></div>
                          <span className="text-xs text-[#5e534a] mt-1 bg-[#dfd6cb] px-3 py-1.5 rounded">
                            {item.selectedOption?.type}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        aria-label="Remove"
                        className="text-[#5e534a] hover:text-[#ff5b4e] cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-[#dfd6cb] rounded-full">
                        <button
                          onClick={() => updateQty(item.productId, -1)}
                          className="p-2 hover:text-[#ff5b4e]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.productId, 1)}
                          className="p-2 hover:text-[#ff5b4e]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="font-fraunces font-semibold">
                        ৳{" "}
                        {item.quantity * (item.offerPrice || item.regularPrice)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <aside className="bg-[#17100b] text-[#fcf6e9] rounded-3xl p-8 h-fit sticky top-6">
            <h2 className="font-fraunces text-2xl mb-6">Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#fcf6e9]/70">Subtotal</span>
                <span>৳ {Math.floor(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#fcf6e9]/70">Shipping</span>
                <span>
                  {shipping === 0 ? "Free" : `৳ ${Math.floor(shipping)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#fcf6e9]/70">Tax</span>
                <span>৳ {Math.floor(tax)}</span>
              </div>
              <div className="border-t border-[#fcf6e9]/20 pt-3 mt-3 flex justify-between font- text-xl">
                <span>Total</span>
                <span>৳ {Math.floor(total)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="block text-center mt-6 bg-[#ff5b4e] text-[#fcf6e9] rounded-full py-3.5 text-sm font-medium hover:bg-[#fcf6e9] hover:text-ink transition-colors"
            >
              Checkout
            </Link>
            <Link
              href="/"
              className="block text-center mt-3 text-[#fcf6e9]/70 text-xs uppercase tracking-widest hover:text-[#fcf6e9]"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
