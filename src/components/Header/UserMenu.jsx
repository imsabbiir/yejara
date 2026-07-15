"use client";

import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
import Link from "next/link";

function UserMenu() {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/me", { credentials: "include" });
      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Link
      href={`${user ? "/profile" : "login"}`}
      className={`relative flex text-sm font-inter items-center gap-2 ${user ? "bg-[#f9f1e5]" : ""} px-5 py-2 rounded-2xl`}
    >
      <User className="cursor-pointer" strokeWidth={1.5} />

      <span>{user?.name?.split(" ")[0]}</span>
    </Link>
  );
}

export default UserMenu;
