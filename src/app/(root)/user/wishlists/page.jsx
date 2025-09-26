"use client";

import React, { useEffect, useState } from "react";
import ProductVACard from "@/Components/Cards/ProductVACard";

function WishlistPage() {
  const [wishlists, setWishlists] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/wishlists");
        const data = await response.json();
        setWishlists(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch wishlist data:", error);
      }
    };
    fetchData();
  }, []);

  const handleWishlistUpdate = (removedProductId) => {
    if (!removedProductId) return;
    setWishlists((prev) =>
      prev.filter((item) => item.productDetails._id !== removedProductId)
    );
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8 text-center">My Wishlist</h1>

      {wishlists.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlists.map((wishitem) => {
            const product = wishitem.productDetails;

            return (
              <div
                key={wishitem._id}
                className="border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <ProductVACard
                  productId={product._id}
                  productImage={product.images[0]}
                  category={product.category}
                  ratting={product.ratting}
                  name={product.productName}
                  regularPrice={product.variants?.options[0]?.regularPrice}
                  offerPrice={product.variants?.options[0]?.offer?.offerPrice}
                  categorySlug={product.categorySlug}
                  subCategorySlug={product.subCategorySlug}
                  onWishlistUpdate={handleWishlistUpdate}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;
