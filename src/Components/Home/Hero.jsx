'use client'
import { motion } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import heroModel from "@/media/model.jpg";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative max-full mx-auto px-6 pb-24">
      <div className="grid lg:grid-cols-12 gap-8 items-center">
        {/* Left text */}
        <div className="lg:col-span-7 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 text-[#5e534a] mb-8 text-xs uppercase tracking-[0.25em] font-mono "
          >
            <span className="w-8 h-px bg-[#5e534a]" />
            Spring / Summer Edit · 2026
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-fraunces font-medium text-[clamp(3.5rem,9vw,9rem)] leading-[0.85] font-fraunces"
          >
            Wear the<br />
            <span className="italic text-[#ff5b4e] ">unexpected.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center gap-6"
          >
            <a
              href="#"
              className="group inline-flex items-center gap-3 bg-[#17100b] text-[#d9d3c7] rounded-full pl-6 pr-2 py-2 text-sm font-medium hover:bg-[#ff5b4e] transition-colors"
            >
              Shop the collection
              <span className="w-10 h-10 rounded-full bg-[#d9d3c7] text-[#17100b] flex items-center justify-center group-hover:rotate-45 transition-transform">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </a>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex -space-x-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-[#fcf6e9]"
                    style={{
                      background: `linear-gradient(135deg, oklch(0.7 0.2 ${i * 60}), oklch(0.85 0.15 ${i * 60 + 30}))`,
                    }}
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-[#ff5b4e] text-[#ff5b4e]" />
                  ))}
                </div>
                <p className="text-xs text-[#5e534a]">12k+ happy customers</p>
              </div>
            </div>
          </motion.div>

          {/* sticker */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: -12 }}
            transition={{ duration: 0.7, delay: 0.6, type: "spring" }}
            className="hidden md:flex absolute right-0 top-12 w-32 h-32 rounded-full bg-[#d5e43f] items-center justify-center text-center"
          >
            <div className="font-fraunces text-[#17100b] leading-tight">
              <div className="text-3xl font-bold font-fraunces">30%</div>
              <div className="text-[10px] uppercase tracking-widest font-inter">off this week</div>
            </div>
          </motion.div>
        </div>

        {/* Right image */}
        <div className="lg:col-span-5 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative overflow-hidden rounded-[2rem] "
          >
            <Image
              src={heroModel}
              alt="Model wearing modern sunglasses"
              width={1280}
              height={1280}
              className="w-full h-[600px] object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-[rgba(255,248,235)]/90 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-[#5e534a]">Featured</p>
                <p className="font-fraunces text-lg">Sunset Aviator</p>
              </div>
              <div className="text-right">
                <p className="font-fraunces text-2xl">$89</p>
                <p className="text-xs text-[#5e534a] line-through">$120</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
