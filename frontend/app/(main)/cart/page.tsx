"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import {
  getCartItems,
  removeFromCart,
  updateCartItemQuantity as updateQuantity,
} from "@/lib/features/cartSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/lib/hooks";

const Cart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cartItems, isLoading, error } = useAppSelector((state) => state.cart);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getCartItems()).finally(() => setIsInitialLoading(false));
  }, [dispatch]);

  // Initialize quantities whenever cartItems changes
  useEffect(() => {
    const initialQuantities: Record<string, number> = {};
    cartItems.forEach((item) => {
      initialQuantities[item.id] = item.quantity;
    });
    setQuantities(initialQuantities);
  }, [cartItems]);

  const handleIncrease = async (cartItemId: string) => {
    setUpdatingItemId(cartItemId);

    setQuantities((prev) => ({ ...prev, [cartItemId]: prev[cartItemId] + 1 }));
    await dispatch(
      updateQuantity({ cartItemId, quantity: quantities[cartItemId] + 1 })
    );
    setUpdatingItemId(null);
  };

  const handleDecrease = async (cartItemId: string) => {
    const newQuantity = Math.max(1, quantities[cartItemId] - 1);
    setQuantities((prev) => ({ ...prev, [cartItemId]: newQuantity }));
    await dispatch(updateQuantity({ cartItemId, quantity: newQuantity }));
  };

  const handleRemove = (cartItemId: string) =>
    dispatch(removeFromCart({ cartItemId }));

  let total = 0;
  total = cartItems.reduce(
    (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
    0
  );

  // ─── Loading State ───────────────────────────────
  if (isInitialLoading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );

  // ─── Error State ───────────────────────────────
  if (error)
    return (
      <div className="text-center text-red-600 font-medium mt-10">
        Failed to load cart items.
      </div>
    );

  // ─── Empty Cart ───────────────────────────────
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
        <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
          <Link href="/dashboard">Continue Shopping</Link>
        </Button>
      </div>
    );

  // ─── Cart Items ───────────────────────────────
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 md:px-8">
      <h1 className="text-3xl font-bold mb-10 text-gray-800">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Cart Items */}
        <div className="lg:col-span-2 space-y-5">
          {cartItems.map((item) => (
            <Card
              key={item.id}
              className="flex items-center justify-between p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
            >
              {/* Product Info */}
              <div className="flex items-center space-x-5">
                <div className="relative w-24 h-24 shrink-0">
                  <Image
                    src={item.product.imageUrl || "/images/codart.png"}
                    alt={item.product.name}
                    fill
                    className="object-contain rounded-md bg-gray-50"
                  />
                </div>

                <div className="flex flex-col">
                  <h2 className="font-semibold text-gray-800 text-lg">
                    {item.product.name}
                  </h2>
                  <p className="text-sm text-gray-500 line-clamp-2 max-w-sm mt-1">
                    {item.product.description}
                  </p>
                  <p className="text-base font-semibold text-blue-700 mt-2">
                    ${item.product.price.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Quantity & Remove */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <button
                    onClick={() => handleDecrease(item.id)}
                    className="px-3 py-1 text-lg font-bold hover:bg-gray-100 transition-colors disabled:opacity-50"
                    disabled={updatingItemId === item.id} // disable during update
                  >
                    {updatingItemId === item.id ? (
                      <Loader2 className="animate-spin w-4 h-4 mx-auto" />
                    ) : (
                      "−"
                    )}
                  </button>

                  <div className="px-3 py-1 text-center text-gray-800 font-medium min-w-10">
                    {quantities[item.id] || item.quantity}
                  </div>

                  <button
                    onClick={() => handleIncrease(item.id)}
                    className="px-3 py-1 text-lg font-bold hover:bg-gray-100 transition-colors disabled:opacity-50"
                    disabled={updatingItemId === item.id} // disable during update
                  >
                    {updatingItemId === item.id ? (
                      <Loader2 className="animate-spin w-4 h-4 mx-auto" />
                    ) : (
                      "+"
                    )}
                  </button>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(item.id)}
                  className="text-red-500 hover:text-red-600"
                  title="Remove item"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Right: Summary */}
        <Card className="h-fit bg-gray-50 shadow-sm border border-gray-100">
          <CardContent className="p-6 space-y-5">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">
              Order Summary
            </h2>

            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total?.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>

              <div className="border-t pt-4 flex justify-between text-lg font-semibold text-gray-900">
                <span>Total</span>
                <span>${total?.toFixed(2)}</span>
              </div>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 text-base font-medium mt-3">
              Proceed to Checkout
            </Button>

            <Button
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <Link href="/dashboard">Continue Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cart;
