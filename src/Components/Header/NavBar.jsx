import Link from "next/link";
import React from "react";

function NavBar() {
  return (
    <div className="py-3 flex justify-center items-center">
      <ul className="flex gap-14 uppercase font-semibold text-[#333f45] relative">
        <li>
          <Link href="/" className="nav-link">
            Home
          </Link>
        </li>

        {/* Dropdown for Electronics */}
        <li className="group relative">
          <Link href="/electronic_gadgets" className="nav-link">
            electronics
          </Link>
          <ul className="absolute top-full left-0 mt-3 bg-white shadow-lg rounded-lg w-60 p-2 hidden group-hover:block z-50">
            <li>
              <Link
                href="/electronic_gadgets/mobile_phones"
                className="block px-4 py-2 text-sm hover:bg-red-50"
              >
                Mobile Phones
              </Link>
            </li>
            <li>
              <Link
                href="/electronic_gadgets/laptops_tablets"
                className="block px-4 py-2 text-sm hover:bg-red-50"
              >
                Laptops & Tablets
              </Link>
            </li>
            <li>
              <Link
                href="/electronic_gadgets/computer_accessories"
                className="block px-4 py-2 text-sm hover:bg-red-50"
              >
                Computer Accessories
              </Link>
            </li>
            <li>
              <Link
                href="/electronic_gadgets/smart_watches"
                className="block px-4 py-2 text-sm hover:bg-red-50"
              >
                Smart Watches
              </Link>
            </li>
          </ul>
        </li>

        <li>
          <Link href="/fashion_apparel/mens_clothing" className="nav-link">
            men's
          </Link>
        </li>
        <li>
          <Link href="/fashion_apparel/womens_clothing" className="nav-link">
            women's
          </Link>
        </li>
        <li>
          <Link href="/fashion_apparel/jewellery" className="nav-link">
            jewelry
          </Link>
        </li>
        <li>
          <Link href="/" className="nav-link">
            hot offers
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default NavBar;
