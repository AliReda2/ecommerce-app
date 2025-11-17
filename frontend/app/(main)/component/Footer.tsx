"use client";

import {
  Facebook,
  Twitter,
  Instagram,
  Phone,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 shadow-[0_-2px_8px_rgba(0,0,0,0.1)] z-50">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 justify-items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {/* Logo & Socials */}
        <div className="flex flex-col items-center">
          <Image
            src="/images/codart.png"
            alt="Codart Shop"
            width={140}
            height={40}
            className="mb-4"
          />
          <ul className="flex gap-3">
            <li>
              <Link
                href="#"
                className="flex flex-col justify-center p-2 rounded-full border border-gray-300 hover:bg-blue-600 hover:text-white transition-colors"
              >
                <Facebook size={16} />
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex flex-col justify-center p-2 rounded-full border border-gray-300 hover:bg-sky-500 hover:text-white transition-colors"
              >
                <Twitter size={16} />
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex flex-col justify-center p-2 rounded-full border border-gray-300 hover:bg-pink-500 hover:text-white transition-colors"
              >
                <Instagram size={16} />
              </Link>
            </li>
            <li>
              <Link
                href="https://wa.me/96170031455"
                target="_blank"
                className="flex flex-col justify-center p-2 rounded-full border border-gray-300 hover:bg-green-500 hover:text-white transition-colors"
              >
                <MessageCircle size={16} />
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div className="flex flex-col items-center">
          <h5 className="text-gray-800 font-semibold mb-3">Customer Service</h5>
          <ul className="flex flex-col items-center space-y-2 text-sm">
            <li>
              <Link
                href="/contact"
                className="hover:text-gray-900 transition-colors"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/faq"
                className="hover:text-gray-900 transition-colors"
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link
                href="/privacy-policy"
                className="hover:text-gray-900 transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/returns-refunds"
                className="hover:text-gray-900 transition-colors"
              >
                Returns & Refunds
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col items-center">
          <h5 className="text-gray-800 font-semibold mb-3">Quick Links</h5>
          <ul className="flex flex-col items-center space-y-2 text-sm">
            <li>
              <Link
                href="/about-us"
                className="hover:text-gray-900 transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/shipping-info"
                className="hover:text-gray-900 transition-colors"
              >
                Shipping Info
              </Link>
            </li>
            <li>
              <Link
                href="/terms-conditions"
                className="hover:text-gray-900 transition-colors"
              >
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* Shop */}
        <div className="flex flex-col items-center">
          <h5 className="text-gray-800 font-semibold mb-3">Shop</h5>
          <ul className="flex flex-col items-center space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-gray-900 transition-colors">
                All Products
              </Link>
            </li>
            <li>
              <Link
                href="/wishlist"
                className="hover:text-gray-900 transition-colors"
              >
                Wishlist
              </Link>
            </li>
            <li>
              <Link
                href="/orders"
                className="hover:text-gray-900 transition-colors"
              >
                My Orders
              </Link>
            </li>
            <li>
              <Link
                href="/#trending"
                className="hover:text-gray-900 transition-colors"
              >
                Trending
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col items-center">
          <h5 className="text-gray-800 font-semibold mb-3">Contact Info</h5>
          <ul className="flex flex-col items-center space-y-2 text-sm">
            <li>
              <a
                href="tel:+96170031455"
                className="flex items-center gap-2 hover:text-gray-900 transition-colors"
              >
                <Phone size={16} /> +961 70031455
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/96170031455"
                target="_blank"
                className="flex items-center gap-2 hover:text-gray-900 transition-colors"
              >
                <MessageCircle size={16} /> WhatsApp
              </a>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-gray-900 transition-colors"
              >
                Get Support
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-300 mt-8 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Codart Shop. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
