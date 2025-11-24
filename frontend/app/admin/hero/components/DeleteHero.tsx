"use client";

import { Button } from "@/components/ui/button";
import { deleteHero } from "@/lib/features/heroSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const DeleteHero = ({ itemId }: { itemId: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isDeleting } = useSelector((state: RootState) => state.hero);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this hero?")) return;
    await dispatch(deleteHero(itemId))
      .unwrap()
      .then(() => {
        toast.success("hero deleted");
        router.refresh();
      })
      .catch((error) => toast.error(error));
  };

  return (
    <Button
      variant="destructive"
      size="default"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      {isDeleting ? "Deleting..." : "DELETE"}
    </Button>
  );
};

export default DeleteHero;
