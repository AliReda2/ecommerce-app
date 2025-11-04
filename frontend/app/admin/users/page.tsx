import { cookies } from "next/headers";
import UsersTable from "./components/UsersTable";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const Users = async () => {
  const token = (await cookies()).get("access_token")?.value;

  const response = await fetch(`${BASE_URL}/users`, {
    method: "GET",
    cache: "no-store",
    headers: {
      Cookie: `access_token=${token}`, // <-- send token in header
    },
    credentials: "include",
  });

  const result = await response.json();

  return <UsersTable data={result.data} />;
};

export default Users;
