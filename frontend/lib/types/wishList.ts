export interface WishList {
  id: string;
  userId: string;
  productId: string;
  product: {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    imageUrl?: string | null;
    categoryId: string;
    category?: {
      name: string;
    } | null;
  };
}
export interface WishListResponse {
  data: WishList[];
  msg: string;
}

export interface AddWishListResponse {
  data: WishList;
  msg: string;
}