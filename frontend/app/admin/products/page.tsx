import Link from "next/link";
import ComponentCard from "@/components/admin/common/ComponentCard";
import PageBreadcrumb from "@/components/admin/common/PageBreadCrumb";

import type { Product } from "@/lib/types/product";
import DeleteProduct from "./components/DeleteProduct";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  Table,
  TableCaption,
  TableHead,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function Product() {
  const response = await fetch(`${BASE_URL}/product`);
  const { data } = await response.json();

  if (data.length === 0) {
    return (
      <>
        <h1>NO Products To Display</h1>
      </>
    );
  }
  return (
    <Table>
      <TableCaption>A list of Products</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Price</TableHead>
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data &&
          data.map((product: Product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium flex">
                <Avatar className="size-12">
                  <AvatarImage src={product.imageUrl} />
                  <AvatarFallback>
                    <Image
                      src={"/images/codart.png"}
                      alt={product.name}
                      width={60}
                      height={60}
                    />
                  </AvatarFallback>
                </Avatar>
              <TableCell> {product.name}</TableCell>
              </TableCell>
              <TableCell> {product.description}</TableCell>
              <TableCell> {product?.category?.name ?? "null"}</TableCell>
              <TableCell>
                <Badge color={product.stock === 0 ? "warning" : "light"}>
                  {product.stock}
                </Badge>
              </TableCell>
              <TableCell> {product.price}</TableCell>
              <TableCell className="text-right">
                <DeleteProduct productId={product.id} />
                <Button>
                  <Link href={`/admin/products/${product.id}/update`}>
                    Update
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
