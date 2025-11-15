"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect } from "react";
import { fetchOrderById } from "@/lib/features/orderSlice";

const MapComponent = dynamic(() => import("./map"), { ssr: false });

export default function OrderPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { currentOrder: order, isLoading } = useAppSelector(
    (state) => state.order
  );

  useEffect(() => {
    if (typeof id === "string") {
      dispatch(fetchOrderById({ id }));
    }
  }, [id, dispatch]);

  if (isLoading) return <p className="p-6">Loading...</p>;
  if (!order) return <p className="p-6">Order not found.</p>;

  const [lat, lng] = order.user.coordinates
    .split(",")
    .map((n) => parseFloat(n.trim()));

  return (
    <div className="container mx-auto p-6">
      {/* Order Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Order ID:</strong> {order.id}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>

          <h3 className="mt-5 text-lg font-semibold">Customer Info</h3>
          <p>
            <strong>Name:</strong> {order.user.firstName} {order.user.lastName}
          </p>
          <p>
            <strong>Email:</strong> {order.user.email}
          </p>
          <p>
            <strong>Address:</strong> {order.user.address}
          </p>
          <p>
            <strong>Coordinates:</strong> {order.user.coordinates}
          </p>

          <div className="h-72 mt-4 rounded-xl overflow-hidden border">
            <MapComponent lat={lat} lng={lng} />
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {order.orderItems.map((item) => (
              <div key={item.id} className="flex gap-4 border p-3 rounded-xl">
                <Image
                  src={item.product.imageUrl}
                  width={90}
                  height={90}
                  alt={item.product.name}
                  className="rounded-lg object-cover"
                />
                <div>
                  <p className="font-semibold">{item.product.name}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ${item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
