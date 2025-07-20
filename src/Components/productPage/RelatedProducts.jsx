import React from "react";
import RelatedProductCard from "../Cards/RelatedProductCard";

export default async function RelatedProducts({
  categorySlug,
  subCategorySlug,
  productId,
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/related-products/${categorySlug}/${subCategorySlug}?excludeId=${productId}`,
    { cache: "no-store" }
  );

  const relatedProducts = await res.json();

  return (
    <div className="mt-6">
      {relatedProducts.map((product) => (
        <RelatedProductCard
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
      ))}
    </div>
  );
}
