export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}

export interface CategoryResponse {
  data: Category[];
  msg: string;
}
export interface SingleCategoryResponse {
  data: Category;
  msg: string;
}
