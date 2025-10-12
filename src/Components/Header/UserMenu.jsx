"use client";

import React, { useEffect, useRef, useState } from "react";
import { CiUser } from "react-icons/ci";
import Link from "next/link";
import { useRouter } from "next/navigation";

function UserMenu() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isUserLogin, setIsUserLogin] = useState(false);
  const [refreshUser, setRefreshUser] = useState(0);
  const [user, setUser] = useState(null);
  const menuRef = useRef(null);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/me", { credentials: "include" });
      const data = await res.json();
      setUser(data.user);
      setIsUserLogin(!!data.user);
    } catch (error) {
      setUser(null);
      setIsUserLogin(false);
    }
  };

  useEffect(()=>{
    fetchUser();
    const handleUserLogin = () => fetchUser();
    window.addEventListener("userLogin", handleUserLogin);

  return () => window.removeEventListener("userLogin", handleUserLogin);
  }, [])

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Logout handler
  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    setIsUserLogin(false);
    setIsUserMenuOpen(false);
    router.push("/");
  };

  // Function to trigger user refresh (to be called after login success)
  const triggerUserRefresh = () => setRefreshUser((prev) => prev + 1);

  // You can export this function or pass it down to login component via props/context

  return (
    <span className="relative" ref={menuRef}>
      <CiUser
        onClick={() => setIsUserMenuOpen((prev) => !prev)}
        className="cursor-pointer"
      />
      {isUserMenuOpen &&
        (isUserLogin ? (
          <LoggedInMenu
            onLogout={handleLogout}
            setIsUserMenuOpen={setIsUserMenuOpen}
          />
        ) : (
          <GuestMenu setIsUserMenuOpen={setIsUserMenuOpen} />
        ))}
    </span>
  );
}

export default UserMenu;

const GuestMenu = ({ setIsUserMenuOpen }) => (
  <div
    className={`absolute right-0 mt-3 w-48 rounded z-[999] py-3
        bg-[#454545]/70 backdrop-blur-[8px] shadow-lg transition-all duration-200 overflow-hidden animate-fade-in`}
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
);

const LoggedInMenu = ({ onLogout, setIsUserMenuOpen }) => {
  return (
    <div
      className={`absolute right-0 mt-3 w-48 rounded z-[999] py-3
        bg-[#454545]/70 backdrop-blur-[8px] shadow-lg transition-all duration-200 overflow-hidden animate-fade-in`}
    >
      <Link
        href="/user/profile"
        onClick={() => setIsUserMenuOpen(false)}
        className="block text-sm px-5 py-2 text-[#ffe5ea] hover:bg-[white]/50 hover:text-[#454545] font-semibold transition-all"
      >
        Profile
      </Link>
      <Link
        href="/user/track-your-order"
        onClick={() => setIsUserMenuOpen(false)}
        className="block text-sm px-5 py-2 text-[#ffe5ea] hover:bg-[white]/50 hover:text-[#454545] font-semibold transition-all"
      >
        Track Your Order
      </Link>
      <button
        onClick={() => {
          onLogout();
          setIsUserMenuOpen(false);
        }}
        className="block w-full text-left text-sm px-5 py-2 text-[#ffe5ea] hover:bg-[white]/40 hover:text-[#454545] font-semibold transition-all cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
};
