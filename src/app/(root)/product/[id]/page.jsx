"use client";

import {
  ChevronRight,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import ProductSlider from "@/components/ProductDetails/ProductSlider";
import RelatedProducts from "@/components/ProductDetails/RelatedProducts";
import toast from "react-hot-toast";

const fetchProduct = async (id) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}`,
    {
      cache: "no-store",
    },
  );
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
};

function ProductSkeleton() {
  return (
    <main className="max-w-350 mx-auto px-6 pt-16 pb-16 animate-pulse">
      <div className="h-4 bg-[#dfd6cb]/40 rounded w-1/3 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div className="aspect-square bg-[#dfd6cb]/30 rounded-3xl" />
        <div className="space-y-6">
          <div className="h-4 bg-[#dfd6cb]/40 rounded w-1/4" />
          <div className="h-10 bg-[#dfd6cb]/40 rounded w-3/4" />
          <div className="h-6 bg-[#dfd6cb]/30 rounded w-1/2" />
          <div className="h-20 bg-[#dfd6cb]/20 rounded-2xl" />
          <div className="h-12 bg-[#dfd6cb]/30 rounded-full w-full" />
        </div>
      </div>
    </main>
  );
}

export default function Page({ params }) {
  const { id: productId } = React.use(params);
  const [product, setProduct] = useState(null);
  const [color, setColor] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);

  const { addToCart, cart, updateCartQuantity } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  const cartItem = cart.find((item) => item.productId === productId);
  const isInCart = !!cartItem;
  const quantity = cartItem ? cartItem.quantity : 1;
  const isInWishlist = wishlist.some((item) => item.productId === productId);

  useEffect(() => {
    let active = true;
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await fetchProduct(productId);
        if (active) {
          setProduct(data);
          if (data?.variants?.colorVariants?.length > 0) {
            setColor(data.variants.colorVariants[0]);
          }
          if (data?.variants?.options?.length > 0) {
            setSelectedOption(data.variants.options[0]);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadProduct();
    return () => {
      active = false;
    };
  }, [productId]);

  const updateQty = (delta) => {
    if (isInCart) {
      updateCartQuantity(productId, Math.max(1, quantity + delta));
    } else if (delta > 0) {
      handleAddCart();
    }
  };

  const handleAddWishlist = () => {
    if (!product) return;
    const wasInWishlist = isInWishlist;
    toggleWishlist({
      productId,
      name: product.productName,
      subCategory: product.subCategory,
      productImages: product.images,
      variants: product.variants,
      subCategorySlug: product.subCategorySlug,
    });
    toast(wasInWishlist ? "Removed from Wishlist" : "Added to Wishlist", {
      position: "bottom-right",
      style: {
        background: "#17100b",
        color: wasInWishlist ? "#ff5b4e" : "#007a56",
      },
      icon: wasInWishlist ? "❌" : "✅",
    });
  };

  const handleAddCart = () => {
    if (!product) return;
    addToCart({
      productId,
      productImage: product.images?.[0],
      name: product.productName,
      subCategory: product.subCategory,
      selectedColor: color,
      selectedOption,
      regularPrice: selectedOption?.regularPrice,
      offerPrice: selectedOption?.offer?.offerPrice,
      subCategorySlug: product.subCategorySlug,
    });
    toast("Added to Cart", {
      position: "bottom-right",
      style: { background: "#17100b", color: "#007a56" },
      icon: "✅",
    });
  };

  if (loading || !product) {
    return <ProductSkeleton />;
  }

  return (
    <main className="max-w-350 mx-auto px-6 pt-16 pb-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#5e534a] mb-6">
        <Link href="/" className="hover:text-[#ff5b4e] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-[#5e534a]/60" />
        <Link
          href={`/category/${product.categorySlug}`}
          className="hover:text-[#ff5b4e] transition-colors"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3 h-3 text-[#5e534a]/60" />
        <Link
          href={`/subcategory/${product.subCategorySlug}`}
          className="hover:text-[#ff5b4e] transition-colors"
        >
          {product.subCategory}
        </Link>
        <ChevronRight className="w-3 h-3 text-[#5e534a]/60" />
        <span className="text-[#17100b] truncate font-medium">
          {product.productName}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <ProductSlider images={product.images} />

        <div>
          {product.brand && (
            <span className="inline-block bg-[#ff5b4e] text-[#d9d3c7] text-[10px] uppercase tracking-widest font-mono px-2.5 py-1 rounded-full mb-3">
              {product.brand}
            </span>
          )}

          <h1 className="font-fraunces text-4xl md:text-5xl mb-3 text-[#17100b] font-semibold">
            {product.productName}
          </h1>

          <div className="flex items-center gap-3 mb-5 text-sm font-mono">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-[#ff5b4e] text-[#ff5b4e]" />
              <strong className="text-[#17100b]">{product.rating}</strong>
            </span>
            <span className="text-[#5e534a]">· {product.reviews} reviews</span>
            <span className="text-[#5e534a]">
              · {product.totalStock - product.soldStock} in stock
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-fraunces text-4xl font-semibold text-[#17100b]">
              ৳{" "}
              {selectedOption?.offer?.offerPrice ||
                selectedOption?.regularPrice}
            </span>
            {selectedOption?.offer?.offerPrice &&
              selectedOption?.regularPrice && (
                <span className="text-[#5e534a] line-through text-lg">
                  ৳ {selectedOption.regularPrice}
                </span>
              )}
          </div>

          <p className="text-[#5e534a] mb-8 leading-relaxed text-sm max-w-xl">
            {product.description}
          </p>

          {/* Variants */}
          <div className="mb-8 flex flex-wrap gap-8 items-start">
            {product.variants?.colorVariants?.length > 0 && (
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-[#17100b] mb-3">
                  Color: <span className="font-bold">{color?.name}</span>
                </p>
                <div className="flex gap-2">
                  {product.variants.colorVariants.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => setColor(c)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        color?.hex === c.hex
                          ? "border-[#ff5b4e] scale-110 shadow-sm"
                          : "border-transparent hover:scale-105"
                      }`}
                      style={{ backgroundColor: c.hex }}
                      aria-label={`Select color ${c.name}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {product.variants?.options?.length > 0 && (
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-[#17100b] mb-3">
                  Type:{" "}
                  <span className="font-bold">{selectedOption?.type}</span>
                </p>
                <div className="flex gap-2">
                  {product.variants.options.map((option) => (
                    <button
                      key={option.type}
                      onClick={() => setSelectedOption(option)}
                      className={`px-5 h-8 rounded-full text-xs font-mono border transition-all ${
                        selectedOption?.type === option.type
                          ? "border-[#17100b] bg-[#17100b] text-[#d9d3c7]"
                          : "border-[#dfd6cb] text-[#5e534a] hover:border-[#17100b] hover:text-[#17100b]"
                      }`}
                    >
                      {option.type}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center border border-[#dfd6cb] rounded-full bg-white/50">
              <button
                onClick={() => updateQty(-1)}
                className="p-3 text-[#5e534a] hover:text-[#ff5b4e] transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-mono font-medium text-[#17100b]">
                {quantity}
              </span>
              <button
                onClick={() => updateQty(1)}
                className="p-3 text-[#5e534a] hover:text-[#ff5b4e] transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddCart}
              className={`flex-1 text-white rounded-full py-3.5 text-xs font-mono uppercase tracking-wider font-semibold transition-colors ${
                isInCart ? "bg-[#007a56]" : "bg-[#17100b] hover:bg-[#ff5b4e]"
              }`}
            >
              {isInCart ? "Added to cart" : "Add to cart"}
            </button>

            <button
              onClick={handleAddWishlist}
              className="p-3.5 rounded-full border border-[#dfd6cb] bg-white/50 transition hover:border-[#ff5b4e]"
              aria-label="Toggle wishlist"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${isInWishlist ? "fill-[#ff5b4e] text-[#ff5b4e]" : "text-[#5e534a]"}`}
              />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-[10px] font-mono uppercase tracking-wider text-[#5e534a] border-t border-[#dfd6cb] pt-6">
            <div className="flex flex-col items-center text-center gap-1.5">
              <Truck className="w-4 h-4 text-[#17100b]" /> Free shipping
            </div>
            <div className="flex flex-col items-center text-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-[#17100b]" /> 30-day returns
            </div>
            <div className="flex flex-col items-center text-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#17100b]" /> 2yr warranty
            </div>
          </div>
        </div>
      </div>

      <RelatedProducts productId={productId} />
    </main>
  );
}
