export interface Category {
  id: string;
  name: string;
  imageUrl?: string;
}
export interface createCategoryDto {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface CategoryResponse {
  data: Category[];
  msg: string;
}
export interface SingleCategoryResponse {
  data: Category;
  msg: string;
}
