"use client";

import { Card } from "@/components/Cards/Card";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

export default function Page({ params }) {
  const { slug } = React.use(params);

  const [categoryProducts, setCategoryProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState(0);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");

  // GET MAX PRICE FROM CURRENT DATA
  const maxPrice = useMemo(() => {
    if (!categoryProducts.length) return 1000;
    return Math.max(
      ...categoryProducts.map((p) =>
        Number(
          p?.variants?.options?.[0]?.offer?.offerPrice ||
            p?.variants?.options?.[0]?.regularPrice ||
            0,
        ),
      ),
    );
  }, [categoryProducts]);

  useEffect(() => {
    if (maxPrice > 0) {
      setPrice(maxPrice);
    }
  }, [maxPrice]);

  // FETCH PRODUCTS & CATEGORIES
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productRes, categoryRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/subcategory/${slug}`, {
            cache: "no-store",
          }),
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`, {
            cache: "no-store",
          }),
        ]);

        const productsData = await productRes.json();
        const categoriesData = await categoryRes.json();

        setCategoryProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  // ACCESSIBLE LAYOUT NODES
  const category = categories.find((cat) =>
    cat.subcategories?.some((sub) => sub.name === slug),
  );
  const currentSubcategory = category?.subcategories?.find(
    (sub) => sub.name === slug,
  );

  // FILTER & SORT LOGIC
  const filteredProducts = useMemo(() => {
    let products = [...categoryProducts];

    products = products.filter((p) => {
      const pPrice = Number(
        p?.variants?.options?.[0]?.offer?.offerPrice ||
          p?.variants?.options?.[0]?.regularPrice ||
          0,
      );
      return pPrice <= price;
    });

    if (onSaleOnly) {
      products = products.filter((p) => {
        const salePrice = Number(p?.variants?.options?.[0]?.offer?.offerPrice);
        return salePrice && salePrice > 0;
      });
    }

    if (sortBy === "price-asc") {
      products.sort((a, b) => {
        const aP = Number(
          a?.variants?.options?.[0]?.offer?.offerPrice ||
            a?.variants?.options?.[0]?.regularPrice ||
            0,
        );
        const bP = Number(
          b?.variants?.options?.[0]?.offer?.offerPrice ||
            b?.variants?.options?.[0]?.regularPrice ||
            0,
        );
        return aP - bP;
      });
    }

    if (sortBy === "price-desc") {
      products.sort((a, b) => {
        const aP = Number(
          a?.variants?.options?.[0]?.offer?.offerPrice ||
            a?.variants?.options?.[0]?.regularPrice ||
            0,
        );
        const bP = Number(
          b?.variants?.options?.[0]?.offer?.offerPrice ||
            b?.variants?.options?.[0]?.regularPrice ||
            0,
        );
        return bP - aP;
      });
    }

    return products;
  }, [categoryProducts, price, onSaleOnly, sortBy]);

  return (
    <main className="max-w-350 mx-auto px-6 pt-16 pb-16">
      {/* BREADCRUMB */}
      <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#5e534a] mb-6">
        <Link href="/" className="hover:text-[#ff5b4e] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-[#5e534a]/60" />
        <Link
          href={`/category/${category?.name || ""}`}
          className="hover:text-[#ff5b4e] transition-colors"
        >
          {category?.title || "Category"}
        </Link>
        <ChevronRight className="w-3 h-3 text-[#5e534a]/60" />
        <span className="text-[#17100b] font-medium">
          {currentSubcategory?.title || "Subcategory"}
        </span>
      </nav>

      {/* HERO BANNER */}
      <div
        className="rounded-4xl p-10 md:p-14 mb-10 relative overflow-hidden transition-colors duration-300"
        style={{ backgroundColor: category?.tone || "#f9f1e5" }}
      >
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#17100b]/70 mb-3">
          {currentSubcategory?.title || "Collection"} ·{" "}
          {filteredProducts.length} items
        </p>
        <h1 className="font-fraunces text-4xl md:text-6xl text-[#17100b] leading-[1.05] max-w-2xl font-semibold">
          {category?.banner?.tagline || "Curated Craftsmanship"}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* SIDEBAR FILTERS */}
        <aside className="lg:col-span-3 space-y-8 lg:sticky lg:top-32 h-fit">
          {category?.subcategories && category.subcategories.length > 0 && (
            <div className="bg-white/50 border border-[#dfd6cb]/40 p-6 rounded-2xl">
              <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-[#ff5b4e] mb-4">
                Subcategories
              </h3>
              <ul className="space-y-2">
                {category.subcategories.map((s) => (
                  <li key={s._id}>
                    <Link
                      href={`/subcategory/${s.name}`}
                      className={`block py-1 text-sm transition-colors ${
                        s.name === slug
                          ? "text-[#ff5b4e] font-medium"
                          : "text-[#5e534a] hover:text-[#ff5b4e]"
                      }`}
                    >
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg White/50 border border-[#dfd6cb]/40 p-6 rounded-2xl">
            <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-[#17100b] mb-4 flex items-center gap-2">
              <SlidersHorizontal className="w-3 h-3" />
              Filters
            </h3>

            {/* RANGE SLIDER */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs text-[#5e534a]">
                <span>Min: $20</span>
                <span>Max: ${price}</span>
              </div>
              <input
                type="range"
                min={20}
                max={maxPrice}
                step={10}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full accent-[#ff5b4e] h-1 bg-[#dfd6cb] rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* SALE CHECKBOX */}
            <label className="flex items-center gap-3 mt-5 text-sm text-[#5e534a] cursor-pointer group">
              <input
                type="checkbox"
                checked={onSaleOnly}
                onChange={(e) => setOnSaleOnly(e.target.checked)}
                className="w-4 h-4 rounded accent-[#ff5b4e]"
              />
              <span className="group-hover:text-[#17100b] transition-colors">
                On sale only
              </span>
            </label>
          </div>
        </aside>

        {/* FEED SECTIONS */}
        <div className="lg:col-span-9">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-[#5e534a] font-mono">
              Showing {filteredProducts.length} results
            </p>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#f2eadd]/60 rounded-full px-4 py-2 text-sm outline-none border border-[#dfd6cb]/40 text-[#17100b] font-medium transition-colors hover:bg-[#f2eadd]"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {loading ? (
            <div className="py-24 text-center text-[#5e534a] font-mono text-sm">
              Loading beautiful adjustments...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-[#dfd6cb] rounded-3xl text-[#5e534a]">
              No products match your active filters.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
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
      </div>
    </main>
  );
}
