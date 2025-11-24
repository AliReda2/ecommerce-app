"use client";

import { Input } from "@/components/ui/input";
import Image from "next/image";
import { User, Heart, ShoppingCart, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import LoginModal from "./LoginModal";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import toast from "react-hot-toast";
import { checkAuth, logout } from "@/lib/features/authSlice";
import { getCartItems } from "@/lib/features/cartSlice";
import { fetchWishlist } from "@/lib/features/wishListSlice";
import VerifyModal from "./VerifyModal";
import { useRouter } from "next/navigation";
import { setHighlightedProduct } from "@/lib/features/uiSlice";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isMobile = useIsMobile();

  const { products } = useAppSelector((s) => s.product);
  const { user, authChecked } = useAppSelector((state) => state.auth);
  const { cartItems } = useAppSelector((state) => state.cart);
  const { wishListItems } = useAppSelector((state) => state.wishList);

  const [openLogin, setOpenLogin] = useState(false);
  const [openVerify, setOpenVerify] = useState(false);
  const [openPanel, setOpenPanel] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = (products || []).filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpenPanel(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (authChecked && user) {
      dispatch(getCartItems());
      dispatch(fetchWishlist());
    }
  }, [authChecked, user, dispatch]);

  const handleProfileClick = () => {
    if (!user) {
      setOpenLogin(true);
    } else {
      setOpenPanel((prev) => !prev);
    }
  };
  const handleVerifyClick = () => {
    setOpenVerify(true);
  };

  const handleLogout = async () => {
    await dispatch(logout())
      .unwrap()
      .then(() => toast.success("Logout succesful"))
      .catch((error) => toast.error(error));

    router.replace("/");

    setOpenPanel(false);
  };

  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScrollY.current && currentScroll > 80) {
        // scrolling down
        setIsVisible(false);
      } else {
        // scrolling up
        setIsVisible(true);
      }

      lastScrollY.current = currentScroll;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`bg-white shadow-md fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto px-0 sm:px-6 lg:px-8">
          <div className="flex items-center justify-evenly h-26">
            {/* Logo */}
            <Link href={"/"} className="flex justify-center">
              <Image
                src="/images/codart.png"
                alt="logo"
                height={100}
                width={100}
                className="object-contain"
              />
            </Link>

            {/* Search */}
            <div className="flex-1 md:px-0 sm:px-4 sm:max-w-xl sm:relative row-start-2 col-span-2 sm:mx-0 mx-5 sm:block hidden">
              <Input
                type="search"
                placeholder={isMobile ? "Search..." : "Search for products..."}
                className="
                w-full h-12 rounded-3xl bg-gray-50 border-gray-200  
                focus:border-gray-300    
                focus:ring-1 focus:ring-gray-300 
                focus:outline-none
              "
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <Search
                size={20}
                className="absolute right-7 sm:top-1/2 top-[62%] -translate-y-1/2 text-gray-400"
              />

              {searchTerm && filteredProducts.length > 0 && (
                <div className="absolute bg-white border w-full max-h-64 overflow-auto z-50 mt-1 rounded-lg shadow-lg">
                  {filteredProducts.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        dispatch(setHighlightedProduct(String(p.id)));
                        setSearchTerm("");
                      }}
                    >
                      <div className="w-10 h-10 relative shrink-0">
                        <Image
                          src={p.imageUrl || "/images/codart.png"}
                          alt={p.name}
                          fill
                          className="object-contain rounded-md"
                        />
                      </div>
                      <span className="text-gray-800">{p.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex ">
              {/* Support */}
              <div className="hidden md:flex flex-col items-center px-4 border-r border-gray-200">
                <small className="text-gray-400">For Support</small>
                <strong className="text-gray-800 text-lg">
                  +961 70 031 455
                </strong>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-6 px-4 text-gray-700 relative">
                {/* Profile */}
                <button
                  onClick={handleProfileClick}
                  name="profile"
                  className="hover:text-blue-600 hover:scale-110 transition-transform duration-200"
                >
                  <User size={24} />
                </button>

                {/* Dropdown Panel */}
                {openPanel && (
                  <div
                    ref={panelRef}
                    className="absolute right-0 mt-40 w-48 bg-white shadow-lg rounded-lg border border-gray-100 py-2 z-50"
                  >
                    <Link
                      href="/profile"
                      className="block px-4 py-2 hover:bg-gray-50 text-gray-700"
                    >
                      Edit Profile
                    </Link>

                    <Link
                      href="/orders"
                      className="block px-4 py-2 hover:bg-gray-50 text-gray-700"
                    >
                      My Orders
                    </Link>

                    {!user?.isVerified && (
                      <button
                        onClick={handleVerifyClick}
                        className="block px-4 py-2 hover:bg-gray-50 text-gray-700 w-full text-left"
                      >
                        Verify Email
                      </button>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                )}

                {/* Wishlist */}
                <button
                  className="hover:text-red-600 hover:scale-110 transition-transform duration-200"
                  name="wishlist"
                >
                  {user ? (
                    <Link href={"/wishList"} className="relative">
                      <Heart size={24} />
                      {wishListItems.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                          {wishListItems.length}
                        </span>
                      )}
                    </Link>
                  ) : authChecked ? (
                    <Heart
                      size={24}
                      onClick={() => toast.error("Login first")}
                    />
                  ) : (
                    <Heart size={24} className="opacity-50" />
                  )}
                </button>

                {/* Cart */}
                <button
                  className="hover:scale-110 transition-transform duration-200"
                  name="cart"
                >
                  {user ? (
                    <Link href="/cart" className="relative">
                      <ShoppingCart size={24} />
                      {cartItems.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                          {cartItems.length}
                        </span>
                      )}
                    </Link>
                  ) : authChecked ? (
                    <ShoppingCart
                      size={24}
                      onClick={() => toast.error("Login first")}
                    />
                  ) : (
                    <ShoppingCart size={24} className="opacity-50" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Login/Register Modal */}
      <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} />
      <VerifyModal
        open={openVerify}
        onClose={() => setOpenVerify(false)}
        email={user?.email}
      />
    </>
  );
};

export default Navbar;
