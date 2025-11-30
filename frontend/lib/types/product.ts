export interface Product {
  id: string;
  slug?: string;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string;
  categoryId?: string | null;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
  category: string | null;
  tags: string[];
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
