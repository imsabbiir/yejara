import React from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import Link from "next/link";
function RelatedProductCard({
  productImage,
  name,
  ratting,
  regularPrice,
  offerPrice,
  categorySlug,
  subCategorySlug,
  porductId,
}) {
  return (
    <div className="bg-[#fff] flex gap-4 items-center p-3 border border-[#f0f0f0] rounded-lg">
      <div className="h-20 w-20 bg-[rgba(0,0,0,0.3)] rounded">
        <Image
          src={productImage}
          alt={name}
          width={500}
          height={500}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="">
        <Link href={`/products/${categorySlug}/${subCategorySlug}/${porductId}`}>
          <h2 className="text-[#353535] font-medium mb-1 hover:text-[#111]">
            {name.length > 17 ? `${name.slice(0, 17)}...` : name}
          </h2>
        </Link>
        <div className="flex text-xs mb-2">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={i < ratting ? "text-yellow-500" : "text-gray-400"}
            />
          ))}
        </div>
        <div className="flex items-end gap-3">
          <del className="text-sm text-[#787878] ">${regularPrice}</del>
          <span className="font-semibold text-red-400">${offerPrice}</span>
        </div>
      </div>
    </div>
  );
}

export default RelatedProductCard;
