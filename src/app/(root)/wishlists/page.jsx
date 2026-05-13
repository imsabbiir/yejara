"use client";

import React from "react";
import { useWishlist } from "@/context/WishlistContext";
import { Card } from "@/components/Cards/Card";
import { Heart } from "lucide-react";
import Link from "next/link";

function WishlistPage() {
  const { wishlist } = useWishlist();

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#ff5b4e] mb-2">
            Saved for later
          </p>
          <h1 className="font-fraunces text-5xl">Your wishlist</h1>
        </div>
        <p className="text-sm text-[#5e534a]">
          {wishlist.length} {wishlist.length === 1 ? "piece" : "pieces"}
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-[#dfd6cb] rounded-3xl">
          <Heart className="w-12 h-12 mx-auto text-[#ff5b4e] mb-4" />
          <p className="text-[#5e534a] mb-6">
            Nothing saved yet — start a collection.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#17100b] text-[#ff5b4e] rounded-full px-6 py-3 text-sm"
          >
            Browse the shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <Card
              key={product.productId}
              productId={product.productId}
              name={product.name}
              subCategory={product.subCategory}
              productImages={product.productImages}
              variants={product.variants}
              categorySlug={product.categorySlug}
              subCategorySlug={product.subCategorySlug}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;
