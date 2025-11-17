export interface CartItem {
  id: string;
  quantity: number;
  productId: string;
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
export interface SingleCartResponse {
  data: CartItem;
  msg: string;
}
