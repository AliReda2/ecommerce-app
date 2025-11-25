"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cancelOrder, fetchMyOrders } from "@/lib/features/orderSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import useGoBack from "@/hooks/useGoBack";

export default function UserOrdersPage() {
  const dispatch = useAppDispatch();
  const goBack = useGoBack();

  const { userOrders, isLoading, error } = useAppSelector(
    (state) => state.order
  );

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const handleCancelOrder = async (orderId: string) => {
    await dispatch(cancelOrder({ orderId }))
      .unwrap()
      .then(() => toast.success("Order cancelled"))
      .catch((error) => toast.error(error));
  };

  if (isLoading) {
    return (
      <div className="p-10 space-y-4">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    );
  }

  // No orders state
  if (!isLoading && userOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 font-medium text-lg">No Orders Found</p>
        <Button className="mt-4" onClick={goBack}>
          Go Back
        </Button>
      </div>
    );
  }

  // Orders grid
  return (
    <div className="p-10 space-y-6">
      <button className="flex items-center gap-2 mb-4" onClick={goBack}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
        Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userOrders.map((order) => (
          <Card
            key={order.id}
            className="border shadow-sm hover:shadow-lg transition rounded-2xl flex flex-col"
          >
            <CardHeader className="bg-gray-50 rounded-t-2xl p-4">
              <CardTitle className="text-lg font-semibold truncate">
                Order #{order.id}
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Status:{" "}
                <span
                  className={`font-medium ${
                    order.status === "PENDING"
                      ? "text-yellow-600"
                      : order.status === "COMPLETED"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {order.status}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                Date: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </CardHeader>

            <CardContent className="space-y-3 p-4 flex flex-col flex-1">
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between space-x-3"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 relative shrink-0">
                      <Image
                        src={item.product.imageUrl || "/images/codart.webp"}
                        alt={item.product.name}
                        fill
                        className="object-contain rounded-lg"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800">
                        {item.product.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </span>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-800">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
              ))}

              <div className="mt-auto">
                <hr className="my-2 border-gray-200" />
                <div className="flex justify-between items-center font-semibold text-gray-900 text-lg">
                  <span>Total:</span>
                  <span>${order.totalPrice.toFixed(2)}</span>
                  <Button
                    variant={"destructive"}
                    onClick={() => handleCancelOrder(order.id)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
