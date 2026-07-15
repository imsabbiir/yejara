import {
  getNewArrivals,
  getTopRatedProducts,
  getTrendingProducts,
} from "@/lib/products";
import Link from "next/link";
import Image from "next/image";

export async function FeaturedLists() {
  // Fix 1: Fetch data in parallel instead of sequentially blocking the thread
  const [newArrivals, topRated, trending] = await Promise.all([
    getNewArrivals(),
    getTopRatedProducts(),
    getTrendingProducts(),
  ]);

  const lists = [
    { title: "New Arrivals", items: newArrivals?.slice(0, 5) || [] },
    { title: "Top Rated", items: topRated?.slice(0, 5) || [] },
    { title: "Trending", items: trending?.slice(0, 5) || [] },
  ];

  return (
    <section className="container mx-auto px-6 py-16">
      <div className="rounded-4xl bg-[#F8F1E1] p-6 md:p-10">
        <div className="grid md:grid-cols-3 gap-8">
          {lists.map((list) => (
            <div key={list.title}>
              <div className="flex items-center justify-between mb-5 border-b border-[#dfd6cb]">
                <h3 className="font-fraunces text-xl tracking-wide uppercase">
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
                    {/* Fix 2: Next.js Image component handles compression and layout sizing */}
                    <div className="size-16 rounded-xl bg-[#FCF7EB] overflow-hidden shrink-0 relative">
                      <Image
                        src={item.images[0]}
                        alt={item.productName}
                        fill
                        sizes="64px"
                        className="object-cover group-hover:scale-105 transition"
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
