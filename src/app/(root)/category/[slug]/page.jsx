"use client";

export const dynamic = "force-dynamic";

import { Card } from "@/components/Cards/Card";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";

// SMOOTH SKELETON LOADER GRID
function CategorySkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-4">
          <div className="aspect-square bg-[#dfd6cb]/30 rounded-2xl" />
          <div className="h-4 bg-[#dfd6cb]/40 rounded w-2/3" />
          <div className="h-4 bg-[#dfd6cb]/30 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default function Page({ params }) {
  const { slug } = React.use(params);

  const [categoryProducts, setCategoryProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [price, setPrice] = useState(0);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");

  // INFINITE SCROLL STATES
  const [pageNum, setPageNum] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);

  const observerRef = useRef(null);

  // MAX PRICE
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

  // SET PRICE
  useEffect(() => {
    if (maxPrice > 0) {
      setPrice(maxPrice);
    }
  }, [maxPrice]);

  // FETCH PRODUCTS
  const fetchProducts = useCallback(
    async (page = 1) => {
      try {
        if (fetchingMore) return;
        if (page === 1) setLoading(true);
        else setFetchingMore(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/category/${slug}?page=${page}&limit=9`,
          { cache: "no-store" },
        );
        const data = await res.json();

        setCategoryProducts((prev) => {
          if (page === 1) return data.products;
          const existingIds = new Set(prev.map((p) => p._id));
          const newProducts = data.products.filter(
            (p) => !existingIds.has(p._id),
          );
          return [...prev, ...newProducts];
        });

        setHasMore(data.hasMore);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        setFetchingMore(false);
      }
    },
    [slug, fetchingMore],
  );

  // FETCH CATEGORIES
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`,
          { cache: "no-store" },
        );
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  // RESET ON CATEGORY CHANGE
  useEffect(() => {
    setCategoryProducts([]);
    setPageNum(1);
    setHasMore(true);
    fetchProducts(1);
  }, [slug]);

  // INFINITE SCROLL
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !fetchingMore && !loading) {
          setPageNum((prevPage) => {
            const nextPage = prevPage + 1;
            fetchProducts(nextPage);
            return nextPage;
          });
        }
      },
      { threshold: 0.1 },
    );

    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasMore, fetchingMore, loading, fetchProducts]);

  const category = categories.find((cat) => cat.name === slug);

  // FILTER + SORT
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
        <span className="text-[#17100b] font-medium">
          {category?.title || "Category"}
        </span>
      </nav>

      {/* HERO BANNER */}
      <div
        className="rounded-4xl p-10 md:p-14 mb-10 relative overflow-hidden transition-colors duration-300"
        style={{ backgroundColor: category?.tone || "#f9f1e5" }}
      >
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#17100b]/70 mb-3">
          {category?.title} · {filteredProducts.length} items
        </p>
        <h1 className="font-fraunces text-4xl md:text-6xl text-[#17100b] leading-[1.05] max-w-2xl font-semibold">
          {category?.banner?.tagline || "Curated Collection"}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* SIDEBAR */}
        <aside className="lg:col-span-3 space-y-8 lg:sticky lg:top-32 h-fit">
          {/* SUBCATEGORY */}
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
                      className="block py-1 text-sm text-[#5e534a] hover:text-[#ff5b4e] transition-colors"
                    >
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* FILTERS */}
          <div className="bg-white/50 border border-[#dfd6cb]/40 p-6 rounded-2xl">
            <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-[#17100b] mb-4 flex items-center gap-2">
              <SlidersHorizontal className="w-3 h-3" />
              Filters
            </h3>

            {/* PRICE */}
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

            {/* SALE */}
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

        {/* PRODUCT FEED CONTAINER */}
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
            <CategorySkeleton />
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-[#dfd6cb] rounded-3xl text-[#5e534a]">
              No products match your active filters.
            </div>
          ) : (
            <>
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

              {/* LOAD MORE ANCHOR */}
              <div
                ref={observerRef}
                className="h-24 flex items-center justify-center mt-6"
              >
                {fetchingMore && (
                  <p className="text-sm text-[#5e534a] font-mono">
                    Loading more products...
                  </p>
                )}
                {!hasMore && categoryProducts.length > 0 && (
                  <p className="text-xs font-mono text-[#5e534a]/60 uppercase tracking-widest">
                    You have reached the end
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
