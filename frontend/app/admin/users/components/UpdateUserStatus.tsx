"use client";

import { banUser, unbanUser, fetchAllUsers } from "@/lib/features/userSlice";
import { useAppDispatch } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface UpdateUserStatusProps {
  userId: string;
  userEmail: string;
  isBanned: boolean;
}

const UpdateUserStatus = ({
  userId,
  userEmail,
  isBanned,
}: UpdateUserStatusProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleUpdateStatus = async () => {
    const action = isBanned ? "unban" : "ban";
    const confirmed = window.confirm(
      `Are you sure you want to ${action} user: ${userEmail}?`
    );
    if (!confirmed) return;

    try {
      if (isBanned) {
        await dispatch(unbanUser(userId)).unwrap();
      } else {
        await dispatch(banUser(userId)).unwrap();
      }

      router.refresh(); // 👈 Forces server component to re-fetch data
    } catch (err) {
      console.error(`Failed to ${action} user:`, err);
      alert(`Failed to ${action} user. Please try again.`);
    }
  };

  return (
    <Button
      variant={isBanned ? "default" : "destructive"}
      onClick={handleUpdateStatus}
    >
      {isBanned ? "Unban User" : "Ban User"}
    </Button>
  );
};

export default UpdateUserStatus;
