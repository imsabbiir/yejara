"use client";
import Image from "next/image";
import React, { useState } from "react";
import { PiHeadsetFill } from "react-icons/pi";
import { CiUser, CiShoppingCart, CiHeart } from "react-icons/ci";
import { IoSearchOutline, IoCamera } from "react-icons/io5";
import UserMenu from "./UserMenu";

function MiddleHeader() {
  const [helpIconOpen, setHelpIconOpen] = useState(false);
  const handleHelpChange = () => {
    setHelpIconOpen(!helpIconOpen);
  };
  return (
    <div className="bg-[#fff7f9] py-5">
      <div className="w-9/10 mx-auto flex justify-between gap-10">
        <div className="flex gap-5 items-center">
          <div className="w-20">
            <Image
              src="https://i.ibb.co/Kpy32R9h/epicdeals.png"
              alt="EpicDeals"
              width={500}
              height={250}
              className="oject-contain"
            />
          </div>
          <div>
            <PiHeadsetFill
              onClick={handleHelpChange}
              className="cursor-pointer text-4xl text-[#ff8f9c]"
            />
          </div>
        </div>
        <div className="search md:flex relative w-full mx-10 hidden">
          <input
            type="text"
            placeholder="Search by keyword/product name/brands..."
            className="border border-black py-1 px-2 rounded-md outline-none w-full text-md"
          />
          <div className="searchIcon flex gap-2 absolute right-3 top-1/2 -translate-y-1/2">
            <IoCamera className="cursor-pointer text-xl hidden" />
            <IoSearchOutline className="cursor-pointer text-xl" />
          </div>
        </div>
        <div className="flex gap-5 items-center text-4xl ">
          <UserMenu />
          <div className="relative">
            <i>
              <CiHeart />
            </i>
            <div className="text-xs bg-[#ff8f9c] rounded-full w-4 h-4.5 flex justify-center items-center overflow-hidden absolute right-0 top-0 -translate-y-1/2 translate-x-1/2">
              <span className="text-white">0</span>
            </div>
          </div>
          <div className="relative">
            <i>
              <CiShoppingCart />
            </i>
            <div className="text-xs bg-[#ff8f9c] rounded-full w-4 h-4.5 flex justify-center items-center overflow-hidden absolute right-0 top-0 -translate-y-1/2 translate-x-1/2">
              <span className="text-white">0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MiddleHeader;
