"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { CiShoppingCart, CiHeart } from "react-icons/ci";
import { IoSearchOutline, IoCamera } from "react-icons/io5";
import UserMenu from "./UserMenu";
import Link from "next/link";
import Logo from "@/media/logo.png";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
function MiddleHeader() {
  const { cart } = useCart();
  const { wishlist } = useWishlist();

  return (
    <div className="bg-[#fff7f9] py-5">
      <div className="w-9/10 mx-auto flex justify-between gap-10">
        <div className="flex gap-5 items-center">
          <Link href={"/"} className="w-36">
            <Image
              src={Logo}
              alt="EpicDeals"
              width={1500}
              height={1500}
              className="object-contain"
            />
          </Link>
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

        <div className="flex gap-5 items-center text-4xl">
          <UserMenu />

          {/* Wishlist Icon */}
          <div className="relative">
            <Link href={"/wishlists"}>
              <CiHeart />
            </Link>
            
              <div className="absolute -top-2 -right-2 bg-[#ff8f9c] text-white text-[10px] w-4 h-5 flex justify-center items-center rounded-full">
                {wishlist.length}
              </div>
            
          </div>

          {/* Cart Icon */}
          <div className="relative">
            <Link href={"/cart"}>
              <CiShoppingCart />
            </Link>

              <div className="absolute -top-2 -right-2 bg-[#ff8f9c] text-white text-xs w-5 h-5 flex justify-center items-center rounded-full">
                {cart.length}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MiddleHeader;
