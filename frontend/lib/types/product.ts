export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface createProductDto {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category: string;
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
