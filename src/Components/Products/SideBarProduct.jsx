import React from "react";
import ProductHRCard from "../Cards/ProductHRCard";
const fetchProductsBySellers = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/best-sellers`,
    {
      cache: "no-store",
    }
  );
  return res.json();
};
export default async function SideBarProduct() {
  const products = await fetchProductsBySellers();
  return (
    <div className="mt-10">
      <h2 className="uppercase text-[#454545] font-semibold tracking-wider">
        Best Sellers
      </h2>
      <div className="mt-5 flex flex-col gap-3">
        {products?.map((product) => {
          return (
            <ProductHRCard
              key={product?._id}
              porductId={product?._id}
              productImage={product?.images[0]}
              ratting={product?.rating}
              name={product?.productName}
              categorySlug={product?.categorySlug}
              subCategorySlug={product?.subCategorySlug}
              regularPrice={product?.variants?.options[0]?.regularPrice}
              offerPrice={product?.variants?.options[0]?.offer?.offerPrice}
            />
          );
        })}
      </div>
    </div>
  );
}
