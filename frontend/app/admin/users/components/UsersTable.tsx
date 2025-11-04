"use client";

import {
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { User } from "@/lib/types";

const UsersTable = ({data}:{data:User[]}) => {
  return (
    <Table>
      <TableCaption>Users</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>is Active</TableHead>
          <TableHead className="text-right">Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data &&
          data.map((user: User) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.fullName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.isActive ? "✅" : "❌"}</TableCell>
              <TableCell className="text-right">
                {new Date(user.createdAt).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
      {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total Users</TableCell>
          <TableCell className="text-right">{data.length}</TableCell>
        </TableRow>
      </TableFooter> */}
    </Table>
  );
};

export default UsersTable;
