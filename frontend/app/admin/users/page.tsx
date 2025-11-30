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
  const isProd = process.env.NODE_ENV === "production";

  let res;

  if (isProd) {
    // Production: client/browser fetch should include cookies automatically
    res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
      cache: "no-store",
      credentials: "include", // browser sends HttpOnly cookies
    });
  } else {
    // Development: server-side fetch, forward cookies manually
    const cookieStore = cookies();
    const cookieHeader = (await cookieStore)
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
      cache: "no-store",
      headers: {
        Cookie: cookieHeader, // send cookies explicitly
      },
    });
  }

  const payload = await res.json();
  const users = payload.data;
  console.log(payload);
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
