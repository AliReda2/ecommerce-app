"use client";

import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import UpdateOrderStatus from "./UpdateOrderStatus";
import { useRouter } from "next/navigation";
import { Order } from "@/lib/types";

export default function OrderRow({ order }: { order: Order }) {
  const router = useRouter();

  const getVariant = (status: string) => {
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

  return (
    <TableRow onClick={() => router.replace(`/admin/orders/${order.id}`)}>
      <TableCell>{order.userId}</TableCell>
      <TableCell>
        <Badge variant={getVariant(order.status)}>{order.status}</Badge>
      </TableCell>
      <TableCell>{order.totalPrice}</TableCell>
      <TableCell>{order.createdAt}</TableCell>
      <TableCell className="text-center">
        <UpdateOrderStatus orderId={order.id} status="COMPLETED" />
        <UpdateOrderStatus orderId={order.id} status="PENDING" />
        <UpdateOrderStatus orderId={order.id} status="CANCELLED" />
      </TableCell>
    </TableRow>
  );
}
