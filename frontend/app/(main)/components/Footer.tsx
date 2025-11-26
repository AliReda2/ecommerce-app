import CurrentYear from "@/components/CurrentYear";
import { Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { Suspense } from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 shadow-lg shadow-gray-800 text-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-3">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, blue 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main Footer Content */}
        <div
          className="grid grid-cols-1 gap-8 justify-items-center
        md:grid-cols-2 
        lg:grid-cols-4 lg:gap-12"
        >
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex flex-col h-full">
              <Link href="/" className="inline-block mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">C</span>
                  </div>
                  <span className="text-xl font-bold text-blue-700">
                    Codart Shop
                  </span>
                </div>
              </Link>

              <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                Your trusted partner for quality products with fast delivery and
                exceptional customer service. We&apos;re committed to bringing
                you the best shopping experience.
              </p>

              {/* Social Links */}
              <div className="mb-6 w-full justify-items-center">
                <p className="text-gray-700 text-sm font-medium mb-3">
                  Follow Us
                </p>
                <div className="flex gap-3">
                  <Link
                    href="https://wa.me/96170031455"
                    className="group w-12 h-12 flex items-center justify-center rounded-lg bg-green-200 transition-all duration-200 hover:bg-green-500 hover:-translate-y-1"
                  >
                    <FontAwesomeIcon
                      icon={faWhatsapp}
                      className="text-2xl text-[#1447e6] transition-colors duration-200 group-hover:text-white"
                    />
                  </Link>

                  <Link
                    href="https://www.instagram.com/codartlb/"
                    className="group w-12 h-12 flex items-center justify-center rounded-lg bg-pink-200 transition-all duration-200 hover:bg-pink-500 hover:-translate-y-1"
                  >
                    <FontAwesomeIcon
                      icon={faInstagram}
                      className="text-2xl text-[#1447e6] transition-colors duration-200 group-hover:text-white"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 justify-items-center gap-8 md:grid-cols-2 lg:col-span-2 w-full">
            <div className="space-y-4 justify-items-center md:justify-items-start">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 relative inline-block w-full text-center md:text-start">
                Quick Links
              </h3>
              <ul className="space-y-3 justify-items-center md:justify-items-start">
                {[
                  { href: "/", label: "Home" },
                  { href: "/about-us", label: "About Us" },
                  { href: "/shipping-info", label: "Shipping" },
                  { href: "/contact", label: "Contact" },
                  { href: "/faq", label: "FAQ" },
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-700 hover:text-blue-700 transition-colors duration-200 flex items-center gap-2 group text-sm"
                    >
                      <span className="w-1 h-1 bg-blue-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 justify-items-center md:justify-items-start">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 relative inline-block w-full text-center md:text-start">
                Support
              </h3>
              <ul className="space-y-3 justify-items-center md:justify-items-start">
                {[
                  { href: "/privacy-policy", label: "Privacy Policy" },
                  { href: "/terms-conditions", label: "Terms & Conditions" },
                  { href: "/returns-refunds", label: "Returns & Refunds" },
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-700 hover:text-blue-700 transition-colors duration-200 flex items-center gap-2 group text-sm"
                    >
                      <span className="w-1 h-1 bg-blue-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 justify-items-start">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 relative inline-block w-full text-center">
              Contact Info
            </h3>

            <div className="space-y-4">
              <a
                href="tel:+96170031455"
                className="flex items-center gap-3  justify-evenly md:justify-self-start text-gray-700 hover:text-blue-700 transition-colors duration-200 group text-sm"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                  <Phone
                    size={18}
                    className="text-blue-700 group-hover:text-white"
                  />
                </div>
                <div>
                  <p className="font-medium">+961 70031455</p>
                  <p className="text-gray-500 text-xs">Call us anytime</p>
                </div>
              </a>

              <div className="flex items-center gap-3  justify-evenly md:justify-self-start text-gray-700 hover:text-green-600 transition-colors duration-200 group text-sm">
                <Link
                  href="https://wa.me/96170031455"
                  className="group w-10 h-10 flex items-center justify-center rounded-lg bg-green-200 transition-all duration-200 hover:bg-green-500"
                >
                  <FontAwesomeIcon
                    icon={faWhatsapp}
                    className="text-xl text-[#1447e6] transition-colors duration-200 group-hover:text-white"
                  />
                </Link>
                <div>
                  <p className="font-medium">WhatsApp</p>
                  <p className="text-gray-500 text-xs">Quick response</p>
                </div>
              </div>

              <a
                href="mailto:support@codart.com"
                className="flex items-center gap-3  justify-evenly md:justify-self-start text-gray-700 hover:text-purple-700 transition-colors duration-200 group text-sm"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-700 transition-colors">
                  <Mail
                    size={18}
                    className="text-purple-700 group-hover:text-white"
                  />
                </div>
                <div>
                  <p className="font-medium">support@codart.com</p>
                  <p className="text-gray-500 text-xs">Email support</p>
                </div>
              </a>

              <div className="flex items-center gap-3  justify-evenly md:justify-self-start text-gray-700 text-sm">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <MapPin size={18} className="text-orange-700" />
                </div>
                <div>
                  <p className="font-medium">Lebanon</p>
                  <p className="text-gray-500 text-xs">Nationwide delivery</p>
                </div>
              </div>
            </div>
          </div>

          {/* image */}
          <div className="w-full hidden md:flex lg:hidden">
            <Image
              src="/images/codart2.webp"
              alt="logo"
              width={500}
              height={300}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Newsletter Section */}
        {/* <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Stay Updated
              </h3>
              <p className="text-gray-600 text-sm max-w-md">
                Subscribe to our newsletter for the latest products, offers, and
                updates.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent text-gray-900 placeholder-gray-400 text-sm flex-1 min-w-0"
              />
              <button className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg text-sm whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div> */}
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-200 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="text-gray-600 text-sm text-center md:text-left">
              ©{" "}
              <Suspense fallback="...">
                <CurrentYear />
              </Suspense>{" "}
              Codart Shop. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
