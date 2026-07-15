"use client";

import React, { useEffect, useState } from "react";
import { Card } from "../Cards/Card";

export default function RelatedProducts({ productId }) {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getRelatedProducts = async () => {
      if (!productId) return;

      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/related/${productId}`,
          { cache: "no-store" },
        );

        if (!res.ok) {
          throw new Error("Failed to fetch related products");
        }

        const data = await res.json();
        setRelatedProducts(data);
      } catch (err) {
        console.error("Related products fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getRelatedProducts();
  }, [productId]); // Dependency array ensures it only runs when productId changes

  if (loading)
    return (
      <div className="mt-6 text-sm font-mono">Loading related items...</div>
    );
  if (error) return null; // Or show a small error message
  if (relatedProducts.length === 0) return null;

  return (
    <div className="mt-20">
      <h2 className="text-5xl font-fraunces text-[#17100b]">
        You may also like
      </h2>
      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        {relatedProducts.map((product) => (
          <Card
            key={product._id}
            productId={product._id}
            name={product.productName}
            subCategory={product.subCategory}
            productImages={product.images}
            variants={product.variants}
            subCategorySlug={product.subCategorySlug}
          />
        ))}
      </div>
    </div>
  );
}
