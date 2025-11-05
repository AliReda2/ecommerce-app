"use client";

import { useDispatch, useSelector } from "react-redux";
import UpdateUserStatus from "./components/UpdateUserStatus";
import { User } from "@/lib/types";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchAllUsers } from "@/lib/features/userSlice";
import { useEffect } from "react";
import {
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";

const Users = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, users } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  return (
    <div className="overflow-x-auto p-4">
      <Table>
        <TableCaption>A list of Users.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Is Active</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users &&
            users.map((user: User) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.isActive ? "✅ Active" : "⛔ Banned"}
                </TableCell>
                <TableCell>{user.createdAt.toString()}</TableCell>
                <TableCell className="text-right">
                  <UpdateUserStatus
                    userEmail={user.email}
                    userId={user.id}
                    isActive={user.isActive}
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Users;
