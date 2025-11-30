"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Product } from "@/lib/types";
import { addToCart } from "@/lib/features/cartSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { checkAuth } from "@/lib/features/authSlice";
import toast from "react-hot-toast";
import { Heart } from "lucide-react";
import {
  toggleWishlist,
  toggleWishlistOptimistic,
  rollbackWishlistUpdate,
} from "@/lib/features/wishListSlice";

interface ProductCardProps {
  product: Product;
}

export default function NewProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const { user, authChecked } = useAppSelector((state) => state.auth);
  const { wishListItems } = useAppSelector((state) => state.wishList);

  const [quantity, setQuantity] = useState(1);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  useEffect(() => {
    if (!authChecked) dispatch(checkAuth());
  }, [dispatch, authChecked]);

  // Check if product is in wishlist
  const isInWishlist = useMemo(
    () => wishListItems.some((item) => item.productId === product.id),
    [wishListItems, product.id]
  );

  const increase = () => setQuantity((q) => q + 1);
  const decrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = async () => {
    if (!user || !authChecked) return toast.error("Login first");
    await dispatch(addToCart({ productId: product.id, quantity }))
      .unwrap()
      .then(() => toast.success(`${product.name} added to cart!`))
      .catch((error) => toast.error(error));
  };

  const handleWishlistToggle = async () => {
    if (!user || !authChecked) return toast.error("Login first");

    setIsWishlistLoading(true);
    const previousItems = [...wishListItems]; // Store for potential rollback

    // Optimistic update
    dispatch(toggleWishlistOptimistic({ productId: product.id }));

    try {
      await dispatch(toggleWishlist({ productId: product.id })).unwrap();
      // Don't show success toast for toggle to avoid annoyance
    } catch (err: any) {
      // Rollback on error
      dispatch(rollbackWishlistUpdate({ previousItems }));
      toast.error(err || "Failed to update wishlist");
    } finally {
      setIsWishlistLoading(false);
    }
  };

  return (
    <Card
      className={`product-card flex flex-col justify-between border border-gray-200 shadow-md rounded-xl bg-white p-3 sm:p-4 h-full transition-all duration-300 `}
    >
      <CardHeader className="flex items-center justify-center p-0 rounded-t-2xl relative">
        <div
          className="relative mx-auto
        lg:w-48 lg:h-48
        md:w-40 md:h-40 
        sm:w-32 sm:h-32 
        w-24 h-24
        "
        >
          <Image
            src={product.imageUrl || "/images/codart.webp"}
            alt={product.name ?? 'product'}
            fill
            className="object-contain transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Wishlist Toggle Button */}
        <button
          onClick={handleWishlistToggle}
          disabled={isWishlistLoading}
          className={`absolute right-2 top-2 p-2 rounded-lg border-none transition-all duration-200 ${
            isWishlistLoading
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:scale-110"
          }`}
        >
          <Heart
            size={24}
            fill={isInWishlist ? "red" : "none"}
            className={`transition-colors duration-200 ${
              isInWishlist ? "text-red-500" : "text-gray-400 hover:text-red-500"
            }`}
          />
        </button>
      </CardHeader>

      <CardContent className="flex flex-col grow justify-between px-5 pb-6 space-y-3">
        <div>
          <CardTitle className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-1">
            {product.name}
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 sm:block hidden">
            {product.description}
          </p>

          <p className="text-xs sm:text-sm text-gray-500 sm:block hidden">
            {product?.category ?? "Uncategorized"}
          </p>
        </div>

        {/* Quantity & Add to Cart & Price */}
        <div
          className="grid
          gap-1 justify-items-center mt-3 text-xs 
          2xl:grid-cols-2 2xl:grid-rows-2 2xl:gap-2
          grid-cols-1 grid-rows-3
          sm:text-sm
        "
        >
          <div className="flex justify-between items-center sm:mt-2 m-0">
            <span className="text-sm sm:text-xl font-bold text-blue-700">
              ${product?.price?.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center border rounded-md overflow-hidden h-8 sm:h-9">
            <button
              onClick={decrease}
              className="w-7 sm:w-8 flex items-center justify-center text-lg font-bold text-gray-700"
            >
              −
            </button>

            <input
              type="number"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, Number(e.target.value) || 1))
              }
              className="
      w-10 sm:w-12 text-center bg-white border-x outline-none
      text-sm font-medium
      [-moz-appearance:textfield]
      [&::-webkit-inner-spin-button]:appearance-none
      [&::-webkit-outer-spin-button]:appearance-none
    "
            />

            <button
              onClick={increase}
              className="w-7 sm:w-8 flex items-center justify-center text-lg font-bold text-gray-700"
            >
              +
            </button>
          </div>

          <Button
            variant="default"
            size="sm"
            onClick={handleAddToCart}
            className="
    bg-blue-600 hover:bg-blue-700 
    text-white font-medium rounded-lg 
    shadow-sm hover:shadow-md 
    transition-all 
    w-full sm:w-auto
    2xl:col-span-2
  "
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
