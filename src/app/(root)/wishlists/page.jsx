"use client";

import React from "react";
import ProductVACard from "@/Components/Cards/ProductVACard";
import { useWishlist } from "@/context/WishlistContext";

function WishlistPage() {
  const { wishlist } = useWishlist();

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8 text-center">My Wishlist</h1>

      {wishlist.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div
              key={product.productId}
              className="border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <ProductVACard
                productId={product.productId}
                productImage={product.productImage}
                category={product.category}
                ratting={product.ratting || 0}
                name={product.name}
                regularPrice={product.regularPrice}
                offerPrice={product.offerPrice}
                categorySlug={product.categorySlug}
                subCategorySlug={product.subCategorySlug}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;
