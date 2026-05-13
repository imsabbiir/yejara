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

const fetchProduct = async (id) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}`,
    { cache: "no-store" },
  );
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
};

function Page({ params }) {
  const { id: productId } = React.use(params);
  const [product, setProduct] = useState(null);
  const [color, setColor] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const { addToCart, cart, updateCartQuantity } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  // Find if item is in cart and get its current quantity
  const cartItem = cart.find((item) => item.productId === productId);
  const isInCart = !!cartItem;
  const quantity = cartItem ? cartItem.quantity : 1;
  const isInWishlist = wishlist.some((item) => item.productId === productId);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProduct(productId);
        setProduct(data);
        if (data?.variants?.colorVariants?.length > 0) {
          setColor(data.variants.colorVariants[0]);
        }
        if (data?.variants?.options?.length > 0) {
          setSelectedOption(data.variants.options[0]);
        }
      } catch (error) {
        console.error(error);
      }
    };
    loadProduct();
  }, [productId]);

  if (!product) {
    return <div className="p-10 text-center font-mono">Loading...</div>;
  }

  // Destructure for easier access and to fix "undefined" errors
  const {
    productName,
    category,
    categorySlug,
    subCategory,
    subCategorySlug,
    images,
    rating,
    reviews,
    totalStock,
    soldStock,
    description,
    brand,
    variants,
  } = product;

  const updateQty = (delta) => {
    if (isInCart) {
      const newQty = Math.max(1, quantity + delta);
      updateCartQuantity(productId, newQty);
    } else if (delta > 0) {
      // If not in cart and user hits plus, add it
      handleAddCart();
    }
  };

  const handleAddWishlist = () => {
    toggleWishlist({
      productId,
      name: productName,
      subCategory,
      productImages: images,
      variants,
      subCategorySlug,
    });
  };

  const handleAddCart = () => {
    addToCart({
      productId,
      productImage: images?.[0],
      name: productName,
      subCategory,
      selectedColor: color,
      selectedOption,
      regularPrice: selectedOption?.regularPrice,
      offerPrice: selectedOption?.offer?.offerPrice,
      subCategorySlug,
    });
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#5e534a] mb-6">
        <Link href="/" className="hover:text-[#ff5b4e]">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link
          href={`/category/${categorySlug}`}
          className="hover:text-[#ff5b4e]"
        >
          {category}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link
          href={`/subcategory/${subCategorySlug}`}
          className="hover:text-[#ff5b4e]"
        >
          {subCategory}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#17100b] truncate">{productName}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ProductSlider images={images} />

        <div>
          {brand && (
            <span className="inline-block bg-[#ff5b4e] text-[#d9d3c7] text-[10px] uppercase tracking-widest font-mono px-2.5 py-1 rounded-full mb-3">
              {brand}
            </span>
          )}

          <h1 className="font-fraunces text-4xl md:text-5xl mb-3">
            {productName}
          </h1>

          <div className="flex items-center gap-3 mb-5 text-sm">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-[#ff5b4e] text-[#ff5b4e]" />
              <strong>{rating}</strong>
            </span>
            <span className="text-[#5e534a]">· {reviews} reviews</span>
            <span className="text-[#5e534a]">
              · {totalStock - soldStock} in stock
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-fraunces text-4xl font-semibold">
              ৳ {selectedOption?.offer?.offerPrice}
            </span>
            {selectedOption?.regularPrice && (
              <span className="text-[#5e534a] line-through">
                ৳ {selectedOption.regularPrice}
              </span>
            )}
          </div>

          <p className="text-[#5e534a] mb-8 leading-relaxed font-inter">
            {description}
          </p>

          {/* Variants */}
          <div className="mb-6 flex flex-wrap gap-8 items-start">
            {variants?.colorVariants?.length > 0 && (
              <div>
                <p className="text-xs font-mono uppercase tracking-widest mb-3">
                  Color: <strong>{color?.name}</strong>
                </p>
                <div className="flex gap-2">
                  {variants.colorVariants.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => setColor(c)}
                      className={`w-8 h-8 rounded-full border-2 ${color?.hex === c.hex ? "border-[#ff5b4e] scale-110" : "border-transparent"}`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {variants?.options?.length > 0 && (
              <div>
                <p className="text-xs font-mono uppercase tracking-widest mb-3">
                  Type: <strong>{selectedOption?.type}</strong>
                </p>
                <div className="flex gap-2">
                  {variants.options.map((option) => (
                    <button
                      key={option.type}
                      onClick={() => setSelectedOption(option)}
                      className={`px-5 h-8 rounded-full text-sm border-2 transition ${
                        selectedOption?.type === option.type
                          ? "border-[#17100b] bg-[#17100b] text-[#d9d3c7]"
                          : "border-gray-200 hover:border-gray-400"
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
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center border border-gray-200 rounded-full">
              <button
                onClick={() => updateQty(-1)}
                className="p-3 hover:text-[#ff5b4e]"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button
                onClick={() => updateQty(1)}
                className="p-3 hover:text-[#ff5b4e]"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={handleAddCart}
              className={`flex-1 text-white rounded-full py-3.5 text-sm font-medium transition-colors ${
                isInCart ? "bg-green-700" : "bg-[#17100b] hover:bg-[#ff5b4e]"
              }`}
            >
              {isInCart ? "Added to cart" : "Add to cart"}
            </button>
            <button
              onClick={handleAddWishlist}
              className="p-3.5 rounded-full border-2 border-gray-200 transition hover:border-[#ff5b4e]"
              aria-label="Wishlist"
            >
              <Heart
                className={`size-4 ${isInWishlist ? "fill-[#ff5b4e] text-[#ff5b4e]" : ""}`}
              />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs text-[#5e534a] border-t border-[#dfd6cb] pt-6">
            <div className="flex flex-col items-center text-center gap-1">
              <Truck className="w-5 h-5 text-[#17100b]" /> Free shipping
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <RotateCcw className="w-5 h-5 text-[#17100b]" /> 30-day returns
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <ShieldCheck className="w-5 h-5 text-[#17100b]" /> 2yr warranty
            </div>
          </div>
        </div>
      </div>
      <RelatedProducts productId={productId} />
    </div>
  );
}

export default Page;
