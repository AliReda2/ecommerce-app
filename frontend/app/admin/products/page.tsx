import Link from "next/link";
import ComponentCard from "@/components/admin/common/ComponentCard";
import PageBreadcrumb from "@/components/admin/common/PageBreadCrumb";
import Badge from "@/components/admin/ui/badge/Badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/admin/ui/table";
import type { Product } from "@/lib/types/product";
import DeleteProduct from "./components/DeleteProduct";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function Product() {
  const response = await fetch(`${BASE_URL}/product`);
  const { data } = await response.json();

  if (data.length === 0) {
    return (
      <>
        <h1>NO Products To Display</h1>
        <Link href={"/admin"}>Go Back</Link>
      </>
    );
  }
  return (
    <>
      <PageBreadcrumb pageTitle="Basic Tables" />
      <div className="space-y-6">
        <ComponentCard>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[1102px]">
                <Table>
                  {/* Table Header */}
                  <TableHeader className="border-b border-gray-100 dark:border-white/5">
                    <TableRow>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Product
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Category
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Stock
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Price
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                      >
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  {/* Table Body */}
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                    {data &&
                      data.map((product: Product) => (
                        <TableRow key={product.id}>
                          <TableCell className="px-5 py-4 sm:px-6 text-start">
                            <div className="flex items-center gap-3">
                              <Avatar className="size-14">
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
                              <div>
                                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                  {product.name}
                                </span>
                                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                  {product.description}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {product?.category?.name ?? "null"}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            <Badge
                              size="sm"
                              color={product.stock === 0 ? "warning" : "light"}
                            >
                              {product.stock}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                            {product.price}
                          </TableCell>
                          <TableCell className="flex justify-evenly px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                            <DeleteProduct productId={product.id} />
                            <Button>
                              <Link
                                href={`/admin/products/${product.id}/update`}
                              >
                                Update
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
