"use client";

import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/lib/features/productSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

export default function DeleteProduct({ productId }: { productId: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.product);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await dispatch(deleteProduct(productId)).unwrap();
      router.refresh(); 
    } catch (err: unknown) {
      let msg = "Deleting product failed";
      if (typeof err === "string") {
        msg = err;
      } else if (
        err &&
        typeof err === "object" &&
        "message" in err &&
        typeof (err as { message: unknown }).message === "string"
      ) {
        msg = (err as { message: string }).message;
      }
      alert(msg);
    }
  };

  return (
    <Button
      variant="destructive"
      size="default"
      onClick={handleDelete}
      disabled={isLoading}
    >
      {isLoading ? "Deleting..." : "DELETE"}
    </Button>
  );
}
