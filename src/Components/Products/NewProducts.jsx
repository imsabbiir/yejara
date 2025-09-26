import React from "react";
import ProductVACard from "../Cards/ProductVACard";
const fetchProducts = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, {
    cache: "no-store",
  });
  const data = await res.json();
  return data.products;
};
export async function ProductList() {
  const products = await fetchProducts();

  return (
    <div className="mt-10">
      <h2 className="uppercase text-[#454545] font-semibold tracking-wider border-b border-[#9f9f9f] pb-2">
        New Products
      </h2>
      <div className="mt-5 grid grid-cols-4 gap-7">
        {products?.map((product) => {
          return (
            <ProductVACard
              key={product?._id}
              productId={product?._id}
              productImage={product.images[0]}
              category={product?.category}
              ratting={product?.rating}
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
