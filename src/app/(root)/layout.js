import { SiteFooter } from "@/components/Footer/Footer";
import Newsletter from "@/components/Footer/Newsletter";
import { Header } from "@/components/Header/Header";

import React from "react";

function layout({ children }) {
  return (
    <div className="bg-white min-h-screen w-full overflow-hidden">
      {/* header section */}
      <Header />
      {/* main section */}
      <div className="pt-30 bg-[#fcf6e9]">{children}</div>
      {/* footer section */}
      <>
        <Newsletter />
        <SiteFooter />
      </>
    </div>
  );
}

export default layout;
