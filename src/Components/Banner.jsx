"use client"; 

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import Banner1 from "@/media/banner-2.jpg";
import Banner2 from "@/media/banner.jpg";
import Banner3 from "@/media/banner-3.jpg";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
export default function Banner() {
   const prevRef = useRef(null);
  const nextRef = useRef(null);
  return (
    <div className="w-9/10 mx-auto h-[17lh] rounded-2xl overflow-hidden pointer-events-none">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        pagination={false}
        spaceBetween={50}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="pointer-events-auto"
      >
        <SwiperSlide>
          <div className="relative w-full h-[17lh]">
            <Image
              src={Banner1}
              alt="Banner"
              width={2500}
              height={1500}
              className="object-cover w-full h-full object-center"
            />
            <div className="absolute top-0 left-0 h-full w-full flex items-center">
              <div className="w-8/10 mx-auto">
                <h3 className="text-3xl font-semibold text-[#ff8f9c]">
                  Trending item
                </h3>
                <h2 className="text-5xl font-black text-[#222222] w-2/5 uppercase my-3">
                  Women's latest fashion sale
                </h2>
                <p className="text-2xl text-[#777]">
                  starting at $ <span className="text-3xl font-bold">20</span>
                  .00
                </p>
                <button className="px-5 py-2 bg-red-400 rounded text-white cursor-pointer font-semibold mt-3">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative w-full h-[17lh]">
            <Image
              src={Banner2}
              alt="Banner"
              width={2500}
              height={1500}
              className="object-cover w-full h-full object-center"
            />
            <div className="absolute top-0 left-0 h-full w-full flex items-center">
              <div className="w-8/10 mx-auto">
                <h3 className="text-3xl font-semibold text-[#ff8f9c]">
                  Trending accessories
                </h3>
                <h2 className="text-5xl font-black text-[#222222] w-2/5 uppercase my-3">
                  Modern sunglasses
                </h2>
                <p className="text-2xl text-[#777]">
                  starting at $ <span className="text-3xl font-bold">15</span>
                  .00
                </p>
                <button className="px-5 py-2 bg-red-400 rounded text-white cursor-pointer font-semibold mt-3">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative w-full h-[17lh]">
            <Image
              src={Banner3}
              alt="Banner"
              width={2500}
              height={1500}
              className="object-cover w-full h-full object-center"
            />
            <div className="absolute top-0 left-0 h-full w-full flex items-center">
              <div className="w-8/10 mx-auto">
                <h3 className="text-3xl font-semibold text-[#ff8f9c]">
                  Sale Offer
                </h3>
                <h2 className="text-5xl font-black text-[#222222] w-2/5 uppercase my-3">
                  New fashion summer sale
                </h2>
                <p className="text-2xl text-[#777]">
                  starting at $ <span className="text-3xl font-bold">29</span>
                  .99
                </p>
                <button className="px-5 py-2 bg-red-400 rounded text-white cursor-pointer font-semibold mt-3">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
      <div className="w-full flex justify-between text-2xl mt-2">
        <button
          ref={prevRef}
          className="w-7 h-7 rounded-full bg-red-400 flex justify-center items-center text-white cursor-pointer"
        >
          <MdKeyboardArrowLeft />
        </button>
        <button
          ref={nextRef}
          className="w-7 h-7 rounded-full bg-red-400 flex justify-center items-center text-white cursor-pointer"
        >
          <MdKeyboardArrowRight />
        </button>
      </div>
    </div>
  );
}
