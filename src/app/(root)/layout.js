import Footer from "@/Components/Footer/Footer";
import Header from "@/Components/Header/Header";
import React from "react";


function layout({ children }) {
  return (
    <div className="bg-[#fff] min-h-screen">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

export default layout;
