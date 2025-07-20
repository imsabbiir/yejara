'use client'
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { CiHeart, CiShoppingCart } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
function ProductVACard({
  productImage,
  name,
  ratting,
  category,
  regularPrice,
  offerPrice,
  categorySlug,
  subCategorySlug,
  productId
}) {
  const route = useRouter();
  return (
    <div className="bg-[#fff] border border-[#f0f0f0] rounded-lg transition-all duration-300 ease-in-out hover:shadow-xl group">
      <div className="w-full h-[270px] bg-[rgba(0,0,0,0.3)] rounded overflow-hidden relative" >
        <Image
          src={productImage}
          alt={name}
          width={500}
          height={500}
          className="object-cover w-full h-full object-top group-hover:scale-105 group-hover:transition-all duration-300 cursor-pointer"
          onClick={()=>{route.push(`/${categorySlug}/${subCategorySlug}/${productId}`)}}
        />
        <div className="h-full px-4 absolute top-0 -right-full flex flex-col gap-3 justify-center items-center group-hover:right-0 group-hover:transition-all duration-300 ease-in-out">
          <div className="border border-[#ededed] h-8 w-8 bg-white rounded flex justify-center items-center text-lg cursor-pointer">
            <CiHeart />
          </div>
          <div className="border border-[#ededed] h-8 w-8 bg-white rounded flex justify-center items-center text-lg cursor-pointer">
            <CiShoppingCart />
          </div>
        </div>
      </div>
      <div className="p-5">
        <span className="text-red-400 text-xs font-light cursor-pointer hover:underline" onClick={()=>{route.push(`/${categorySlug}`)}}>{category}</span>
        <h2 className="text-[#757575] leading-5 mb-2 cursor-pointer hover:text-[#333]" onClick={()=>{route.push(`/${categorySlug}/${subCategorySlug}/${productId}`)}}>
          {name.length > 25 ? `${name.slice(0, 25)}...` : name}
        </h2>
        <div className="flex mb-2">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={`text-xs ${
                i < ratting ? "text-yellow-500" : "text-gray-400"
              }`}
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
