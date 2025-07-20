"use client";
import React from "react";
import SingleProductCard from "../Cards/SingleProductCard";
import Jewellery from "@/media/products/jewellery-1.jpg";
import shoes from "@/media/products/sports-2.jpg";
import Shampoo from "@/media/products/shampoo.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function SingleProductSlider() {
  return (
    <div className="mt-10">
      <h2 className="capitalize text-[#454545] font-semibold tracking-wider border-b border-[#9f9f9f] pb-2">
        Deal of the day
      </h2>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={false}
        pagination={false}
        spaceBetween={50}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 30000, disableOnInteraction: false }}
        className="mt-5 border border-[#f0f0f0] rounded-lg overflow-hidden"
      >
        <SwiperSlide>
          <SingleProductCard
            productImage={Shampoo}
            category={"Shoes"}
            ratting={5}
            name={"shampoo, conditioner & facewash packs"}
            description={
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos, soluta vel? Aperiam nostrum dolor atque perferendis corporis omnis! In aspernatur autem quasi qui totam, non amet odit impedit recusandae laudantium unde quod omnis temporibus, necessitatibus minus nisi est placeat reprehenderit modi. Nemo odit laborum impedit excepturi sunt eaque quisquam ipsum!"
            }
            regularPrice={"200.00"}
            offerPrice={"150.00"}
            available={30}
            sold={70}
          />
        </SwiperSlide>
        <SwiperSlide>
          <SingleProductCard
            productImage={Jewellery}
            category={"Shoes"}
            ratting={5}
            name={"Rose Gold diamonds Earring"}
            description={
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos, soluta vel? Aperiam nostrum dolor atque perferendis corporis omnis! In aspernatur autem quasi qui totam, non amet odit impedit recusandae laudantium unde quod omnis temporibus, necessitatibus minus nisi est placeat reprehenderit modi. Nemo odit laborum impedit excepturi sunt eaque quisquam ipsum!"
            }
            regularPrice={"2000.00"}
            offerPrice={"1990.00"}
            available={20}
            sold={30}
          />
        </SwiperSlide>
        <SwiperSlide>
          <SingleProductCard
            productImage={shoes}
            category={"Shoes"}
            ratting={5}
            name={"shampoo, conditioner & facewash packs"}
            description={
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos, soluta vel? Aperiam nostrum dolor atque perferendis corporis omnis! In aspernatur autem quasi qui totam, non amet odit impedit recusandae laudantium unde quod omnis temporibus, necessitatibus minus nisi est placeat reprehenderit modi. Nemo odit laborum impedit excepturi sunt eaque quisquam ipsum!"
            }
            regularPrice={"200.00"}
            offerPrice={"150.00"}
            available={30}
            sold={70}
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

export default SingleProductSlider;
