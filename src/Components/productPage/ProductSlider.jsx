"use client";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Image from "next/image";

function ProductSlider({ images }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <div className="w-full">
      {/* Main Swiper */}
      <Swiper
        modules={[Thumbs]}
        thumbs={{ swiper: thumbsSwiper }}
        spaceBetween={10}
        className="w-2/3 h-[400px] rounded-xl overflow-hidden"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <Image
              src={src}
              alt={`Slide ${index}`}
              width={500}
              height={500}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnail Swiper */}
      <Swiper
        modules={[Autoplay, Thumbs]}
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        watchSlidesProgress
        className="mt-4 h-24"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <Image
              src={src}
              alt={`Thumb ${index}`}
              width={500}
              height={500}
              className="w-3/4 h-full p-2 object-cover rounded cursor-pointer border border-gray-300 hover:border-yellow-500"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default ProductSlider;
