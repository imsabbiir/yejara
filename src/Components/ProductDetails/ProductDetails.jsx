"use client";
import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
const ProductDetails = ({ product }) => {
  const [selectedColor, setSelectedColor] = useState(
    product.variants?.colorVariants?.[0],
  );
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const selectedVariant = product.variants?.options?.[selectedVariantIndex];

  const price = selectedVariant?.offer?.offerStatus
    ? selectedVariant.offer.offerPrice
    : selectedVariant?.regularPrice;

  const { addToCart, cart } = useCart(); // use the cart context

  const handleAddToCart = () => {
    addToCart({
      productId: product._id,
      productImage: product.images?.[0],
      name: product.productName,
      category: product.category,
      regularPrice: selectedVariant?.regularPrice,
      offerPrice: selectedVariant?.offer?.offerStatus
        ? selectedVariant.offer.offerPrice
        : selectedVariant?.regularPrice,
      categorySlug: product.categorySlug,
      subCategorySlug: product.subCategorySlug,
      selectedColor,
      selectedVariant: selectedVariant?.type,
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
    <div className="w-full max-w-xl">
      {/* Product Title */}
      <h1 className="text-3xl font-semibold mb-2 text-[#333]">
        {product.productName}
      </h1>

      {/* Description */}
      <p className="text-gray-500 mb-4">{product.description}</p>

      {/* Price Display */}
      <div className="mb-4 flex items-end gap-5">
        <p className="font-bold text-red-400 text-2xl">${price}</p>
        {selectedVariant?.offer?.offerStatus && (
          <p className="text-lg font-semibold line-through text-gray-400">
            ${selectedVariant.regularPrice}
          </p>
        )}
      </div>

      {/* Brand Info */}
      <div className="mb-4 flex gap-3">
        <p className="font-thin">Brand:</p>
        <p className="font-semibold">{product.brand}</p>
      </div>

      {/* Color Selection */}
      <div className="mb-4">
        <p className="font-medium mb-1">Available Colors:</p>
        <div className="flex gap-2">
          {product.variants?.colorVariants?.map((color, index) => (
            <span
              key={index}
              className={`h-8 w-8 rounded-full border-2 cursor-pointer transition ${
                selectedColor === color
                  ? "ring-2 ring-[#ff8f9c] border-[#ff8f9c]"
                  : "border-gray-300 hover:border-red-400"
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Variant Selection */}
      <div className="mb-4">
        <p className="font-medium mb-1">Variants:</p>
        <div className="flex gap-2 flex-wrap">
          {product.variants?.options?.map((variant, index) => (
            <span
              key={index}
              onClick={() => setSelectedVariantIndex(index)}
              className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer border transition ${
                selectedVariantIndex === index
                  ? "bg-[#ff8f9c] text-white border-[#ff8f9c]"
                  : "bg-red-100 text-[#ff8f9c] hover:bg-red-200 border-red-200"
              }`}
            >
              {variant.type}
            </span>
          ))}
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="mt-6">
        <button
          className="bg-[#ff8f9c] hover:bg-red-400 transition text-white px-6 py-2 rounded-lg font-semibold"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
