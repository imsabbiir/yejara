import React from "react";
import BabyFabricShoes from "@/media/products/1.jpg";
import MenHoddie from "@/media/products/2.jpg";
import GirlTShirt from "@/media/products/3.jpg";
import ManJacket from "@/media/products/jacket-1.jpg";
import Clothes from "@/media/products/clothes-1.jpg";
import ProductHCCard from "../Cards/ProductHCCard";
const fetchTopProducts = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/top-rated`,
    {
      cache: "no-store",
    }
  );
  return res.json();
};
export default async function TopRated() {
  const products = await fetchTopProducts();
  return (
    <div className="">
      <h2 className="uppercase text-[#454545] font-semibold tracking-wider border-b border-[#9f9f9f] pb-2">
        Top Rated
      </h2>
      <div className="mt-5 flex flex-col gap-3">
        {products?.map((product) => {
          return (
            <ProductHCCard
              key={product?._id}
              porductId={product?._id}
              productImage={product?.images[0]}
              subCategory={product?.subCategory}
              name={product?.productName}
              regularPrice={product?.variants?.options[0]?.regularPrice}
              offerPrice={product?.variants?.options[0]?.offer?.offerPrice}
              categorySlug={product?.categorySlug}
              subCategorySlug={product?.subCategorySlug}
            />
          );
        })}
      </div>
    </div>
  );
}
