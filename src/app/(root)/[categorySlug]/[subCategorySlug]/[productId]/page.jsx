import ProductDetails from "@/Components/productPage/ProductDetails";
import ProductSlider from "@/Components/productPage/ProductSlider";
import RelatedProducts from "@/Components/productPage/RelatedProducts";
import React from "react";

const fetchProduct = async (id) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) throw new Error("Failed to fetch product");

  return res.json();
};

export default async function page({ params }) {
  const { categorySlug, subCategorySlug, productId } = params;
  const product = await fetchProduct(productId);

  return (
    <div className="w-9/10 mx-auto">
      <div className="p-6 grid grid-cols-2 gap-10">
        <ProductSlider images={product.images} />
        <ProductDetails product={product} />
      </div>

      <div className="my-16 grid grid-cols-3">
        <div className="col-span-2"></div>
        <div className="col-span-1">
          <h2 className="text-3xl font-semibold text-[#333]">Related Products</h2>
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
