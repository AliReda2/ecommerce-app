"use client";

import {
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { Order, OrderStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import { fetchAllOrders } from "@/lib/features/orderSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import UpdateOrderStatus from "./components/UpdateOrderStatus";
import { useRouter } from "next/navigation";

const OrdersPage = () => {
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector((state) => state.order);
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const getVariant = (status: OrderStatus) => {
    switch (status) {
      case "CANCELLED":
        return "destructive";
      case "PENDING":
        return "pending";
      case "COMPLETED":
        return "success";
      default:
        return "default";
    }
  };

  const handleViewOrder = (id: string) => {
    router.replace(`/admin/orders/${id}`);
  };

  if (orders?.length === 0) {
    return (
      <>
        <h1>NO Orders To Display</h1>
      </>
    );
  }
  return (
    <Table>
      <TableCaption>A list of Orders</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="">User ID</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Total Price</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders &&
          orders.map((order: Order) => (
            <TableRow key={order.id} onClick={() => handleViewOrder(order.id)}>
              <TableCell> {order.userId}</TableCell>
              <TableCell>
                <Badge variant={getVariant(order.status)}>{order.status}</Badge>
              </TableCell>
              <TableCell> {order.totalPrice}</TableCell>
              <TableCell> {order.createdAt}</TableCell>
              <TableCell className="text-center">
                <UpdateOrderStatus orderId={order.id} status={"COMPLETED"} />
                <UpdateOrderStatus orderId={order.id} status={"PENDING"} />
                <UpdateOrderStatus orderId={order.id} status={"CANCELLED"} />
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default OrdersPage;
