'use client';

import { Button } from "@/components/ui/button";
import { TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { Order, OrderStatus, Product } from "@/lib/types";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import DeleteProduct from "../products/components/DeleteProduct";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useEffect } from "react";
import { fetchAllOrders } from "@/lib/features/orderSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import UpdateOrderStatus from "./components/UpdateOrderStatus";


const OrdersPage = () => {
    const dispatch = useAppDispatch();
    const { orders } = useAppSelector((state) => state.order);

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
                    <TableHead className="">Order ID</TableHead>
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
                        <TableRow key={order.id}>
                            <TableCell> {order.id}</TableCell>
                            <TableCell> {order.userId}</TableCell>
                            <TableCell>
                                <Badge variant={getVariant(order.status)}>
                                    {order.status}
                                </Badge>
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
