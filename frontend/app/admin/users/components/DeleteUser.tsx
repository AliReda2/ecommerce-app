"use client";

import { Button } from "@/components/ui/button";
import { deleteUser } from "@/lib/features/userSlice";
import { useAppDispatch } from "@/lib/hooks";

interface DeleteUserProps {
  userId: string;
  userEmail: string;
}

const DeleteUser = ({ userId, userEmail }: DeleteUserProps) => {
  const dispatch = useAppDispatch();

  const handleDeleteUser = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to DELETE user: ${userEmail}?`
    );
    if (!confirmed) return;

    try {
      await dispatch(deleteUser(userId)).unwrap();
    } catch (err) {
      console.error("Failed to Delete user:", err);
    }
  };

  return (
    <div>
      <Button onClick={handleDeleteUser} variant={"destructive"}>
        DELETE
      </Button>
    </div>
  );
};

export default DeleteUser;
