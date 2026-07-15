"use client";
import { useState } from "react";
import { Heart, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
export function Card({
  productId,
  name,
  subCategory,
  productImages,
  variants,
  subCategorySlug,
}) {
  const { addToCart, cart } = useCart();
  const isInCart = cart.some((item) => item.productId === productId);
  const { wishlist, toggleWishlist } = useWishlist();
  const isInWishlist = wishlist.some((item) => item.productId === productId);
  const [idx, setIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(
    variants?.colorVariants?.[0] || null,
  );
  const [selectedOption, setSelectedOption] = useState(
    variants?.options?.[0] || null,
  );
  const regularPrice = selectedOption?.regularPrice;
  const offerPrice = selectedOption?.offer?.offerPrice;
  const productImage = productImages[0];
  const total = productImages?.length || 0;
  const prev = (e) => {
    e.stopPropagation();
    setIdx((i) => (i - 1 + total) % total);
  };
  const next = (e) => {
    e.stopPropagation();
    setIdx((i) => (i + 1) % total);
  };
  const selectedVariant = selectedOption;
  const offer = selectedVariant?.offer?.offerStatus;
  const handleAddWishlist = () => {
    toggleWishlist({
      productId,
      name,
      subCategory,
      productImages,
      variants,
      subCategorySlug,
    });
    toast("Product is added in Wishlist", {
      position: "bottom-right",
      style: {
        background: "#17100b",
        color: "#007a56",
      },
      icon: "✅",
    });
  };
  const handleAddCart = () => {
    addToCart({
      productId,
      productImage,
      name,
      subCategory,
      selectedColor,
      selectedOption,
      regularPrice,
      offerPrice,
      subCategorySlug,
    });
    toast("Product is added in Cart", {
      position: "bottom-right",
      style: {
        background: "#17100b",
        color: "#007a56",
      },
      icon: "✅",
    });
  };
  return (
    <article className="group rounded-3xl bg-[#F8F1E1] text-[#231D18] overflow-hidden border border-border/60 shadow-soft hover:shadow-card transition-shadow flex flex-col">
      {/* IMAGE SLIDER */}
      <div className="relative aspect-square bg-[#F1E7CE] overflow-hidden">
        <Link
          href={`/product/${productId}`}
          className="flex h-full w-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${idx * 100}%)` }}
        >
          {productImages?.map((src, i) => (
            <Image
              key={i}
              src={src}
              alt={`${name} ${i + 1}`}
              width={2500}
              height={2500}
              className="h-full w-full object-cover shrink-0"
              loading="lazy"
            />
          ))}
        </Link>

        {/* arrows */}
        {total > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 size-8 rounded-full bg-[#FCF7EB]/90 grid place-items-center opacity-0 group-hover:opacity-100 transition"
            >
              <ChevronLeft className="size-4" />
            </button>

            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 size-8 rounded-full bg-[#FCF7EB]/90 grid place-items-center opacity-0 group-hover:opacity-100 transition"
            >
              <ChevronRight className="size-4" />
            </button>
          </>
        )}

        {/* wishlist */}
        <button
          onClick={handleAddWishlist}
          className={`absolute top-3 right-3 size-9 rounded-full grid place-items-center shadow-soft hover:bg-[#ff5b4e] hover:text-white transition cursor-pointer ${isInWishlist ? "bg-[#ff5b4e] text-white" : "bg-[#FCF7EB]"}`}
        >
          <Heart className={`size-4 ${isInWishlist ? "fill-current" : ""}`} />
        </button>

        {/* dots */}
        {total > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {productImages?.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setIdx(i);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  i === idx ? "w-5 bg-[#231D18]" : "w-1.5 bg-[#231D18]/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4 flex-1 flex flex-col">
        <Link
          href={`/subcategory/${subCategorySlug}`}
          className="text-[10px] tracking-[0.2em] text-[#6A6154]"
        >
          {subCategory?.toUpperCase()}
        </Link>

        <Link
          href={`/product/${productId}`}
          className="text-sm font-medium mt-1 line-clamp-1"
        >
          {name}
        </Link>

        {/* COLORS + VARIANTS */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          {/* COLORS */}
          <div className="flex items-center gap-1">
            {variants?.colorVariants?.map((c) => (
              <button
                key={c.hex}
                onClick={() => setSelectedColor(c)}
                className={`w-5 h-5 rounded-full transition ring-2 ${
                  selectedColor?.hex === c.hex
                    ? "ring-[#F2565E] scale-110"
                    : "ring-[#231D18]/15"
                }`}
                style={{ background: c.hex }}
              />
            ))}
          </div>

          {/* OPTIONS */}
          <div className="ml-auto flex gap-1 text-[10px] text-[#6A6154]">
            {variants?.options?.map((s) => (
              <button
                key={s.type}
                onClick={() => setSelectedOption(s)}
                className={`px-1.5 py-0.5 rounded border transition ${
                  selectedOption?.type === s.type
                    ? "bg-[#231D18] text-[#FCF7EB]"
                    : "border-border text-[#6A6154]"
                }`}
              >
                {s.type}
              </button>
            ))}
          </div>
        </div>

        {/* PRICE + CART */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-2 items-end">
            {offer ? (
              <>
                <p className="font-fraunces text-sm text-[#6A6154] line-through">
                  ৳ {regularPrice}
                </p>
                <p className="font-fraunces text-xl text-[#F2565E]">
                  ৳ {selectedVariant?.offer?.offerPrice}
                </p>
              </>
            ) : (
              <p className="font-fraunces text-xl text-[#F2565E]">
                ৳ {offerPrice}
              </p>
            )}
          </div>

          <button
            onClick={handleAddCart}
            className={`w-10 h-10 rounded-xl  text-[#FCF7EB] grid place-items-center hover:bg-[#F2565E] transition cursor-pointer ${isInCart ? "bg-green-700" : "bg-[#231D18]"}`}
          >
            <ShoppingBag className="size-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
