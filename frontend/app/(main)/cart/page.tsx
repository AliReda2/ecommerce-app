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
import { Loader2, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/lib/hooks";
import { createOrder } from "@/lib/features/orderSlice";
import toast from "react-hot-toast";
import useGoBack from "@/hooks/useGoBack";

const Cart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const goBack = useGoBack();

  const { cartItems, isLoading, error } = useAppSelector((state) => state.cart);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    setQuantities(
      cartItems.reduce((acc, item) => {
        acc[item.id] = item.quantity;
        return acc;
      }, {} as Record<string, number>)
    );
  }, [cartItems]);

  useEffect(() => {
    dispatch(getCartItems());
  }, [dispatch]);

  const handleIncrease = async (cartItemId: string) => {
    setUpdatingItemId(cartItemId);

    const newQty = (quantities[cartItemId] ?? 0) + 1;

    // Update UI immediately
    setQuantities((prev) => ({ ...prev, [cartItemId]: newQty }));

    try {
      await dispatch(updateQuantity({ cartItemId, quantity: newQty })).unwrap();
    } catch {
      // rollback
      setQuantities((prev) => ({
        ...prev,
        [cartItemId]: prev[cartItemId] - 1,
      }));
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleDecrease = async (cartItemId: string) => {
    setUpdatingItemId(cartItemId);

    const newQty = Math.max(1, (quantities[cartItemId] ?? 0) - 1);

    // Update UI immediately
    setQuantities((prev) => ({ ...prev, [cartItemId]: newQty }));

    try {
      await dispatch(updateQuantity({ cartItemId, quantity: newQty })).unwrap();
    } catch {
      // rollback
      setQuantities((prev) => ({
        ...prev,
        [cartItemId]: prev[cartItemId] + 1,
      }));
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemove = async (cartItemId: string) =>
    await dispatch(removeFromCart({ cartItemId }))
      .unwrap()
      .then(() => toast.success("order created"))
      .catch((error) => toast.error(error));

  const handleOrder = async () => {
    await dispatch(createOrder())
      .unwrap()
      .then(() => {
        toast.success("order created");
        dispatch(getCartItems());
      })
      .catch((error) => toast.error(error));
  };

  const total = cartItems.reduce(
    (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
    0
  );

  const slides = cartItems.map((item) => (
    <Card
      key={item.id}
      className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-5 rounded-xl border border-gray-100 shadow hover:shadow-lg transition-all duration-300 bg-white"
    >
      {/* Product Info */}
      <div className="flex items-center space-x-4 sm:space-x-5 w-full sm:w-auto">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0">
          <Image
            src={item.product?.imageUrl || "/images/codart.png"}
            alt={item.product?.name || "product name"}
            fill
            className="object-contain rounded-md bg-gray-50"
          />
        </div>

        <div className="flex flex-col flex-1 mt-2 sm:mt-0">
          <h2 className="font-semibold text-gray-800 text-lg">
            {item.product?.name}
          </h2>
          <p className="text-sm text-gray-500 line-clamp-2 max-w-sm mt-1">
            {item.product?.description}
          </p>
          <p className="text-base font-semibold text-blue-700 mt-2">
            ${item.product?.price.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Quantity & Remove */}
      <div className="flex items-center space-x-3 mt-3 sm:mt-0">
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <button
            onClick={() => handleDecrease(item.id)}
            className="px-3 py-1 text-lg font-bold hover:bg-gray-100 transition-colors disabled:opacity-50"
            disabled={updatingItemId === item.id}
          >
            {updatingItemId === item.id ? (
              <Loader2 className="animate-spin w-4 h-4 mx-auto" />
            ) : (
              "−"
            )}
          </button>

          <div className="px-3 py-1 text-center text-gray-800 font-medium min-w-10">
            {quantities[item.id] ?? item.quantity}
          </div>

          <button
            onClick={() => handleIncrease(item.id)}
            className="px-3 py-1 text-lg font-bold hover:bg-gray-100 transition-colors disabled:opacity-50"
            disabled={updatingItemId === item.id}
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
  ));

  if (error)
    return (
      <div className="text-center text-red-600 font-medium mt-10">
        Failed to load cart items.
      </div>
    );

  return (
    <div className="w-full bg-white min-h-[80vh]">
      <div className="max-w-6xl mx-auto py-12 px-4 md:px-8">
        {/* Back button */}
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-gray-700 mb-6 hover:text-gray-900 transition hover:cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
          <span className="font-medium">Back</span>
        </button>

        {isLoading && cartItems.length === 0 ? (
          <div className="flex justify-center items-center h-[60vh]">
            <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-[70vh] text-gray-600">
            <ShoppingCart size={110} className="text-gray-400" />
            <p className="text-2xl font-semibold mt-4">Your cart is empty</p>
            <p className="text-gray-500 mt-1">
              Add products to your cart to see them here.
            </p>
            <Button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-7 py-2.5 rounded-lg">
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Section: Cart Items */}
            <div className="lg:col-span-2 flex flex-col gap-5">{slides}</div>

            {/* Order Summary */}
            <Card className="h-fit bg-gray-50 shadow-md border border-gray-100 sticky top-5 rounded-xl">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-4">
                  Order Summary
                </h2>

                <div className="space-y-4 text-gray-700">
                  <div className="flex justify-between text-base">
                    <span>Subtotal</span>
                    <span className="font-medium">${total?.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-base">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>

                  <div className="border-t pt-4 flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>${total?.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-medium shadow-sm rounded-lg"
                  onClick={handleOrder}
                >
                  Proceed to Checkout
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 py-3 rounded-lg"
                >
                  <Link href="/">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
