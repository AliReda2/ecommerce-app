"use client";

import { Button } from "@/components/ui/button";
import { banUser, unbanUser } from "@/lib/features/userSlice";
import { useAppDispatch } from "@/lib/hooks";

interface UpdateUserStatusProps {
  userId: string;
  userEmail: string;
  isActive: boolean;
}

const UpdateUserStatus = ({
  userId,
  userEmail,
  isActive,
}: UpdateUserStatusProps) => {
  const dispatch = useAppDispatch();

  const handleBanUser = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to ban user: ${userEmail}?`
    );
    if (!confirmed) return;

    try {
      // thunk now returns the updated User; reducer will merge it into state
      await dispatch(banUser(userId)).unwrap();
    } catch (err) {
      console.error("Failed to ban user:", err);
      alert("Failed to ban user. Please try again.");
    }
  };

  const handleUnbanUser = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to unban user: ${userEmail}?`
    );
    if (!confirmed) return;

    try {
      // thunk now returns the updated User; reducer will merge it into state
      await dispatch(unbanUser(userId)).unwrap();
    } catch (err) {
      console.error("Failed to unban user:", err);
      alert("Failed to unban user. Please try again.");
    }
  };

  return (
    <div>
      {isActive ? (
        <Button onClick={handleBanUser} variant={"destructive"}>
          BAN
        </Button>
      ) : (
        <Button onClick={handleUnbanUser} variant={"default"}>
          UNBAN
        </Button>
      )}
    </div>
  );
};

export default UpdateUserStatus;
