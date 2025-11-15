"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Product } from "@/lib/types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { addToCart } from "@/lib/features/cartSlice";
import { useAppSelector } from "@/lib/hooks";
import { checkAuth } from "@/lib/features/authSlice";
import toast from "react-hot-toast";
import { Heart } from "lucide-react";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/lib/features/wishListSlice";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { user, authChecked } = useAppSelector((state) => state.auth);
  const { wishListItems } = useAppSelector((state) => state.wishList);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const increase = () => setQuantity((q) => q + 1);
  const decrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = (productId: string, quantity: number) => {
    dispatch(addToCart({ productId, quantity }));
    toast.success(`${product.name} added to cart!`);
  };

  // Check if product is already in wishlist
  const wishlistItem = useMemo(
    () => wishListItems.find((item) => item.productId === product.id),
    [wishListItems, product.id]
  );

  const handleWishlistToggle = async () => {
    if (!user || !authChecked) {
      return toast.error("Login first");
    }

    try {
      if (wishlistItem) {
        // Product is in wishlist, remove it
        await dispatch(
          removeFromWishlist({ wishlistId: wishlistItem.id })
        ).unwrap();
        toast.success(`${product.name} removed from wishlist`);
      } else {
        // Product not in wishlist, add it
        await dispatch(addToWishlist({ productId: product.id })).unwrap();
        toast.success(`${product.name} added to wishlist`);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update wishlist";
      toast.error(errorMessage);
    }
  };

  return (
    <Card className="flex flex-col justify-between border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-2xl bg-white">
      <CardHeader className="flex items-center justify-center p-5 bg-gray-50 rounded-t-2xl relative">
        <div className="relative w-40 h-40">
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
          className="absolute right-2 top-2 p-2 rounded-lg border transition shadow-sm hover:shadow-md"
        >
          <Heart
            size={24}
            fill={wishlistItem ? "red" : "none"}
            className={"hover:text-red-500"}
          />
        </button>
      </CardHeader>

      <CardContent className="flex flex-col grow justify-between px-5 pb-6 space-y-3">
        <div>
          <CardTitle className="text-lg font-semibold text-gray-800 line-clamp-1">
            {product.name}
          </CardTitle>
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">
            {product.description}
          </p>
          <p className="text-xs text-gray-500 mt-2 uppercase tracking-wide">
            {product?.category?.name ?? "Uncategorized"}
          </p>
        </div>

        <div className="flex justify-between items-center mt-2">
          <span className="text-xl font-bold text-blue-700">
            ${product.price.toFixed(2)}
          </span>
        </div>

        {/* Quantity & Add to Cart */}
        <div className="flex items-center justify-between mt-5 space-x-3">
          <div className="flex items-center border rounded-lg overflow-hidden shadow-sm">
            <button
              onClick={decrease}
              className="px-3 py-1 text-lg font-semibold text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition"
            >
              −
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, Number(e.target.value) || 1))
              }
              className="w-12 text-center outline-none border-x bg-white text-gray-800 font-medium
                appearance-none
                [&::-webkit-outer-spin-button]:appearance-none
                [&::-webkit-inner-spin-button]:appearance-none
                [-moz-appearance:textfield]"
            />
            <button
              onClick={increase}
              className="px-3 py-1 text-lg font-semibold text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition"
            >
              +
            </button>
          </div>

          <Button
            variant="default"
            size="sm"
            onClick={() => handleAddToCart(product.id, quantity)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
