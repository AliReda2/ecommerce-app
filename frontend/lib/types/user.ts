export interface RegisterUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
export interface RegisterResponse {
  msg: string;
  userId: string;
}
export interface LoginUser {
  email: string;
  password: string;
}

export interface User {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  address?: string;
  coordinates?: string;
  phone?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface UpdateUser {
  firstName: string;
  lastName: string;
  address: string;
  coordinates: string;
  phone: string;
}
export interface UserResponse {
  data: User[];
  msg: string;
}
export interface SingleUserResponse {
  data: User;
  msg: string;
}

export type UserRole = "CUSTOMER" | "ADMIN" | "SUPERADMIN";
