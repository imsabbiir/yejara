import Footer from "@/components/Footer/Footer";
import { Newsletter, SiteFooter } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";

import React from "react";
import { Toaster } from "react-hot-toast";

function layout({ children }) {
  return (
    <div className="bg-[#fff] min-h-screen w-full overflow-hidden">
      {/* header section */}
      <Header />
      {/* main section */}
      <div className="pt-30 bg-[#fcf6e9]">{children}</div>
      {/* footer section */}
      <>
        <Newsletter />
        <SiteFooter />
      </>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}

export default layout;
