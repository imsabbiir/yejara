"use client";
import React, { useEffect, useState } from "react";
import footer from "@/media/footer.jpg";
import Link from "next/link";
import { CiMail } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";
import { BsTelephone } from "react-icons/bs";
import Image from "next/image";
import payment from "@/media/payment.png";
function Footer() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div
      className="w-full pt-10 pb-50 footer bg-cover bg-center"
      style={{ backgroundImage: `url(${footer.src})` }}
    >
      <div className="w-9/10 mx-auto grid grid-cols-5 gap-8 pb-10 border-b border-[#555555]">
        {/* Categories */}
        <div className="col-span-1">
          <h2 className="uppercase w-fit pb-2 text-white font-semibold text-lg relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-1/2 after:h-0.5 after:bg-red-400">
            Categories
          </h2>
          <ul className="mt-5">
            {categories?.map((category) => (
              <li key={category._id} className="text-[#a9a9a9] my-1">
                <Link href={`/category/${category.slug || category._id}`}>
                  {category.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Sub-Categories */}
        <div className="col-span-3">
          <h2 className="uppercase w-fit pb-2 text-white font-semibold text-lg relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-1/2 after:h-0.5 after:bg-red-400">
            Sub-Categories
          </h2>
          <ul className="mt-5 grid grid-cols-3">
            {categories?.map((category) =>
              category?.subcategories?.map((subcategory, index) => (
                <li
                  key={`${category._id}-${index}`}
                  className="text-[#a9a9a9] my-1"
                >
                  <Link
                    href={`/subcategory/${
                      subcategory.slug || subcategory.title
                    }`}
                  >
                    {subcategory.title}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Reserved Space */}
        <div className="col-span-1">
          <h2 className="uppercase w-fit pb-2 text-white font-semibold text-lg relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-1/2 after:h-0.5 after:bg-red-400">
            contact
          </h2>
          <div className="mt-5 flex flex-col gap-3">
            <div className="flex gap-3 text-[#a9a9a9]">
              <IoLocationOutline className="text-5xl leading-0 h-fit" />
              <address className="text-sm">
                Birabo, Rupganj, Narayanganj, Dhaka, Bangladesh
              </address>
            </div>
            <div className="flex gap-3 items-center text-[#a9a9a9]">
              <BsTelephone className="leading-0 h-fit" />
              <address>01326650567</address>
            </div>
            <div className="flex gap-3 items-center text-[#a9a9a9]">
              <CiMail className="text-xl leading-0 h-fit" />
              <address>imsabbiir@gmail.com</address>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-10">
        <div className="flex flex-col gap-3 items-center justify-center">
          <Image
            src={payment}
            alt="payment method"
            width={2500}
            height={250}
            className="w-1/4"
          />
          <span className="text-[#757575] capitalize">Copyright Sabbir All rights Reserved</span>
        </div>
      </div>
    </div>
  );
}

export default Footer;
