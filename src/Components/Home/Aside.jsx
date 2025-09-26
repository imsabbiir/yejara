import React from "react";
import SubCategories from "../Catagory/SubCategories";
import SideBarProduct from "../Products/SideBarProduct";
import FilterProducts from "../FilterProducts/FilterProducts";

import Image from "next/image";
function Aside({ image }) {
  return (
    <>
      <Image
        src={image}
        alt="Flash Deal"
        width={1000}
        height={1000}
        className="mt-10 cursor-pointer"
      />
      <SideBarProduct />
      <div className="sticky top-5">
        <SubCategories />
        <FilterProducts />
      </div>
    </>
  );
}

export default Aside;
