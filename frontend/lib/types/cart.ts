export interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
  };
}

export interface CartResponse {
  data: CartItem[];
  msg: string;
}