import CustomerReview from "@/Components/productPage/CustomerReview";
import ProductDetails from "@/Components/productPage/ProductDetails";
import ProductSlider from "@/Components/productPage/ProductSlider";
import RelatedProducts from "@/Components/productPage/RelatedProducts";
import ReviewLists from "@/Components/productPage/ReviewLists";
import React from "react";

const fetchProduct = async (id) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to fetch product");

  return res.json();
};

export default async function Page({ params }) {
  const { categorySlug, subCategorySlug, productId } = params;
  const product = await fetchProduct(productId);

  return (
    <div className="w-11/12 mx-auto">
      {/* Product Top Section */}
      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
        <ProductSlider images={product.images} />
        <ProductDetails product={product} />
      </div>

      {/* Reviews & Related Products */}
      <div className="my-10 sm:my-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Reviews */}
        <div className="lg:col-span-2">
          <CustomerReview productId={productId} />
          <ReviewLists productId={productId} />
        </div>

        {/* Right Side: Related Products */}
        <div className="lg:col-span-1">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#333] mb-4">
            Related Products
          </h2>
          <RelatedProducts
            categorySlug={categorySlug}
            subCategorySlug={subCategorySlug}
            productId={productId}
          />
        </div>
      </div>
    </div>
  );
}
