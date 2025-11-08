export interface RegisterUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
export interface RegisterResponse {
  message: string;
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
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface UserResponse {
  data: User[];
  msg: string;
}
export interface SingleUserResponse {
  data: User;
  msg: string;
}

export type UserRole = "CUSTOMER" | "ADMIN";
