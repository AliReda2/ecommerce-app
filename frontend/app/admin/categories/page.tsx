"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  Table,
  TableCaption,
  TableHead,
} from "@/components/ui/table";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { useEffect } from "react";
import { fetchAllCategories } from "@/lib/features/categorySlice";
import type { Category } from "@/lib/types";
import Image from "next/image";

export default function Category() {
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.category);

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  if (categories.length === 0) {
    return (
      <>
        <h1>NO Categories To Display</h1>
        <Link href={"/admin"}>Go Back</Link>
      </>
    );
  }
  return (
    <Table>
      <TableCaption>A list of Categories</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Image</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories &&
          categories.map((cat: Category) => (
            <TableRow key={cat.id}>
              <TableCell className="font-medium">{cat.id}</TableCell>
              <TableCell> {cat.name}</TableCell>
              <TableCell> {cat.imageUrl && <Image src={cat.imageUrl} alt={cat.name} width={60} height={60} />}</TableCell>
              <TableCell className="text-right">
                <Button variant={"success"}>
                  <Link href={`/admin/categories/${cat.id}/update`}>
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
