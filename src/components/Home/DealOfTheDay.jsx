"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import dealImg from "@/media/deal-product.jpg";
import Image from "next/image";

function useCountdown(target) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target - now);
  const h = Math.floor(diff / 3.6e6);
  const m = Math.floor((diff % 3.6e6) / 6e4);
  const s = Math.floor((diff % 6e4) / 1000);
  return { h, m, s };
}

export function DealOfTheDay() {
  const { h, m, s } = useCountdown(Date.now() + 1000 * 60 * 60 * 8);
  const stock = 70;
  const total = 100;
  const pct = (stock / total) * 100;

  return (
    <section className="max-w-350 mx-auto px-6 py-16">
      <div className="relative rounded-[2.5rem] overflow-hidden bg-[#17100b] text-[#d9d3c7] p-8 md:p-12 lg:p-16 isolation-auto">
        {/* Glow blobs - optimized opacity/size to prevent heavy blending layers */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#ff5b4e]/20 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[rgb(106,68,168)]/20 blur-[100px] pointer-events-none" />

        <div className="relative grid lg:grid-cols-2 gap-12 items-center">
          {/* Fix 1: Subtler animations to cut down high TBT/Layout execution */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="relative aspect-square rounded-3xl overflow-hidden"
          >
            {/* Fix 2: Optimized Next.js Image component */}
            <Image
              src={dealImg}
              alt="Featured deal product"
              width={600}
              height={600}
              sizes="(max-width: 1024px) 100vw, 45vw"
              quality={85}
              className="w-full h-full object-cover"
            />
          </motion.div>

          <div>
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#ff5b4e] mb-4">
              ⚡ Deal of the day
            </p>
            <h2 className="font-fraunces text-5xl md:text-6xl font-medium mb-4">
              Run faster.
              <br />
              Pay less.
            </h2>
            <p className="text-[#d9d3c7]/70 mb-6 max-w-md">
              Limited stock on our best-selling sneakers. Featherweight, all-day
              comfort, and built to outlast every season.
            </p>

            <div className="flex items-center gap-2 mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-[#ff5b4e] text-[#ff5b4e]"
                />
              ))}
              <span className="text-sm text-[#d9d3c7]/60 ml-2">
                (2,341 reviews)
              </span>
            </div>

            <div className="flex items-baseline gap-4 mb-8">
              <span className="font-fraunces text-5xl text-[#ff5b4e]">
                $150
              </span>
              <span className="text-xl text-[#d9d3c7]/40 line-through">
                $200
              </span>
              <span className="bg-[#ff5b4e] text-[#d9d3c7] text-xs font-mono px-2 py-1 rounded-full">
                −25%
              </span>
            </div>

            {/* Countdown layout */}
            <div className="flex gap-3 mb-6">
              {[
                { l: "Hours", v: h },
                { l: "Min", v: m },
                { l: "Sec", v: s },
              ].map((t) => (
                <div
                  key={t.l}
                  className="bg-[#d9d3c7]/10 backdrop-blur rounded-2xl px-5 py-3 text-center min-w-20"
                >
                  <div className="font-fraunces text-3xl font-semibold tabular-nums">
                    {String(t.v).padStart(2, "0")}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-[#d9d3c7]/60 font-mono">
                    {t.l}
                  </div>
                </div>
              ))}
            </div>

            {/* Stock progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-[#d9d3c7]/60">Sold: {stock}</span>
                <span className="text-[#ff5b4e]">
                  Only {total - stock} left
                </span>
              </div>
              <div className="h-2 bg-[#d9d3c7]/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-linear-to-r from-[#ff5b4e] to-[#d5e43f]"
                />
              </div>
            </div>

            <button className="group inline-flex items-center gap-3 bg-[#ff5b4e] text-[#d9d3c7] rounded-full pl-6 pr-2 py-2 font-medium hover:bg-[#d9d3c7] hover:text-[#17100b] transition-colors">
              Add to cart
              <span className="w-10 h-10 rounded-full bg-[#d9d3c7] text-[#17100b] flex items-center justify-center group-hover:bg-[#ff5b4e] group-hover:text-[#d9d3c7] transition-colors">
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
