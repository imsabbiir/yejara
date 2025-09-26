"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { PiHeadsetFill } from "react-icons/pi";
import { CiShoppingCart, CiHeart } from "react-icons/ci";
import { IoSearchOutline, IoCamera } from "react-icons/io5";
import UserMenu from "./UserMenu";
import Link from "next/link";
import Logo from "@/media/logo.png"
function MiddleHeader() {
  const [helpIconOpen, setHelpIconOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [loveCount, setLoveCount] = useState(0);

  const fetchCounts = async () => {
    try {
      const cartRes = await fetch("/api/cart-items/count");
      const cartData = await cartRes.json();
      setCartCount(cartData.count);

      const wishRes = await fetch("/api/wishlists/count");
      const wishData = await wishRes.json();
      setLoveCount(wishData.count);
    } catch (error) {
      console.error("Failed to fetch counts:", error);
    }
  };

  useEffect(() => {
    fetchCounts();

    const onCartUpdated = () => fetchCounts();
    const onWishlistUpdated = () => fetchCounts();

    window.addEventListener("cartUpdated", onCartUpdated);
    window.addEventListener("wishlistUpdated", onWishlistUpdated);

    return () => {
      window.removeEventListener("cartUpdated", onCartUpdated);
      window.removeEventListener("wishlistUpdated", onWishlistUpdated);
    };
  }, []);

  const handleHelpChange = () => {
    setHelpIconOpen(!helpIconOpen);
  };

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
              className="oject-contain"
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
        <div className="flex gap-5 items-center text-4xl ">
          <UserMenu />
          <div className="relative">
            <Link href={"/user/wishlists"}>
              <CiHeart />
            </Link>
            {loveCount ? (
              <div className="text-xs bg-[#ff8f9c] rounded-full w-4 h-4.5 flex justify-center items-center overflow-hidden absolute right-0 top-0 -translate-y-1/2 translate-x-1/2">
                <span className="text-white">{loveCount}</span>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="relative">
            <Link href={"/user/add-to-cart"}>
              <CiShoppingCart />
            </Link>
            {cartCount ? (
              <div className="text-xs bg-[#ff8f9c] rounded-full w-4 h-4.5 flex justify-center items-center overflow-hidden absolute right-0 top-0 -translate-y-1/2 translate-x-1/2">
                <span className="text-white">{cartCount}</span>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MiddleHeader;
