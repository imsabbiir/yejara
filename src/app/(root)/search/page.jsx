"use client";

import { SearchIcon } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/Cards/Card";

function Page() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const searchValue = searchParams.get("searchValue") || "";

  const [query, setQuery] = useState(searchValue);

  // sync input when URL changes
  useEffect(() => {
    setQuery(searchValue);
  }, [searchValue]);

  // GET CATEGORIES
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryRes = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`,
          { cache: "no-store" }
        );

        const categoriesData = await categoryRes.json();
        setCategories(categoriesData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // GET PRODUCTS
  useEffect(() => {
    if (!searchValue) {
      setProducts([]);
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `/api/search?searchValue=${encodeURIComponent(searchValue)}`
        );

        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, [searchValue]);

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#ff5b4e] mb-2">
        Universe search
      </p>

      <h1 className="font-fraunces text-5xl mb-8">Find your thing</h1>

      {/* SEARCH FORM */}
      <form
        onSubmit={(e) => {
          e.preventDefault();

          const value = query.trim();

          if (!value) return;

          router.push(`/search?searchValue=${encodeURIComponent(value)}`);
        }}
        className="relative max-w-2xl mb-10"
      >
        <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5e534a]" />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try ‘linen’, ‘watch’, ‘serum’…"
          className="w-full bg-card border-2 border-border focus:border-[#17100b] rounded-full pl-14 pr-6 py-4 text-base outline-none transition"
        />
      </form>

      {/* NO SEARCH */}
      {!searchValue ? (
        <div>
          <p className="text-sm text-[#5e534a] mb-4">
            Browse a universe instead
          </p>

          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link
                key={c._id}
                href={`/category/${c.name}`}
                className="px-4 py-2 rounded-full bg-[#f6eee2] hover:bg-[#17100b] hover:text-cream text-sm transition"
              >
                {c.title}
              </Link>
            ))}
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-[#5e534a]">
          No matches for <strong>"{searchValue}"</strong>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
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
      )}
    </div>
  );
}

export default Page;