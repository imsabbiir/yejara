"use client";
import React, { useEffect, useRef, useState } from "react";
import { CiUser } from "react-icons/ci";
import Link from "next/link";

function UserMenu() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (isUserMenuOpen) {
      document.addEventListener("mousedown", () => {
        setIsUserMenuOpen(!isUserMenuOpen);
      });
    }
  }, []);

  return (
    <span className="relative" ref={menuRef}>
      <CiUser
        onClick={() => {
          setIsUserMenuOpen(!isUserMenuOpen);
        }}
        className="cursor-pointer"
      />
      {isUserMenuOpen && (
        <div
          className={`absolute right-0 mt-3 w-48 rounded z-[999] py-3
          bg-[#454545]/70 backdrop-blur-[8px] shadow-lg transition-all duration-200 overflow-hidden
          ${isUserMenuOpen ? "animate-fade-in" : "animate-fade-out"}`}
        >
          <Link
            href="/login"
            onClick={() => setIsUserMenuOpen(false)}
            className="block text-sm px-5 py-2 text-[#ffe5ea] hover:bg-[white]/50 hover:text-[#454545] font-semibold transition-all"
          >
            Login
          </Link>
          <Link
            href="/signup"
            onClick={() => setIsUserMenuOpen(false)}
            className="block text-sm px-5 py-2 text-[#ffe5ea] hover:bg-[white]/40 hover:text-[#454545] font-semibold transition-all"
          >
            Signup
          </Link>
        </div>
      )}
    </span>
  );
}

export default UserMenu;
