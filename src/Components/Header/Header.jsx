"use client";
import React, { useState } from "react";
import TopHeader from "./TopHeader";
import MiddleHeader from "./MiddleHeader";
import Link from "next/link";
import Hamburger from "hamburger-react";

function Header() {
  const [isOpen, setOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products/electronic_gadgets", label: "Electronics" },
    { href: "/products/fashion_apparel/mens_clothing", label: "Men's" },
    { href: "/products/fashion_apparel/womens_clothing", label: "Women's" },
    { href: "/products/fashion_apparel/jewellery", label: "Jewelry" },
    { href: "/products/", label: "Hot Offers" },
  ];

  return (
    <header className=" relative z-50">
      {/* Top bar */}
      <TopHeader />

      {/* Middle Header */}
      <MiddleHeader />

      {/* Desktop Navbar */}
      <div className="bg-white md:flex hidden">
        <ul className="flex gap-14 uppercase font-semibold text-[#333f45] justify-center py-3 w-full">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Navbar & Drawer */}
      <div className="md:hidden relative">
        {/* Navbar */}
        <div className="flex justify-between items-center px-4 py-3 bg-white border-b border-gray-200">
          <h1 className="text-lg font-bold uppercase">EpicDeals</h1>
          <Hamburger toggled={isOpen} toggle={setOpen} size={20} />
        </div>

        {/* Drawer */}
        {isOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg z-40">
            <ul className="flex flex-col gap-4 py-6 px-6 uppercase font-semibold text-[#333f45]">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
