export interface Order {
  id: string;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  userId: string;

  orderItems: {
    id: string;
    quantity: number;
    price: number;
    productId: string;
    orderId: string;
  }[];
}
export interface UserOrder {
  id: string;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;

  orderItems: {
    id: string;
    quantity: number;
    price: number;
    product: {
      name: string;
      imageUrl: string;
    };
  }[];
}

export interface createOrderDto {
  totalPrice: number;
  status: OrderStatus;
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
export interface UserOrderResponse {
  data: UserOrder[];
  msg: string;
}
export interface SingleOrderResponse {
  data: Order;
  msg: string;
}

export type OrderStatus = "PENDING" | "COMPLETED" | "CANCELLED";
