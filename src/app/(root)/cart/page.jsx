"use client";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity } = useCart();

  const updateQty = (productId, delta) => {
    const item = cart.find((i) => i.productId === productId);
    if (!item) return;
    updateCartQuantity(productId, Math.max(1, item.quantity + delta));
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
    <main className="max-w-300 mx-auto px-6 pt-36 pb-16">
      <h1 className="font-fraunces text-4xl md:text-5xl mb-10">Your bag</h1>

      {cart.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[#dfd6cb] rounded-4xl bg-white/40">
          <ShoppingBag className="w-10 h-10 mx-auto text-[#ff5b4e] mb-4" />
          <p className="text-[#5e534a] mb-6">Your bag is empty.</p>
          <Link
            href="/"
            className="inline-block bg-[#17100b] text-[#fcf6e9] rounded-full px-6 py-3 text-sm transition-colors hover:bg-[#ff5b4e]"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-[#dfd6cb]/40"
              >
                <Link
                  href={`/product/${item.productId}`}
                  className="relative overflow-hidden w-24 h-32 rounded-xl shrink-0 bg-[#f9f1e5]"
                >
                  <Image
                    src={item.productImage}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </Link>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex justify-between gap-3 items-start">
                    <div className="flex flex-col gap-0.5">
                      <Link
                        href={`/subcategory/${item.subCategorySlug}`}
                        className="text-[10px] font-mono uppercase tracking-wider text-[#5e534a]"
                      >
                        {item.subCategory}
                      </Link>
                      <Link
                        href={`/product/${item.productId}`}
                        className="font-medium hover:text-[#ff5b4e] text-sm md:text-base line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <div className="flex gap-2 items-center mt-1.5">
                        {item.selectedColor?.hex && (
                          <div
                            className="w-4 h-4 rounded-full border border-[#dfd6cb]"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                        )}
                        {item.selectedOption?.type && (
                          <span className="text-[10px] text-[#5e534a] font-medium bg-[#fcf6e9] px-2 py-0.5 rounded border border-[#dfd6cb]/60">
                            {item.selectedOption.type}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      aria-label="Remove item"
                      className="text-[#5e534a] hover:text-[#ff5b4e] p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-[#dfd6cb] rounded-full bg-white">
                      <button
                        onClick={() => updateQty(item.productId, -1)}
                        className="p-2 hover:text-[#ff5b4e] transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.productId, 1)}
                        className="p-2 hover:text-[#ff5b4e] transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="font-fraunces font-semibold text-base">
                      ৳ {item.quantity * (item.offerPrice || item.regularPrice)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="bg-[#17100b] text-[#fcf6e9] rounded-4xl p-8 h-fit lg:sticky lg:top-32">
            <h2 className="font-fraunces text-2xl mb-6">Summary</h2>
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between">
                <span className="text-[#fcf6e9]/70">Subtotal</span>
                <span className="font-medium">৳ {Math.floor(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#fcf6e9]/70">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? "Free" : `৳ ${Math.floor(shipping)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#fcf6e9]/70">Tax</span>
                <span className="font-medium">৳ {Math.floor(tax)}</span>
              </div>
              <div className="border-t border-[#fcf6e9]/20 pt-4 mt-4 flex justify-between font-fraunces text-xl">
                <span>Total</span>
                <span className="text-[#ff5b4e] font-bold">
                  ৳ {Math.floor(total)}
                </span>
              </div>
            </div>
            <Link
              href="/user/checkout"
              className="block text-center mt-6 bg-[#ff5b4e] text-[#fcf6e9] rounded-full py-3.5 text-sm font-medium hover:bg-[#fcf6e9] hover:text-[#17100b] transition-colors shadow-md"
            >
              Checkout
            </Link>
            <Link
              href="/"
              className="block text-center mt-4 text-[#fcf6e9]/60 text-xs uppercase tracking-widest hover:text-[#fcf6e9] transition-colors"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}
