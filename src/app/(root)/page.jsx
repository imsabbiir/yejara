import { Toaster } from "react-hot-toast";
import { Hero } from "@/components/Home/Hero";
import { TopCategories } from "@/components/Home/TopCategories";
import { PromoAndServices } from "@/components/Home/PromoAndServices";
import { DealOfTheDay } from "@/components/Home/DealOfTheDay";
import { ProductsList } from "@/components/Home/ProductsList";
import { FeaturedLists } from "@/components/Home/FeaturedLists";
export default function Home() {
  return (
    <div className="pb-14 w-full">
      <Hero />
      <TopCategories />
      <FeaturedLists />
      <DealOfTheDay />
      <ProductsList />
      <PromoAndServices />
      {/* Toaster */}
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: "#065f46",
              color: "white",
              border: "1px solid #b2f5ea",
              fontSize: "14px",
              padding: "16px 16px",
              borderRadius: "8px",
            },
            iconTheme: {
              primary: "#10b981",
              secondary: "#a7f3d0",
            },
          },
          error: {
            style: {
              background: "#b91c1c",
              color: "white",
              border: "1px solid #fecaca",
              fontSize: "14px",
              padding: "12px 16px",
              borderRadius: "8px",
            },
            iconTheme: {
              primary: "#f87171",
              secondary: "#fee2e2",
            },
          },
        }}
      />
    </div>
  );
}
