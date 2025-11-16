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
import DeleteUser from "./components/DeleteUser";

const Users = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  return (
    <div className="overflow-x-auto p-4">
      <Table>
        <TableCaption>A list of Users.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Is Active</TableHead>
            <TableHead>Is Verified</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users &&
            users.map((user: User) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.isActive ? "✅ Active" : "⛔ Banned"}
                </TableCell>
                <TableCell>
                  {user.isVerified ? "✅ Verified" : "⛔ UnVerified"}
                </TableCell>
                <TableCell>{user.createdAt.toString()}</TableCell>
                <TableCell className="justify-center flex gap-1">
                  <UpdateUserStatus
                    userEmail={user.email}
                    userId={user.id}
                    isActive={user.isActive}
                  />
                  <DeleteUser userEmail={user.email} userId={user.id} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Users;
