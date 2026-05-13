"use client";

import { Card } from "@/components/Cards/Card";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

function Page({ params }) {
  const { slug } = React.use(params);

  const [categoryProducts, setCategoryProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState(0);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  // GET MAX PRICE FROM DATABASE
const maxPrice = useMemo(() => {
  if (!categoryProducts.length) return 1000;

  return Math.max(
    ...categoryProducts.map((product) => {
      return Number(
        product?.variants?.options[0]?.offer?.offerPrice ||
          product?.variants?.options[0]?.regularPrice ||
          0,
      );
    }),
  );
}, [categoryProducts]);

useEffect(() => {
  if (maxPrice > 0) {
    setPrice(maxPrice);
  }
}, [maxPrice]);

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/category/${slug}`,
          {
            cache: "no-store",
          },
        );

        const categoryRes = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`,
          {
            cache: "no-store",
          },
        );

        const productsData = await productRes.json();

        const categoriesData = await categoryRes.json();

        setCategoryProducts(productsData);

        setCategories(categoriesData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // CATEGORY
  const category = categories.find((cat) => cat.name === slug);

  // FILTER + SORT
  const filteredProducts = useMemo(() => {
    let products = [...categoryProducts];

    // PRICE FILTER
    products = products.filter((product) => {
      const productPrice = Number(
        product?.variants?.options[0]?.offer?.offerPrice ||
          product?.variants?.options[0]?.regularPrice ||
          0,
      );

      return productPrice <= price;
    });

    // SALE FILTER
    if (onSaleOnly) {
      products = products.filter(
        (product) =>
          product?.variants?.options[0]?.offer?.offerPrice &&
          Number(product?.variants?.options[0]?.offer?.offerPrice) > 0,
      );
    }

    // SORT
    if (sortBy === "price-asc") {
      products.sort((a, b) => {
        const aPrice = Number(
          a?.variants?.options[0]?.offer?.offerPrice ||
            a?.variants?.options[0]?.regularPrice ||
            0,
        );

        const bPrice = Number(
          b?.variants?.options[0]?.offer?.offerPrice ||
            b?.variants?.options[0]?.regularPrice ||
            0,
        );

        return aPrice - bPrice;
      });
    }

    if (sortBy === "price-desc") {
      products.sort((a, b) => {
        const aPrice = Number(
          a?.variants?.options[0]?.offer?.offerPrice ||
            a?.variants?.options[0]?.regularPrice ||
            0,
        );

        const bPrice = Number(
          b?.variants?.options[0]?.offer?.offerPrice ||
            b?.variants?.options[0]?.regularPrice ||
            0,
        );

        return bPrice - aPrice;
      });
    }

    return products;
  }, [categoryProducts, price, onSaleOnly, sortBy]);

  if (loading) {
    return <div className="py-20 text-center">Loading...</div>;
  }

  return (
    <div className="px-6 py-10">
      {/* BREADCRUMB */}
      <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#5e534a] mb-6">
        <Link href="/" className="hover:text-coral">
          Home
        </Link>

        <ChevronRight className="w-3 h-3" />

        <Link href={`/category/${slug}`} className="hover:text-coral">
          {category?.title}
        </Link>
      </nav>

      {/* HERO */}
      <div
        className="rounded-3xl p-10 md:p-14 mb-10 relative overflow-hidden"
        style={{
          backgroundColor: category?.tone,
        }}
      >
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#17100b]/70 mb-3">
          {category?.title} · {filteredProducts.length} items
        </p>

        <h1 className="font-fraunces text-5xl md:text-7xl text-[#17100b] leading-[0.95] max-w-2xl">
          {category?.banner?.tagline}
        </h1>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* SIDEBAR */}
        <aside className="col-span-12 lg:col-span-3 space-y-8">
          {/* SUBCATEGORY */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-[#ff5b4e] mb-3">
              Subcategories
            </h3>

            <ul className="space-y-1">
              {category?.subcategories?.map((s) => (
                <li key={s._id}>
                  <Link
                    href={`/subcategory/${s.name}`}
                    className="block py-1.5 text-sm text-[#5e534a] hover:text-[#ff5b4e]"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* FILTER */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-coral mb-3 flex items-center gap-2">
              <SlidersHorizontal className="w-3 h-3" />
              Filters
            </h3>

            {/* PRICE */}
            <label className="block text-xs text-[#5e534a] mb-2">
              Max price: ${price}
            </label>

            <input
              type="range"
              min={20}
              max={maxPrice}
              step={10}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full accent-[#ff5b4e]"
            />

            {/* SALE */}
            <label className="flex items-center gap-2 mt-4 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={onSaleOnly}
                onChange={(e) => setOnSaleOnly(e.target.checked)}
                className="accent-coral"
              />
              On sale only
            </label>
          </div>
        </aside>

        {/* PRODUCTS */}
        <div className="col-span-12 lg:col-span-9">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-[#5e534a]">
              {filteredProducts.length} results
            </p>

            {/* SORT */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#f2eadd]/60 rounded-full px-4 py-2 text-sm outline-none"
            >
              <option value="featured">Featured</option>

              <option value="price-asc">Price: Low to High</option>

              <option value="price-desc">Price: High to Low</option>

              <option value="rating">Top Rated</option>
            </select>
          </div>

          {/* PRODUCTS */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-[#5e534a]">
              No products match your filters.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
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
    </div>
  );
}

export default Page;
