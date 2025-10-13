import Footer from "@/Components/Footer/Footer";
import Header from "@/Components/Header/Header";
import React from "react";
import { Toaster } from 'react-hot-toast';

function layout({ children }) {
  return (
    <div className="bg-[#fff] min-h-screen">
      <Header />
      {children}
      <Footer />
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}

export default layout;
