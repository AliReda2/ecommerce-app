import {
  Facebook,
  Twitter,
  Instagram,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
} from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-linear-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex flex-col h-full">
              <Link href="/" className="inline-block mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">C</span>
                  </div>
                  <span className="text-xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Codart Shop
                  </span>
                </div>
              </Link>

              <p className="text-gray-300 mb-6 leading-relaxed text-sm">
                Your trusted partner for quality products with fast delivery and
                exceptional customer service. We&apos;re committed to bringing you
                the best shopping experience.
              </p>

              {/* Social Links */}
              <div className="mb-6">
                <p className="text-gray-400 text-sm font-medium mb-3">
                  Follow Us
                </p>
                <div className="flex gap-3">
                  {[
                    { icon: Facebook, href: "#", color: "hover:bg-blue-600" },
                    { icon: Twitter, href: "#", color: "hover:bg-sky-500" },
                    { icon: Instagram, href: "#", color: "hover:bg-pink-500" },
                    {
                      icon: MessageCircle,
                      href: "https://wa.me/96170031455",
                      color: "hover:bg-green-500",
                    },
                  ].map((social, index) => (
                    <Link
                      key={index}
                      href={social.href}
                      target={
                        social.href.startsWith("http") ? "_blank" : undefined
                      }
                      className={`p-2 rounded-lg bg-gray-700 ${social.color} text-gray-300 hover:text-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg`}
                    >
                      <social.icon size={18} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-2 lg:col-span-2">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4 relative inline-block">
                Quick Links
                <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-blue-500"></span>
              </h3>
              <ul className="space-y-3">
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
                      className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group text-sm"
                    >
                      <span className="w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4 relative inline-block">
                Support
                <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-blue-500"></span>
              </h3>
              <ul className="space-y-3">
                {[
                  { href: "/privacy-policy", label: "Privacy Policy" },
                  { href: "/terms-conditions", label: "Terms & Conditions" },
                  { href: "/returns-refunds", label: "Returns & Refunds" },
                  { href: "/wishlist", label: "Wishlist" },
                  { href: "/orders", label: "My Orders" },
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group text-sm"
                    >
                      <span className="w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4 relative inline-block">
              Contact Info
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-blue-500"></span>
            </h3>

            <div className="space-y-4">
              <a
                href="tel:+96170031455"
                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-200 group text-sm"
              >
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Phone size={18} className="text-blue-400" />
                </div>
                <div>
                  <p className="font-medium">+961 70031455</p>
                  <p className="text-gray-400 text-xs">Call us anytime</p>
                </div>
              </a>

              <a
                href="https://wa.me/96170031455"
                target="_blank"
                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-200 group text-sm"
              >
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                  <MessageCircle size={18} className="text-green-400" />
                </div>
                <div>
                  <p className="font-medium">WhatsApp</p>
                  <p className="text-gray-400 text-xs">Quick response</p>
                </div>
              </a>

              <a
                href="mailto:support@codart.com"
                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-200 group text-sm"
              >
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                  <Mail size={18} className="text-purple-400" />
                </div>
                <div>
                  <p className="font-medium">support@codart.com</p>
                  <p className="text-gray-400 text-xs">Email support</p>
                </div>
              </a>

              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <MapPin size={18} className="text-orange-400" />
                </div>
                <div>
                  <p className="font-medium">Lebanon</p>
                  <p className="text-gray-400 text-xs">Nationwide delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-lg font-semibold text-white mb-2">
                Stay Updated
              </h3>
              <p className="text-gray-300 text-sm max-w-md">
                Subscribe to our newsletter for the latest products, offers, and
                updates.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 text-sm flex-1 min-w-0"
              />
              <button className="px-6 py-3 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg text-sm whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-700 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Codart Shop. All rights reserved.
            </div>

            <div className="flex items-center gap-6 text-sm">
              <Link
                href="/privacy-policy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms-conditions"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/returns-refunds"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Returns
              </Link>
              <div className="text-gray-400">Made with ❤️ in Lebanon</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
