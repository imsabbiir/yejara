import ProductVACard from "@/Components/Cards/ProductVACard";
import CategoryButtons from "@/Components/Catagory/CategoryButtons";
import Aside from "@/Components/Home/Aside";
import Image from "next/image";
import Banner1 from "@/media/products/banner-1.png";
const fetchProductsByCategory = async (categorySlug) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/category/${categorySlug}`,
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
export default async function CategoryPage({ params }) {
  const { categorySlug } = await params;
  const categoryProducts = await fetchProductsByCategory(categorySlug);
  const categories = await fetchCategory();

  const category = categories.find((category)=> category.name === categorySlug);
  return (
    <div className="w-full">
      <div className="w-9/10 mx-auto relative rounded overflow-hidden">
        <Image
          src={category?.banner?.image}
          alt="fashion and apparel"
          width={2500}
          height={1000}
          unoptimized
          className="w-full h-96 object-cover object-center"
        />
        <div className="absolute top-0 left-0 h-full w-full bg-[#0000007e] px-20 flex flex-col justify-center">
          <h2 className="text-7xl font-bold text-white w-1/2">{category?.title}</h2>
          <span className="text-2xl font-medium mt-5 text-[#a8a8a8]">{category?.banner?.tagline}</span>
        </div>
      </div>
      <CategoryButtons />
      <div className="w-9/10 mx-auto mt-10">
        <div className="grid grid-cols-4 gap-10">
          <div className="col-span-1">
            <Aside image={Banner1}/>
          </div>
          <div className="col-span-3 mb-20">
            <div className="grid grid-cols-4 gap-7">
              {categoryProducts?.map((product) => (
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
