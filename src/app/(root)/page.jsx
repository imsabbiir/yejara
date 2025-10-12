
import CategoryButtons from "@/Components/Catagory/CategoryButtons";
import Banner from "@/Components/Banner";
import Aside from "@/Components/Home/Aside";
import NewArrivals from "@/Components/Products/NewArrivals";
import SingleProductSlider from "@/Components/Products/SingleProductSlider";

import TopRated from "@/Components/Products/TopRated";
import Trending from "@/Components/Products/Trending";

import Banner2 from "@/media/products/banner-2.png";
import me from "@/media/me.png";
import cutation from "@/media/cutation.png";
import SummerDiscount from "@/media/products/cta-banner.jpg";
import { LuShip } from "react-icons/lu";
import { IoRocketOutline } from "react-icons/io5";
import { BsTelephone } from "react-icons/bs";
import { IoArrowUndoOutline } from "react-icons/io5";
import { IoTicketOutline } from "react-icons/io5";
import Image from "next/image";
import ProductList from "@/Components/Products/NewProducts";
import { Toaster } from "react-hot-toast";
import Banner1 from "@/media/products/banner-1.png";
export default function Home() {
  return (
    <div className="pb-14 w-full">
      <Banner />
      <CategoryButtons />

      <div className="w-[90%] mx-auto mt-10">
        {/* Left Aside + Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Aside */}
          <div className="col-span-1">
            <Aside image={Banner1} />
          </div>

          {/* Main */}
          <div className="col-span-1 lg:col-span-3">
            {/* New Arrivals / Trending / TopRated */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <NewArrivals />
              <Trending />
              <TopRated />
            </div>

            <SingleProductSlider />
            <ProductList />

            <Image
              src={Banner2}
              alt="Flash Deal"
              width={1500}
              height={1500}
              className="mt-10 cursor-pointer w-full object-cover"
            />
          </div>
        </div>

        {/* Founder / Discount / Services */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 mt-10">
          {/* Founder */}
          <div className="col-span-1">
            <h2 className="uppercase text-[#454545] font-semibold tracking-wider border-b border-[#9f9f9f] pb-2">
              Founder’s Note
            </h2>
            <div className="bg-white flex flex-col items-center p-7 border border-[#f0f0f0] rounded-lg mt-5">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-red-200">
                <Image
                  src={me}
                  alt=""
                  width={500}
                  height={500}
                  className="w-full object-cover"
                />
              </div>
              <h2 className="text-lg font-semibold text-[#656565] uppercase mt-3">
                Sabbir Ahmed
              </h2>
              <span className="uppercase text-[#656565] mb-8">
                CEO & Founder Invision
              </span>
              <Image
                src={cutation}
                alt=""
                width={500}
                height={500}
                className="w-8 mb-5"
              />
              <p className="text-sm text-[#787878] text-justify">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>
            </div>
          </div>

          {/* Discount Banner */}
          <div className="col-span-1 lg:col-span-2 rounded-2xl overflow-hidden relative bg-amber-700">
            <Image
              src={SummerDiscount}
              alt=""
              width={1500}
              height={1500}
              className="w-full h-full object-cover"
            />
            <div className="absolute flex flex-col justify-center items-center gap-3 top-1/2 -translate-y-1/2 left-1/2 w-3/4 sm:w-1/2 h-2/3 -translate-x-1/2 bg-[rgba(256,256,256,.8)] rounded-lg p-5">
              <span className="uppercase px-3 py-2 rounded-lg text-lg font-semibold text-white bg-[#111111]">
                25% discount
              </span>
              <h2 className="capitalize text-xl sm:text-2xl font-bold text-[#454545] w-full text-center">
                summer collection
              </h2>
              <span className="capitalize text-[#787878] font-light">
                Starting @ $10
              </span>
              <span className="uppercase text-[#787878] font-bold text-lg">
                Shop Now
              </span>
            </div>
          </div>

          {/* Services */}
          <div className="col-span-1">
            <h2 className="uppercase text-[#454545] font-semibold tracking-wider border-b border-[#9f9f9f] pb-2">
              Our Services
            </h2>
            <div className="bg-white flex flex-col gap-7 p-7 border border-[#f0f0f0] rounded-lg mt-5">
              <div className="flex items-center gap-3 group cursor-pointer">
                <LuShip className="text-3xl text-red-300 group-hover:text-[#454545]" />
                <div>
                  <h2 className=" font-semibold text-[#656565] capitalize">
                    Worldwide Delivery
                  </h2>
                  <span className="text-[#454545] capitalize text-sm">
                    For order over $100
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 group cursor-pointer">
                <IoRocketOutline className="text-3xl text-red-300 group-hover:text-[#454545]" />
                <div>
                  <h2 className="font-semibold text-[#656565] capitalize">
                    Next Day Delivery
                  </h2>
                  <span className="text-[#454545] capitalize text-sm">
                    Bangladesh Orders Only
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 group cursor-pointer">
                <BsTelephone className="text-3xl text-red-300 group-hover:text-[#454545]" />
                <div>
                  <h2 className="font-semibold text-[#656565] capitalize">
                    Best Online support
                  </h2>
                  <span className="text-[#454545] capitalize text-sm">
                    hours: 8am - 11pm
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 group cursor-pointer">
                <IoArrowUndoOutline className="text-3xl text-red-300 group-hover:text-[#454545]" />
                <div>
                  <h2 className="font-semibold text-[#656565] capitalize">
                    Return Policy
                  </h2>
                  <span className="text-[#454545] capitalize text-sm">
                    easy & free return
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 group cursor-pointer">
                <IoTicketOutline className="text-3xl text-red-300 group-hover:text-[#454545]" />
                <div>
                  <h2 className="font-semibold text-[#656565] capitalize">
                    30% Money Back
                  </h2>
                  <span className="text-[#454545] capitalize text-sm">
                    For order over $100
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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

