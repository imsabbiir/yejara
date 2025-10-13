"use client"; // Required for client-side hooks
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CiHeart, CiShoppingCart } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
function ProductVACard({
  productImage,
  name,
  ratting,
  category,
  regularPrice,
  offerPrice,
  categorySlug,
  subCategorySlug,
  productId,
}) {
  const route = useRouter();
  const { wishlist, toggleWishlist } = useWishlist();

  const isInWishlist = wishlist.some((item) => item.productId === productId);
  const { addToCart, cart } = useCart();
  const isInCart = cart.some((item) => item.productId === productId);
  const handleWishlistClick = () => {
    toggleWishlist({
      productId,
      productImage,
      name,
      category,
      regularPrice,
      offerPrice,
      categorySlug,
      subCategorySlug,
    });
  };

  return (
    <div className="bg-[#fff] border border-[#f0f0f0] rounded-lg transition-all duration-300 ease-in-out hover:shadow-xl group w-full">
      <div className="w-full h-[270px] bg-[rgba(0,0,0,0.3)] rounded overflow-hidden relative">
        <Image
          src={productImage}
          alt={name}
          width={500}
          height={500}
          className="object-cover w-full h-full object-top group-hover:scale-105 group-hover:transition-all duration-300 cursor-pointer"
          onClick={() =>
            route.push(
              `/products/${categorySlug}/${subCategorySlug}/${productId}`
            )
          }
        />

        {/* Wishlist and Cart Buttons */}
        <div
  className={`
    h-full px-4 absolute top-0 right-0 flex flex-col gap-3 justify-center items-center
    transition-all duration-300 ease-in-out
    md:-right-full md:group-hover:right-0
    bg-[#0000007b] md:bg-transparent
  `}
>
  <div
    className={`h-8 w-8 rounded flex justify-center items-center text-lg cursor-pointer bg-white transition-colors duration-300 ${
      isInWishlist ? "text-red-500" : "text-black"
    }`}
    onClick={handleWishlistClick}
  >
    <CiHeart />
  </div>

  <div
    className={`border border-[#ededed] h-8 w-8 bg-white rounded flex justify-center items-center text-lg cursor-pointer transition-colors duration-300 ${
      isInCart ? "text-green-500" : "text-black"
    }`}
    onClick={() =>
      addToCart({
        productId,
        productImage,
        name,
        category,
        regularPrice,
        offerPrice,
        categorySlug,
        subCategorySlug,
      })
    }
  >
    <CiShoppingCart />
  </div>
</div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <span
          className="text-red-400 text-xs font-light cursor-pointer hover:underline"
          onClick={() => route.push(`/products/${categorySlug}`)}
        >
          {category}
        </span>

        <h2
          className="text-[#757575] leading-5 mb-2 cursor-pointer hover:text-[#333]"
          onClick={() =>
            route.push(
              `/products/${categorySlug}/${subCategorySlug}/${productId}`
            )
          }
        >
          {name.length > 25 ? `${name.slice(0, 25)}...` : name}
        </h2>

        <div className="flex mb-2">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={i < ratting ? "text-yellow-500" : "text-gray-400"}
            />
          ))}
        </div>

        <div className="flex items-end gap-3">
          <del className="text-[#787878] font-light">${regularPrice}</del>
          <span className="font-bold text-red-400">${offerPrice}</span>
        </div>
      </div>
    </div>
  );
}

export default ProductVACard;
