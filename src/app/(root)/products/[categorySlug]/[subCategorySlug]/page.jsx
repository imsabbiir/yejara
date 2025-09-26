import React from "react";
import ProductVACard from "@/Components/Cards/ProductVACard";
import CategoryButtons from "@/Components/Catagory/CategoryButtons";
import Aside from "@/Components/Home/Aside";
import Banner1 from "@/media/products/banner-1.png";
import Image from "next/image";
const fetchProductsByCategory = async (categorySlug, subCategorySlug) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/category/${categorySlug}/${subCategorySlug}`,
    {
      cache: "no-store",
    }
  );
  return res.json();
};
const fetchCategory = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`,
    {
      cache: "no-store",
    }
  );
  return res.json();
};
export default async function page({ params }) {
  const { categorySlug, subCategorySlug } = await params;
  const products = await fetchProductsByCategory(categorySlug, subCategorySlug);
  const categories = await fetchCategory();

  const category = categories.find((category)=> category.name === categorySlug);
  const subCategory = category?.subcategories.find((subcategory)=>subcategory.name === subCategorySlug);
  return (
    <div className="w-full">
      <div className="w-9/10 mx-auto relative rounded overflow-hidden">
        <Image
          src={subCategory?.banner?.image}
          alt={subCategory?.title}
          width={2500}
          height={1000}
          unoptimized
          className="w-full h-96 object-cover object-center"
        />
        <div className="absolute top-0 left-0 h-full w-full bg-[#0000007e] px-20 flex flex-col justify-center">
          <h2 className="text-7xl font-bold text-white w-1/2">
            {subCategory?.title}
          </h2>
          <span className="text-2xl font-medium mt-5 text-[#a8a8a8]">
            {subCategory?.banner?.tagline}
          </span>
        </div>
      </div>
      <CategoryButtons />
      <div className="w-9/10 mx-auto mt-10">
        <div className="grid grid-cols-4 gap-10">
          <div className="col-span-1">
            <Aside image={Banner1}/>
          </div>
          <div className="col-span-3 mb-20">
            <div className="grid grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductVACard
                  key={product._id}
                  productId={product._id}
                  productImage={product.images?.[0] || "/default-product.png"}
                  name={product.productName}
                  regularPrice={
                    product.variants?.options?.[0]?.regularPrice || "N/A"
                  }
                  offerPrice={
                    product.variants?.options?.[0]?.offer?.offerPrice || null
                  }
                  category={product.category}
                  ratting={product?.rating}
                  categorySlug={product.categorySlug}
                  subCategorySlug={product.subCategorySlug}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
