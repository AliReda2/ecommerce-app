export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string;
  categoryId: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
  category: {
    name: string;
  };
}
export interface createProductDto {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryId: string;
  stock?: number;
}

export interface ProductResponse {
  data: Product[];
  msg: string;
}
export interface SingleProductResponse {
  data: Product;
  msg: string;
}
