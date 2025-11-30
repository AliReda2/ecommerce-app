import {
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  Table,
} from "@/components/ui/table";
import OrderRow from "./components/OrderRow";
import { Order } from "@/lib/types";
import { cookies } from "next/headers";

export default async function OrdersPage() {
  const isProd = process.env.NODE_ENV === "production";

  let res;
  if (isProd) {
    // Production: client/browser fetch should include cookies automatically
    res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/order`, {
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

    res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/order`, {
      cache: "no-store",
      headers: {
        Cookie: cookieHeader, // send cookies explicitly
      },
    });
  }

  const payload = await res.json();
  const orders = payload.data;

  if (!orders || orders.length === 0) {
    return <h1>No orders to display</h1>;
  }

  return (
    <Table>
      <TableCaption>A list of Orders</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>User ID</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Total Price</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order: Order) => (
          <OrderRow key={order.id} order={order} />
        ))}
      </TableBody>
    </Table>
  );
}
