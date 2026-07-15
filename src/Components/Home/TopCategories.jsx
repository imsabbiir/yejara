import { getCategories } from "@/lib/categories";
import CategoryCard from "../Cards/CategoryCard";

export async function TopCategories() {
  const categories = await getCategories();

  return (
    <section className="max-w-350 mx-auto px-6 py-12 border-y border-[#dfd6cb]">
      <div className="flex items-baseline justify-between mb-8">
        <div>
          <p className="text-xs tracking-[0.3em] text-[#5d5449]">EXPLORE</p>
          <h2 className="font-fraunces text-4xl md:text-5xl mt-2">
            Shop by <span className="italic">category</span>
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories?.slice(0, 8).map((cat, i) => (
          <CategoryCard key={cat._id} cat={cat} index={i} />
        ))}
      </div>
    </section>
  );
}
