import Image from "next/image";
import React from "react";
import { FaStar } from "react-icons/fa";

function SingleProductCard({
  productImage,
  name,
  ratting,
  description,
  category,
  regularPrice,
  offerPrice,
  sold,
  available,
}) {
  const total = sold + available;
  const percentage = (sold / total) * 100;
  return (
    <div className="bg-[#fff] flex ">
      <div className="min-w-1/2 max-w-1/2 h-[450px] bg-[rgba(0,0,0,0.3)] rounded overflow-hidden">
        <Image
          src={productImage}
          alt={name}
          width={500}
          height={500}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-5">
        <div className="flex mb-2">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={i < ratting ? "text-yellow-500" : "text-gray-400"}
            />
          ))}
        </div>
        <h2 className="text-[#282828] text-xl leading-5 mt-3">{name}</h2>
        <span className="text-red-400 text-xs font-light">{category}</span>
        <p className="text-[#8b8b8b] py-3 font-light text-sm text-justify">
          {description.length > 140
            ? `${description.slice(0, 140)}...`
            : description}
        </p>
        <div className="flex items-end gap-3 text-xl">
          <span className="font-bold text-red-400">${offerPrice}</span>
          <del className="text-[#787878] font-light">${regularPrice}</del>
        </div>
        <button className="uppercase font-bold  text-white bg-red-400 rounded-lg px-6 py-2 mt-2 cursor-pointer">
          Add to Card
        </button>
        <div>
          <div className="flex justify-between items-center text-sm uppercase text-[#4f4f4f] mt-4">
            <h2>
              already sold: <span className="font-semibold">{sold}</span>
            </h2>
            <h2>
              available: <span className="font-semibold">{available}</span>
            </h2>
          </div>
          <div className="w-full h-2.5 bg-gray-300 rounded-full relative mt-1.5">
            <div className="w-[calc(100%-12px)] h-[40%]  rounded-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden">
              <div
                className={`rounded-full h-full bg-red-400`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <h2 className="text-sm font-semibold uppercase text-[#4f4f4f]">
            Hurry Up! Offer ends in:
          </h2>
          <div className="w-full flex gap-5 mt-3">
            <div className="h-15 w-15 rounded bg-[#d9d9d9] flex flex-col justify-center items-center relative">
              <span className="font-semibold">00</span>
              <span className="capitalize text-xs">days</span>
            </div>
            <div className="h-15 w-15 rounded bg-[#d9d9d9] flex flex-col justify-center items-center relative">
              <span className="font-semibold">22</span>
              <span className="capitalize text-xs">hours</span>
            </div>
            <div className="h-15 w-15 rounded bg-[#d9d9d9] flex flex-col justify-center items-center relative">
              <span className="font-semibold">59</span>
              <span className="capitalize text-xs">minutes</span>
            </div>
            <div className="h-15 w-15 rounded bg-[#d9d9d9] flex flex-col justify-center items-center relative">
              <span className="font-semibold">59</span>
              <span className="capitalize text-xs">seconds</span>
            </div>
            
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleProductCard;
