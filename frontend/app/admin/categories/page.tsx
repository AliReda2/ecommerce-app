import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import Image from "next/image";
import { Category } from "@/lib/types";
import { cookies } from "next/headers";

export default async function CategoryPage() {
  const cookieStore = cookies();
  const access = (await cookieStore).get("access_token")?.value ?? "";
  const refresh = (await cookieStore).get("refresh_token")?.value ?? "";

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/category`, {
    cache: "no-store",
    headers: {
      Cookie: `access_token=${access}; refresh_token=${refresh}`,
    },
  });

  const payload = await res.json();
  const categories: Category[] = payload.data;

  if (!categories || categories.length === 0) {
    return (
      <>
        <h1>No Categories To Display</h1>
        <Link href="/admin">Go Back</Link>
      </>
    );
  }

  return (
    <Table>
      <TableCaption>A list of Categories</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead>Image</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {categories.map((cat) => (
          <TableRow key={cat.id}>
            <TableCell className="font-medium">{cat.name}</TableCell>

            <TableCell>
              {cat.imageUrl && (
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  width={60}
                  height={60}
                />
              )}
            </TableCell>

            <TableCell className="text-right">
              <Button variant="success">
                <Link href={`/admin/categories/${cat.id}/update`}>Update</Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
