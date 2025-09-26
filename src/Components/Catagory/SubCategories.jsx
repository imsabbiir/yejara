"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

function SubCategories() {
  const [categories, setCategories] = useState([]);
  const [openIndex, setOpenIndex] = useState(null); // track open category

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data);
    };
    fetchData();
  }, []);

  return (
    <aside>
      <div className="p-5 bg-[#fff] border border-[#999] rounded">
        <h2 className="uppercase text-lg font-semibold leading-1 tracking-wider text-[#454545] pb-7 pt-2">
          Category
        </h2>

        {categories?.map((category, index) => {
          const isOpen = openIndex === index;

          return (
            <div key={category._id} className="">
              <div
                className="flex items-center justify-between cursor-pointer font-medium text-base text-[#787878] py-1"
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <button className="cursor-pointer">{category.title}</button>
                <span className="text-xs">
                  {isOpen ? <FaMinus /> : <FaPlus />}
                </span>
              </div>

              <div
                className={`overflow-hidden transition-all duration-500 ease-initial ${
                  isOpen ? "max-h-40" : "max-h-0"
                }`}
              >
                <ul className="flex flex-col gap-2 py-3 border-t border-[#757575]">
                  {category?.subcategories?.map((subcategory) => (
                    <Link href={`/products/${subcategory?.pageLink}`} key={subcategory?.name}>
                      <li className="text-sm font-medium text-[#787878]">
                        {subcategory?.title}
                      </li>
                    </Link>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export default SubCategories;
