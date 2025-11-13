"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import {
  getCartItems,
  removeFromCart,
  updateCartItemQuantity as updateQuantity,
} from "@/lib/features/cartSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Trash2 } from "lucide-react";
import Link from "next/link";

const Cart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cartItems, isLoading, error } = useSelector(
    (state: RootState) => state.cart
  );

  useEffect(() => {
    dispatch(getCartItems());
  }, [dispatch]);

  const handleIncrease = (cartItemId: string, quantity: number) =>
    dispatch(updateQuantity({ cartItemId, quantity: quantity + 1 }));

  const handleDecrease = (cartItemId: string, quantity: number) =>
    dispatch(
      updateQuantity({ cartItemId, quantity: quantity > 1 ? quantity - 1 : 1 })
    );

  const handleRemove = (cartItemId: string) =>
    dispatch(removeFromCart({ cartItemId }));

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 font-medium mt-10">
        Failed to load cart items.
      </div>
    );

  if (cartItems.length === 0)
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] text-gray-600">
        <Image
          src="/images/empty-cart.svg"
          alt="Empty cart"
          width={180}
          height={180}
          className="opacity-80 mb-4"
        />
        <p className="text-lg font-medium">Your cart is empty</p>
        <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
          <Link href={"/dashboard"}>Continue Shopping</Link>
        </Button>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 md:px-8">
      <h1 className="text-2xl font-bold mb-8 text-gray-800">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card
              key={item.id}
              className="flex items-center justify-between p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="relative w-20 h-20">
                  <Image
                    src={item.product.imageUrl || "/images/codart.png"}
                    alt={item.product.name}
                    fill
                    className="object-contain rounded-md"
                  />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-800">
                    {item.product.name}
                  </h2>
                  <p className="text-sm text-gray-500 line-clamp-2 max-w-xs">
                    {item.product.description}
                  </p>
                  <p className="text-sm text-blue-700 font-medium mt-1">
                    ${item.product.price.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center border rounded-md overflow-hidden">
                  <button
                    onClick={() => handleDecrease(item.id, item.quantity)}
                    className="px-3 py-1 text-lg font-bold hover:bg-gray-100"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={() => {}}
                    className="w-12 text-center border-x appearance-none outline-none
                      [&::-webkit-inner-spin-button]:appearance-none
                      [&::-webkit-outer-spin-button]:appearance-none
                      [-moz-appearance:textfield]"
                  />
                  <button
                    onClick={() => handleIncrease(item.id, item.quantity)}
                    className="px-3 py-1 text-lg font-bold hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(item.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Summary Section */}
        <Card className="h-fit p-6 bg-gray-50 shadow-sm">
          <CardContent className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Order Summary
            </h2>

            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-gray-700">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>

            <div className="border-t pt-3 flex justify-between text-gray-900 font-semibold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4">
              Proceed to Checkout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cart;
