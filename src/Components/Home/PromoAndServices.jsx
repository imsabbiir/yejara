'use client'
import { motion } from "framer-motion";
import { Truck, Headphones, Shield, RefreshCw } from "lucide-react";
import promoImg from "@/media/promo-light.jpg";
import Image from "next/image";
import Link from "next/link";

const services = [
  { icon: Truck, title: "Worldwide Delivery", desc: "On orders over $100" },
  { icon: Headphones, title: "24/7 Support", desc: "Always here to help" },
  { icon: Shield, title: "Secure Payments", desc: "100% protected" },
  { icon: RefreshCw, title: "30-Day Returns", desc: "Easy & free" },
];

export function PromoAndServices() {
  return (
    <section className="w-full mx-auto px-6 pt-20 grid lg:grid-cols-3 gap-6">
      {/* Big promo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="lg:col-span-2 relative rounded-[2rem] overflow-hidden aspect-auto lg:aspect-[16:9]"
      >
        <Image src={promoImg} alt="Minimal home decor" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#17100b]/70 via-[#17100b]/30 to-transparent" />
        <div className="relative h-fit flex flex-col justify-end p-8 md:p-12 text-[#d9d3c7]">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#d5e43f] mb-3">Limited edition</p>
          <h3 className="font-fraunces text-4xl md:text-6xl mb-4 max-w-md font-fraunces">Light up<br />your space.</h3>
          <p className="text-[#d9d3c7]/80 mb-6 max-w-sm font-inter">Modern lighting fixtures from independent designers. Starting at $45.</p>
          <Link href="" className="w-fit bg-[#d9d3c7] text-[#17100b] rounded-full px-6 py-2.5 font-medium text-sm hover:bg-[#ff5b4e] hover:text-[#d9d3c7] transition-colors font-inter">
            Shop home
          </Link>
        </div>
      </motion.div>

      {/* Services list */}
      <div className="bg-white rounded-[2rem] p-8">
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#ff5b4e] mb-2">Our services</p>
        <h3 className="font-fraunces text-3xl mb-6 font-fraunces">Built for you.</h3>
        <div className="space-y-5">
          {services.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4 group">
              <div className="w-12 h-12 rounded-full bg-[#fcf6e9] flex items-center justify-center shrink-0 group-hover:bg-[#ff5b4e] group-hover:text-[#fff] transition-colors">
                <Icon className="w-5 h-5" />
              </div>
              <div className="font-inter">
                <p className="font-medium">{title}</p>
                <p className="text-xs text-[#6d635b]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
