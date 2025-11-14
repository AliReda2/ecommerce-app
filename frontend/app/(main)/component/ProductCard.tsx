"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Product } from "@/lib/types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { addToCart } from "@/lib/features/cartSlice";
import toast from "react-hot-toast";
import { useAppSelector } from "@/lib/hooks";
import { checkAuth } from "@/lib/features/authSlice";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { user, authChecked } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const [quantity, setQuantity] = useState(1);

  const increase = () => setQuantity((q) => q + 1);
  const decrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = (productId: string, quantity: number) => {
    dispatch(addToCart({ productId, quantity }));
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Card className="flex flex-col justify-between border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-2xl bg-white">
      {/* Image Section */}
      <CardHeader className="flex items-center justify-center p-5 bg-gray-50 rounded-t-2xl relative">
        <div className="relative w-40 h-40">
          <Image
            src={product.imageUrl || "/images/codart.png"}
            alt={product.name}
            fill
            className="object-contain transition-transform duration-300 hover:scale-105"
          />
        </div>
      </CardHeader>

      {/* Details Section */}
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

        {/* Quantity & Button Section */}
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

          {user ? (
            // Logged in
            <Button
              variant="default"
              size="sm"
              onClick={() => handleAddToCart(product.id, quantity)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              Add to Cart
            </Button>
          ) : authChecked ? (
            // Not logged in, but auth check completed
            <Button
              variant="default"
              size="sm"
              onClick={() => toast.error("Login first")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              Add to Cart
            </Button>
          ) : (
            // Auth still loading
            <Button
              variant="default"
              size="sm"
              disabled
              className="bg-gray-300 text-gray-500 rounded-lg shadow-sm transition-all"
            >
              Loading...
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
