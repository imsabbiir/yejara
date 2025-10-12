"use client";
import React, { useState, useEffect } from "react";
import ProductVACard from "../Cards/ProductVACard";
import MyPagination from "../MyPagination";

export default function ProductList({ filters }) {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (pageNum = 1) => {
    try {
      setLoading(true);

      // Build query string
      const params = new URLSearchParams({
        page: pageNum,
        limit: 8,
        category: filters?.category || "",
        subcategory: filters?.subcategory || "",
        priceMin: filters?.priceMin || "",
        priceMax: filters?.priceMax || "",
      });

      const res = await fetch(`/api/products?${params.toString()}`, { cache: "no-store" });
      const data = await res.json();

      setProducts(data.products);
      setTotalPages(data.pagination.pages);
    } catch (err) {
      console.error("Fetch products error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1); // reset to first page when filters change
  }, [filters]);

  useEffect(() => {
    fetchProducts(page);
  }, [page, filters]);

  return (
    <div className="mt-10">
      {/* Product Grid */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-7">
        {products?.map((product) => (
          <ProductVACard
            key={product._id}
            productId={product._id}
            productImage={product.images[0]}
            category={product.category}
            ratting={product.rating}
            name={product.productName}
            regularPrice={product.variants.options[0].regularPrice}
            offerPrice={product.variants.options[0].offer?.offerPrice}
            categorySlug={product.categorySlug}
            subCategorySlug={product.subCategorySlug}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center my-16 gap-2 flex-wrap">
        <MyPagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </div>
  );
}
