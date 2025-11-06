"use client";

import { Button } from "@/components/ui/button";
import { updateOrderStatus } from "@/lib/features/orderSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { OrderStatus } from "@/lib/types";
import { useDispatch, useSelector } from "react-redux";

const UpdateOrderStatus = ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading } = useSelector((state: RootState) => state.order);


    const handleUpdate = async () => {
        try {
            await dispatch(updateOrderStatus({ orderId, status })).unwrap();
        } catch (e) {
            console.error(e);
        }
    };

    // ✅ Map status -> button variant
    const getVariant = () => {
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

    const variant = getVariant();

    return (
        <Button onClick={handleUpdate} variant={variant} disabled={isLoading}>
            {isLoading ? "Updating..." : status}
        </Button>
    );
};

export default UpdateOrderStatus;
