import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
const topHeaderData = {
  offer: "free shipping this week order over - $55",
  languageMenu: {
    label: "USD $",
    options: ["USD $", "EUR €", "GBP £"],
  },
  currencyMenu: {
    label: "English",
    options: ["English", "Spanish", "French", "German"],
  },
};
function TopHeader() {
  return (
    <div className="w-full bg-[#1f2937]">
      <div className="w-[90%] mx-auto flex justify-between items-center h-10 uppercase">
        {/* social media icons */}
        <div className="flex gap-2">
          <i className="tobBarIcon">
            <FaFacebookF />
          </i>
          <i className="tobBarIcon">
            <FaInstagram />
          </i>
          <i className="tobBarIcon">
            <FaLinkedinIn />
          </i>
          <i className="tobBarIcon">
            <FaTwitter />
          </i>
        </div>

        <h3 className="hidden md:inline text-[#ff8f9c] text-xs">
          {topHeaderData?.offer}
        </h3>

        {/* Language and Currency Select Option  */}
        <div className="flex gap-2 items-center">
          <select className="text-xs p-1 rounded-md text-[#FFFFFF] bg-[#ff8f9c]">
            {topHeaderData?.languageMenu?.options?.map((option, index) => (
              <option key={index} value={option} className="">
                {option}
              </option>
            ))}
          </select>
          <select className="text-xs p-1 rounded-md text-[#FFFFFF] bg-[#ff8f9c]">
            {topHeaderData?.currencyMenu?.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default TopHeader;
