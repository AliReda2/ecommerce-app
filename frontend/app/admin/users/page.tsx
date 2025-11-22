import UpdateUserStatus from "./components/UpdateUserStatus";
import { User } from "@/lib/types";

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
import { cookies } from "next/headers";

const Users = async () => {
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get("access_token")?.value;
  const refreshToken = (await cookieStore).get("refresh_token")?.value;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
    cache: "no-store",
    headers: {
      Cookie: `access_token=${accessToken}; refresh_token=${refreshToken}`,
    },
  });

  const payload = await res.json();
  const users = payload.data;
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
