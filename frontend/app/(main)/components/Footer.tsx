import CurrentYear from '@/components/CurrentYear';
import { Phone, Mail, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { Suspense } from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 shadow-inner relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #0053ff 1px, transparent 0)`,
            backgroundSize: '18px 18px',
          }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-14 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-2xl font-bold text-blue-700 tracking-wide">
                Codart Shop
              </span>
            </Link>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Quality products, fast delivery, and a smooth shopping experience.
              We prioritize customer satisfaction above all.
            </p>

            {/* Social */}
            <div className="space-y-4 text-center items-center justify-items-center md:text-left md:items-start md:justify-items-start">
              <p className="text-gray-800 text-sm font-semibold mb-3">
                Follow Us
              </p>

              <div className="flex gap-3">
                <Link
                  aria-label="Visit our Instagram page"
                  href="https://www.instagram.com/codartlb/"
                  className="group w-12 h-12 flex items-center justify-center rounded-xl bg-blue-100 transition-all duration-300 hover:bg-pink-500 hover:-translate-y-1 active:bg-pink-500 shadow-sm"
                >
                  <FontAwesomeIcon
                    icon={faInstagram}
                    className="text-2xl text-[#1447e6] group-hover:text-white group-active:text-white transition-colors"
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 text-center items-center justify-items-center md:text-left md:items-start md:justify-items-start">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Links
            </h3>

            <ul className="space-y-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/about-us', label: 'About Us' },
                { href: '/shipping-info', label: 'Shipping' },
                { href: '/contact', label: 'Contact' },
                { href: '/faq', label: 'FAQ' },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="
text-gray-700 
hover:text-blue-700 
active:text-blue-700 
hover:translate-x-1 
active:translate-x-1 
transition-all duration-300 
inline-block text-sm
"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4 text-center items-center justify-items-center md:text-left md:items-start md:justify-items-start">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Support
            </h3>

            <ul className="space-y-3">
              {[
                { href: '/privacy-policy', label: 'Privacy Policy' },
                { href: '/terms-conditions', label: 'Terms & Conditions' },
                { href: '/returns-refunds', label: 'Returns & Refunds' },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="
text-gray-700 
hover:text-blue-700 
active:text-blue-700 
hover:translate-x-1 
active:translate-x-1 
transition-all duration-300 
inline-block text-sm
"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 text-center items-center justify-items-center md:text-left md:items-start md:justify-items-start">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Contact Info
            </h3>

            <div className="space-y-5">
              {/* Phone */}
              <a
                href="tel:+96170031455"
                className="flex items-center gap-4 text-gray-700 hover:text-blue-700 active:text-blue-700 group transition-colors"
              >
                <div className="w-11 h-11 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-700 group-active:bg-blue-700 transition-colors">
                  <Phone
                    size={18}
                    className="text-blue-700 group-hover:text-white group-active:text-white"
                  />
                </div>
                <div>
                  <p className="font-medium">+961 70031455</p>
                  <p className="text-gray-500 text-xs">Call us anytime</p>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/96170031455"
                className="flex items-center gap-4 text-gray-700 hover:text-green-600 active:text-green-600 group transition-colors"
              >
                <div className="w-11 h-11 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-green-500 group-active:bg-green-500 transition-colors">
                  <FontAwesomeIcon
                    icon={faWhatsapp}
                    className="text-xl text-blue-700 group-hover:text-white group-active:text-white"
                  />
                </div>
                <div>
                  <p className="font-medium">WhatsApp</p>
                  <p className="text-gray-500 text-xs">Quick response</p>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:support@codart.com"
                className="flex items-center gap-4 text-gray-700 hover:text-purple-700 active:text-purple-700 group transition-colors"
              >
                <div className="w-11 h-11 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-purple-700 group-active:bg-purple-700 transition-colors">
                  <Mail
                    size={18}
                    className="text-blue-700 group-hover:text-white group-active:text-white"
                  />
                </div>
                <div>
                  <p className="font-medium">support@codart.com</p>
                  <p className="text-gray-500 text-xs">Email support</p>
                </div>
              </a>

              {/* Location */}
              <div className="flex items-center gap-4 text-gray-700 hover:text-orange-600 active:text-orange-600 group transition-colors">
                <div className="w-11 h-11 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-orange-600 group-active:bg-orange-600 transition-colors">
                  <MapPin
                    size={18}
                    className="text-blue-700 group-hover:text-white group-active:text-white"
                  />
                </div>
                <div>
                  <p className="font-medium">Lebanon</p>
                  <p className="text-gray-500 text-xs">Nationwide delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-200 mt-12 pt-6">
          <div className="text-center text-gray-600 text-sm">
            ©{' '}
            <Suspense fallback="...">
              <CurrentYear />
            </Suspense>{' '}
            Codart Shop. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
