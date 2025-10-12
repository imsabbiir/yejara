import React from "react";
import Image from "next/image";
import Link from "next/link";

const fetchcategories = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`,
    {
      cache: "no-store",
    }
  );
  return res.json();
};

export default async function CategoryButtons() {
  const categories = await fetchcategories();

  return (
    <div className="w-[90%] mx-auto mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {categories?.map((category) => {
        return (
          <div
            key={category?._id}
            className="p-3 bg-white border border-[#ddd] rounded-lg grid grid-cols-10 gap-3 hover:shadow-md transition-all"
          >
            {/* Image */}
            <div className="h-14 w-14 bg-[rgba(0,0,0,0.05)] rounded col-span-3 flex items-center justify-center overflow-hidden">
              <Image
                src={category.image}
                alt={category.name}
                width={500}
                height={500}
                className="object-cover w-full h-full"
              />
            </div>

            {/* Content */}
            <div className="col-span-7 flex flex-col justify-between">
              <h2 className="text-sm font-medium text-[#444] truncate">
                {category.title}
              </h2>
              <Link
                href={`/products/${category.pageLink}`}
                className="text-xs sm:text-sm text-red-500 hover:underline mt-1"
              >
                Show All
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
