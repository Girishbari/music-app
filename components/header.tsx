"use client";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";

import { useContext } from "react";
import { HelperContext } from "@/context/HelperContext";
import Link from "next/link";

export default function Header() {
  const { setIsOpen } = useContext(HelperContext);

  return (
    <header className="flex flex-row-reverse items-center justify-between border-b bg-[#EFEFF4]/40 p-4 md:p-6">
      <div className="p-2 border hover:bg-[#EFEFF4] cursor-pointer md:hidden">
        <Menu
          className="h-5 w-5 text-black"
          onClick={() => setIsOpen((prev: any) => !prev)}
        />
      </div>
      <div className="flex items-center gap-4">
        <Link href={"/signin"} className="underline">
          Account
        </Link>
      </div>
    </header>
  );
}
