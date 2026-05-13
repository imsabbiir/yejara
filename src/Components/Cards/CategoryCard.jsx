import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
function CategoryCard({ cat, index }) {
  return (
    <Link
      key={cat._id}
      href={`/category/${cat.name}`}
      className="group relative aspect-[4/5] rounded-3xl overflow-hidden shadow"
      style={{ backgroundColor: `${cat?.tone}` }}
    >
      <Image
        src={cat.image}
        alt={cat.name}
        width={2500}
        height={2500}
        className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-500"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-[#180f09]/60 via-[#180f09]/10 to-transparent" />
      <div className="absolute top-4 left-4 text-xs font-medium px-2.5 py-1 rounded-full bg-[#fcf5e9]/90 text-[#180f09]">
        0{index + 1}
      </div>
      <div className="absolute top-4 right-4 size-9 rounded-full bg-[#fcf5e9]/90 grid place-items-center opacity-0 group-hover:opacity-100 transition">
        <ArrowUpRight className="size-4" />
      </div>
      <div className="absolute bottom-5 left-5 right-5 text-[#fcf5e9]">
        <h3 className="font-fraunces text-2xl">{cat.title}</h3>        
      </div>
    </Link>
  );
}

export default CategoryCard;
