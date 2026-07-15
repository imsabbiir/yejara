"use client";
import Link from "next/link";
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import Logo from "@/media/logo.png";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Image from "next/image";
import UserMenu from "./UserMenu";
import { useRouter } from "next/navigation";

const categories = [
  { label: "Home", to: "/" },
  { label: "Electronics", to: "/category/electronic_gadgets" },
  { label: "Men's", to: "/subcategory/mens_clothing" },
  { label: "Women's", to: "/subcategory/womens_clothing" },
  { label: "Jewelry", to: "/subcategory/jewellery" },
];
export function Header() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const menuRef = useRef(null);
  const submit = (e) => {
    e.preventDefault();
    if (!searchValue.trim()) return;
    router.push(
      `/search?searchValue=${encodeURIComponent(searchValue.trim())}`,
    );
  };

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileOpen(false);
      }
    }

    if (mobileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileOpen, setMobileOpen]);

  return (
    <header className="fixed w-full bg-[rgb(255,248,235)]/80 top-0 z-50 backdrop-blur-xl border-b border-[#dfd6cb]">
      <div className="bg-[#17100b] text-[#fcf6e9] overflow-hidden py-2 text-xs uppercase tracking-[0.2em] font-medium">
        <div className="flex marquee whitespace-nowrap gap-12">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-12 shrink-0">
              <span>✦ Free shipping over $50</span>
              <span>✦ New Drop: Summer Collection</span>
              <span>✦ Members get 15% off</span>
              <span>✦ Free returns within 30 days</span>
              <span>✦ Free shipping over $50</span>
              <span>✦ New Drop: Summer Collection</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-350 mx-auto px-6 py-4 flex items-center gap-6">
        <Link href={"/"} className="">
          <Image
            src={Logo}
            alt="EpicDeals"
            width={1500}
            height={1500}
            className="object-contain h-7 w-fit"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {categories.map((c) => (
            <Link
              key={c.label}
              href={`${c?.to}`}
              params={{ slug: c.to }}
              className="px-3 py-2 text-sm font-medium text-[#17100b]/70 hover:text-[#17100b] transition-colors relative group"
            >
              {c.label}
              <span className="absolute bottom-1 left-3 right-3 h-0.5 bg-[#ff5b4e] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Link>
          ))}
        </nav>

        <form
          onSubmit={submit}
          className="flex-1 max-w-md ml-auto hidden md:block"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#]" />
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              type="text"
              placeholder="Search the universe…"
              className="w-full bg-[#f6eee2]/60 border border-transparent focus:border-[#5e534a] rounded-full pl-11 pr-4 py-2.5 text-sm outline-none transition-colors"
            />
          </div>
        </form>

        <div className="flex items-center gap-1 ml-auto md:ml-0">
          <UserMenu />
          <Link
            href="/wishlists"
            className="p-2.5 rounded-full hover:bg-[#f9f1e5] transition-colors relative"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 text-[10px] font-bold rounded-full bg-[#ff5b4e] text-[#fcf6e9] flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            className="p-2.5 rounded-full bg-[#17100b] text-[#fcf6e9] hover:bg-[#ff5b4e] transition-colors relative"
            aria-label="Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 text-[10px] font-bold rounded-full bg-[#ff5b4e] text-[#fcf6e9] flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>

          <button
            className="p-2.5 lg:hidden cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div>
        <div
          className={`absolute w-full h-screen inset-0 bg-black/60 backdrop-blur-sm ${mobileOpen ? "" : "hidden"}`}
        ></div>
        <div
          ref={menuRef}
          className={`lg:hidden bg-[#fcf6e9] absolute top-0 w-8/10 h-screen  ${mobileOpen ? "right-0" : "-right-full"} transition-all duration-300 ease-in-out`}
        >
          <div className="px-6 py-4 space-y-2">
            <div className="flex justify-end">
              <button
                className="p-2.5 cursor-pointer "
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={submit} className="md:hidden mb-3">
              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search…"
                className="w-full bg-[#f9f1e5] rounded-full px-4 py-2.5 text-sm outline-none"
              />
            </form>
            {categories.map((c) => (
              <Link
                key={c.label}
                href={`${c?.to}`}
                params={{ slug: c.to }}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-medium"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
