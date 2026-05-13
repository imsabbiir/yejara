"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "../Cards/Card";

export function ProductsList() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
  });

  const [loading, setLoading] = useState(true);

  const currentPage = pagination.page;

  // FETCH PRODUCTS
  const getProducts = async (page = 1) => {
    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/products?page=${page}&limit=12`,
      );

      const data = await res.json();

      setProducts(data.products || []);

      setPagination(data.pagination);
    } catch (error) {
      console.error("Fetch products error:", error);
    } finally {
      setLoading(false);
    }
  };

  // INITIAL LOAD
  useEffect(() => {
    getProducts(1);
  }, []);

  // PAGE CHANGE
  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.pages || page === currentPage) return;
    z;

    getProducts(page);

    document.getElementById("shop")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section id="shop" className="container mx-auto px-6 py-12">
      {/* HEADER */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs tracking-[0.3em] text-[#6A6154]">FOR YOU</p>

          <h2 className="mt-2 font-fraunces text-4xl md:text-5xl">
            All <span className="italic text-[#F2565E]">products</span>
          </h2>
        </div>

        <div className="hidden text-sm text-[#6A6154] md:block">
          {pagination.total} Products
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="aspect-[0.75] animate-pulse rounded-3xl bg-[#F1E7CE]"
            />
          ))}
        </div>
      ) : (
        <>
          {/* PRODUCTS */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
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

          {/* PAGINATION */}
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </section>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  const generatePages = () => {
    const pages = [];

    // SHOW MAX 5 PAGE BUTTONS
    let start = Math.max(currentPage - 2, 1);
    let end = Math.min(start + 4, totalPages);

    // FIX END RANGE
    if (end - start < 4) {
      start = Math.max(end - 4, 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pages = generatePages();

  return (
    <nav
      className="mt-12 flex items-center justify-center gap-2 flex-wrap"
      aria-label="Pagination"
    >
      {/* PREV */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="grid size-10 place-items-center rounded-full bg-[#F8F1E1] transition hover:bg-[#F1E7CE] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="size-4" />
      </button>

      {/* FIRST PAGE */}
      {pages[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="size-10 rounded-full bg-[#F8F1E1] text-sm hover:bg-[#F1E7CE]"
          >
            1
          </button>

          {pages[0] > 2 && <span className="px-1 text-[#6A6154]">...</span>}
        </>
      )}

      {/* PAGE BUTTONS */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`size-10 rounded-full text-sm transition ${
            currentPage === page
              ? "bg-[#F19268] text-[#2A1812] font-semibold shadow-md"
              : "bg-[#F8F1E1] hover:bg-[#F1E7CE]"
          }`}
        >
          {page}
        </button>
      ))}

      {/* LAST PAGE */}
      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="px-1 text-[#6A6154]">...</span>
          )}

          <button
            onClick={() => onPageChange(totalPages)}
            className="size-10 rounded-full bg-[#F8F1E1] text-sm hover:bg-[#F1E7CE]"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* NEXT */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="grid size-10 place-items-center rounded-full bg-[#231D18] text-[#FCF7EB] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
