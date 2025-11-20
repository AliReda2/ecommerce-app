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
  addToWishlist,
  removeFromWishlist,
} from "@/lib/features/wishListSlice";

interface ProductCardProps {
  product: Product;
  highlight?: boolean;
  innerRef?: React.Ref<HTMLDivElement>;
}

export default function ProductCard({
  product,
  highlight,
  innerRef,
}: ProductCardProps) {
  const dispatch = useAppDispatch();
  const { user, authChecked } = useAppSelector((state) => state.auth);
  const { wishListItems } = useAppSelector((state) => state.wishList);

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!authChecked) dispatch(checkAuth());
  }, [dispatch, authChecked]);

  const wishlistItem = useMemo(
    () => wishListItems.find((item) => item.productId === product.id),
    [wishListItems, product.id]
  );

  const increase = () => setQuantity((q) => q + 1);
  const decrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = async () => {
    if (!user || !authChecked) return toast.error("Login first");
    try {
      await dispatch(addToCart({ productId: product.id, quantity })).unwrap();
      toast.success(`${product.name} added to cart!`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to add to cart");
    }
  };

  const handleWishlistToggle = async () => {
    if (!user || !authChecked) return toast.error("Login first");

    try {
      if (wishlistItem) {
        await dispatch(
          removeFromWishlist({ wishlistId: wishlistItem.id })
        ).unwrap();
        toast.success(`${product.name} removed from wishlist`);
      } else {
        await dispatch(addToWishlist({ productId: product.id })).unwrap();
        toast.success(`${product.name} added to wishlist`);
      }
    } catch (err: any) {
      toast.error(err?.message || "Wishlist action failed");
    }
  };

  return (
    <Card
      ref={innerRef}
      className={`flex flex-col justify-between border border-gray-200 shadow-md rounded-xl bg-white p-3 sm:p-4 h-full transition-all duration-300 ${
        highlight ? "ring-4 ring-yellow-400" : ""
      }`}
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
            src={product.imageUrl || "/images/codart.png"}
            alt={product.name}
            fill
            className="object-contain transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Wishlist Toggle Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute right-2 top-2 p-2 rounded-lg border-none transition"
        >
          <Heart
            size={24}
            name="like"
            fill={wishlistItem ? "red" : "none"}
            className={`${
              wishlistItem ? "text-red-500" : ""
            } hover:text-red-500`}
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
            {product?.category?.name ?? "Uncategorized"}
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
              ${product.price.toFixed(2)}
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
