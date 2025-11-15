"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  fetchWishlist,
  removeFromWishlist,
} from "@/lib/features/wishListSlice";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/features/cartSlice";
import { Product } from "@/lib/types";

const WishListPage = () => {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  const increase = () => setQuantity((q) => q + 1);
  const decrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const dispatch = useAppDispatch();
  const { wishListItems, isLoading } = useAppSelector(
    (state) => state.wishList
  );

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = (wishlistId: string) => {
    dispatch(removeFromWishlist({ wishlistId }))
      .unwrap()
      .then(() => toast.success("Removed from wishlist"))
      .catch(() => toast.error("Failed to remove from wishlist"));
  };

  const handleAddToCart = (product: Partial<Product>, quantity: number) => {
    if (!product.id) {
      return toast.error("Product ID is missing");
    }
    dispatch(addToCart({ productId: product.id, quantity }));
    toast.success(`${product.name} added to cart!`);
  };

  // Render skeleton placeholders
  const skeletonCards = Array.from({ length: 8 }, (_, i) => (
    <div key={i} className="w-full">
      <Skeleton className="w-full h-64 rounded-2xl" />
    </div>
  ));

  return (
    <div className="w-full bg-white">
      <div className="px-6 py-10 max-w-[90%] mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

        {isLoading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {skeletonCards}
          </div>
        ) : wishListItems.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-[70vh] text-gray-600">
            <Heart size={100} />
            <p className="text-lg font-medium">Your WishList is empty</p>
            <Button
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => router.push("/dashboard")}
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishListItems.map((item) => (
              <div key={item.id} className="relative">
                <Card className="flex flex-col justify-between border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-2xl bg-white">
                  {/* Image Section */}
                  <CardHeader className="flex items-center justify-center p-5 bg-gray-50 rounded-t-2xl relative">
                    <div className="relative w-40 h-40">
                      <Image
                        src={item.product?.imageUrl || "/images/codart.png"}
                        alt={item.product?.name || "Product Image"}
                        fill
                        className="object-contain transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  </CardHeader>

                  {/* Details Section */}
                  <CardContent className="flex flex-col grow justify-between px-5 pb-6 space-y-3">
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-800 line-clamp-1">
                        {item.product?.name}
                      </CardTitle>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                        {item.product?.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-2 uppercase tracking-wide">
                        {item.product?.category?.name ?? "Uncategorized"}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xl font-bold text-blue-700">
                        ${item.product?.price?.toFixed(2) ?? "0.00"}
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
                            setQuantity(
                              Math.max(1, Number(e.target.value) || 1)
                            )
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
                        onClick={() =>
                          handleAddToCart(
                            {
                              ...item.product,
                              imageUrl: item.product?.imageUrl ?? undefined,
                              category: item.product?.category ?? undefined,
                            },
                            quantity
                          )
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2"
                  onClick={() => handleRemove(item.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishListPage;
