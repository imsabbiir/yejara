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

  console.log(categories);

  return (
    <div className="w-9/10 mx-auto mt-10 grid grid-cols-4 gap-5">
      {categories?.map((category) => {
        return (
          <div
            key={category?._id}
            className="p-3 bg-[#fff] border border-[#999] rounded grid grid-cols-10"
          >
            <div className="h-14 w-14 bg-[rgba(0,0,0,0.3)] rounded col-span-3">
              <Image
                src={category.image}
                alt={category.name}
                width={500}
                height={500}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="col-span-7 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <h2 className="text-sm">{category.title}</h2>
              </div>
              <Link href={category.pageLink} className="text-sm text-red-400">
                Show All
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
