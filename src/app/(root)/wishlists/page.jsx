"use client";
import { useWishlist } from "@/context/WishlistContext";
import { Card } from "@/components/Cards/Card";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  return (
    <main className="max-w-300 mx-auto px-6 pt-16 pb-16">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#ff5b4e] mb-2">
            Saved for later
          </p>
          <h1 className="font-fraunces text-4xl md:text-5xl">Your wishlist</h1>
        </div>
        <p className="text-sm text-[#5e534a] font-mono">
          {wishlist.length} {wishlist.length === 1 ? "piece" : "pieces"}
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[#dfd6cb] rounded-4xl bg-white/40">
          <Heart className="w-10 h-10 mx-auto text-[#ff5b4e] mb-4" />
          <p className="text-[#5e534a] mb-6">
            Nothing saved yet — start a collection.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#17100b] text-[#fcf6e9] hover:bg-[#ff5b4e] rounded-full px-6 py-3 text-sm transition-colors"
          >
            Browse the shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((p) => (
            <Card
              key={p.productId}
              productId={p.productId}
              name={p.name}
              subCategory={p.subCategory}
              productImages={p.productImages}
              variants={p.variants}
              categorySlug={p.categorySlug}
              subCategorySlug={p.subCategorySlug}
            />
          ))}
        </div>
      )}
    </main>
  );
}
