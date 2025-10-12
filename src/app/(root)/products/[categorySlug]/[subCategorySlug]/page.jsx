import React from "react";
import ProductVACard from "@/Components/Cards/ProductVACard";
import CategoryButtons from "@/Components/Catagory/CategoryButtons";
import Aside from "@/Components/Home/Aside";
import Banner1 from "@/media/products/banner-1.png";
import Image from "next/image";

const fetchProductsByCategory = async (categorySlug, subCategorySlug) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/category/${categorySlug}/${subCategorySlug}`,
    { cache: "no-store" }
  );
  return res.json();
};

const fetchCategory = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`, {
    cache: "no-store",
  });
  return res.json();
};

export default async function Page({ params }) {
  const { categorySlug, subCategorySlug } = await params;
  const products = await fetchProductsByCategory(categorySlug, subCategorySlug);
  const categories = await fetchCategory();

  const category = categories.find((category) => category.name === categorySlug);
  const subCategory = category?.subcategories.find(
    (subcategory) => subcategory.name === subCategorySlug
  );

  return (
    <div className="w-full">
      {/* Banner */}
      <div className="w-11/12 mx-auto relative rounded overflow-hidden">
        <Image
          src={subCategory?.banner?.image}
          alt={subCategory?.title || "subcategory banner"}
          width={2500}
          height={1000}
          unoptimized
          className="w-full h-56 sm:h-64 md:h-80 lg:h-96 object-cover object-center"
        />
        <div className="absolute top-0 left-0 h-full w-full bg-[#0000007e] px-4 sm:px-10 md:px-16 lg:px-20 flex flex-col justify-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white max-w-2xl">
            {subCategory?.title}
          </h2>
          <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium mt-3 sm:mt-5 text-[#a8a8a8]">
            {subCategory?.banner?.tagline}
          </span>
        </div>
      </div>

      {/* Category Buttons */}
      <div className="w-11/12 mx-auto mt-6 sm:mt-8 md:mt-10">
        <CategoryButtons />
      </div>

      {/* Main Content */}
      <div className="w-11/12 mx-auto mt-8 md:mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-10">
          {/* Sidebar */}
          <div className="lg:block col-span-1">
            <Aside image={Banner1} />
          </div>

          {/* Products */}
          <div className="col-span-1 lg:col-span-3 mb-10 lg:mb-20">
            <div className="grid grid-cols-1  md:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-7">
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
