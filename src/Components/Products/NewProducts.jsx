"use client";
import React, { useEffect, useState } from "react";
import Pagination from "@/Components/Pagination";
import ProductVACard from "../Cards/ProductVACard";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProducts = async (currentPage) => {
    const res = await fetch(`/api/products?page=${currentPage}&limit=20`);
    const data = await res.json();
    setProducts(data.products);
    setTotalPages(data.totalPages);
    setCurrentPage(data.currentPage)
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  return (
    <div className="mt-10">
      <h2 className="uppercase text-[#454545] font-semibold tracking-wider border-b border-[#9f9f9f] pb-2">
        New Products
      </h2>
      <div className="mt-5 grid grid-cols-4 gap-7">
        {products?.map((product) => {
          return (
            <ProductVACard
              key={product?._id}
              productId={product?._id}
              productImage={product.images[0]}
              category={product?.category}
              ratting={product?.ratting}
              name={product?.productName}
              regularPrice={product?.variants?.options[0]?.regularPrice}
              offerPrice={product?.variants?.options[0]?.offer?.offerPrice}
              categorySlug={product?.categorySlug}
              subCategorySlug={product?.subCategorySlug}
            />
          );
        })}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={fetchProducts}
      />
    </div>
  );
}
