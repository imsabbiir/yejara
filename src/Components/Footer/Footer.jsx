import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/media/logo2.png";
const fetchCategory = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`,
      {
        cache: "no-store",
      },
    );

    return await response.json();
  } catch (error) {
    console.log(error);
    return [];
  }
};

export async function SiteFooter() {
  const categories = await fetchCategory();

  return (
    <footer className="bg-[#17100b] text-[#fcf6e9]/80">
      <div className="w-9/10 mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        {/* Logo */}
        <div>
          <Link href={"/"}>
            <Image
              src={logo}
              alt="yejara"
              width={2500}
              height={2500}
              className="h-8 w-fit object-cover"
            />
          </Link>

          <p className="text-sm text-cream/60 max-w-xs mt-3">
            Fewer things, made carefully. Each piece is cut, knit, and finished
            by hands we know.
          </p>
        </div>

        <div>
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-cream mb-4">
            Category
          </p>

          <ul className="space-y-2 text-sm">
            {categories?.map((category, index) => (
              <li key={index}>
                <Link
                  href={`/products/${category?.pageLink}`}
                  className="hover:text-coral transition-colors"
                >
                  {category?.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer Columns */}
        {[
          {
            title: "Company",
            links: ["About", "Stores", "Sustainability", "Press"],
          },

          {
            title: "Help",
            links: ["Shipping", "Returns", "Size guide", "Contact"],
          },
        ].map((col) => (
          <div key={col.title}>
            <p className="text-xs font-mono uppercase tracking-[0.25em] text-cream mb-4">
              {col.title}
            </p>

            <ul className="space-y-2 text-sm">
              {col.links?.map((l, index) => (
                <li key={index}>
                  <Link
                    href={``}
                    className="hover:text-coral transition-colors"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-cream/10">
        <div className="max-w-350 mx-auto px-6 py-6 flex flex-wrap justify-between gap-4 text-xs font-mono text-cream/50">
          <p>© 2026 yejara — all rights reserved.</p>

          <p>Crafted with care.</p>
        </div>
      </div>
    </footer>
  );
}
