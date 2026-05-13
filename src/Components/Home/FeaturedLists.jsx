import {
  getNewArrivals,
  getTopRatedProducts,
  getTrendingProducts,
} from "@/lib/products";
import Link from "next/link";
import { Suspense } from "react";
import ProductSectionSkeleton from "@/components/Skeletons/ProductSectionSkeleton";


export async function FeaturedLists() {
  const newArrivals = await getNewArrivals();
  const topRated = await getTopRatedProducts();
  const trending = await getTrendingProducts();
  const lists = [
    { title: "New Arrivals", items: newArrivals },
    { title: "Top Rated", items: topRated },
    { title: "Trending", items: trending },
  ];
  return (
    <section className="container mx-auto px-6 py-16">
      <div className="rounded-[2rem] bg-[#F8F1E1] p-6 md:p-10">
        <div className="grid md:grid-cols-3 gap-8">
          {lists.map((list) => (
            <div key={list.title}>
              <Suspense fallback={<ProductSectionSkeleton />}>
                <div className="flex items-center justify-between mb-5 border-b border-[#dfd6cb]">
                  <h3 className="font-fraunces text-xl tracking-wide uppercase ">
                    {list.title}
                  </h3>
                  
                </div>
                <ul className="space-y-3">
                  {list.items.map((item) => (
                    <Link
                      href={`/product/${item._id}`}
                      key={item._id}
                      className="group flex items-center gap-3 p-2 rounded-2xl hover:bg-[#FCF7EB] transition"
                    >
                      <div className="size-16 rounded-xl bg-[#FCF7EB] overflow-hidden flex-shrink-0">
                        <img
                          src={item.images[0]}
                          alt={item.productName}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">
                          {item.productName}
                        </p>
                        <p className="text-xs text-[#6A6154]">
                          {item.subCategory}
                        </p>
                        <div className="flex items-baseline gap-2 mt-1">
                          {item.variants?.options?.offer?.offerStatus ? (
                            <>
                              <span className="text-xs text-[#6A6154] line-through">
                                {item.variants?.options?.regularPrice}
                              </span>
                              <span className="text-sm font-semibold font-fraunces">
                                {item.variants?.options?.offer?.offerPrice}
                              </span>
                            </>
                          ) : (
                            <span className="text-sm font-semibold font-fraunces">
                              {item.variants?.options?.regularPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </ul>
              </Suspense>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
