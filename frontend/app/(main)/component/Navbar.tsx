"use client";

import { Input } from "@/components/ui/input";
import Image from "next/image";
import { User, Heart, ShoppingCart, Search } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-26">
          {/* Logo */}
          <div>
            <Image
              src="/images/codart.png"
              alt="logo"
              height={100}
              width={100}
              className="object-contain"
            />
          </div>

          {/* Search */}
          <div className="flex-1 px-4 max-w-xl relative">
            <Input
              type="search"
              placeholder="Search for products..."
              className="w-full h-12 rounded-3xl bg-gray-50"
            />
            <Search
              size={20}
              className="absolute right-7 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>

          {/* Support */}
          <div className="hidden md:flex flex-col items-center px-4 border-r border-gray-200">
            <small className="text-gray-400">For Support</small>
            <strong className="text-gray-800 text-lg">+961 70 031 455</strong>
          </div>

          {/* Actions: Profile, Wishlist, Cart */}
          <div className="flex items-center space-x-6 px-4 text-gray-700">
            <button className="hover:text-blue-600 hover:scale-110 transition-transform duration-200">
              <User size={24} />
            </button>
            <button className="hover:text-red-600 hover:scale-110 transition-transform duration-200">
              <Heart size={24} />
            </button>
            <button className="hover:text-green-600 hover:scale-110 transition-transform duration-200">
              <Link href={"/cart"}>
                <ShoppingCart size={24} />
              </Link>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
