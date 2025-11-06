export interface Order {
  id: string;
  totalPrice: number;
  status: OrderStatus; // adjust to your statuses
  createdAt: string; // or Date if you convert later
  userId: string;

  orderItems: {
    id: string;
    quantity: number;
    price: number;
    productId: string;
    orderId: string;
  }[];
}

export interface createOrderDto {
  totalPrice: number;
  status: OrderStatus; // adjust to your statuses
  userId: string;

  orderItems: {
    id: string;
    quantity: number;
    price: number;
    productId: string;
    orderId: string;
  }[];
}

export interface OrderResponse {
  data: Order[];
  msg: string;
}
export interface SingleOrderResponse {
  data: Order;
  msg: string;
}

export type OrderStatus = "PENDING" | "COMPLETED" | "CANCELLED";