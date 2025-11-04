"use client";

import { useEffect } from "react";
import { banUser, unbanUser, fetchAllUsers } from "@/lib/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
const UpdateUserStatus = () => {
  const dispatch = useAppDispatch();
  const { users, isLoading, error } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // ✅ Ban user with confirmation
  const handleBanUser = async (userId: string, userEmail: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to ban user: ${userEmail}?`
    );
    if (!confirmed) return;

    try {
      await dispatch(banUser(userId)).unwrap();
      await dispatch(fetchAllUsers());
    } catch (err) {
      console.error("Failed to ban user:", err);
      alert("Failed to ban user. Please try again.");
    }
  };

  // ✅ Unban user with confirmation
  const handleUnbanUser = async (userId: string, userEmail: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to unban user: ${userEmail}?`
    );
    if (!confirmed) return;

    try {
      await dispatch(unbanUser(userId)).unwrap();
      await dispatch(fetchAllUsers());
    } catch (err) {
      console.error("Failed to unban user:", err);
      alert("Failed to unban user. Please try again.");
    }
  };

  if (isLoading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  return (
    <div className="px-4 py-2 border text-center">
      {user.isActive ? (
        <button
          onClick={() => handleBanUser(user.id, user.email)}
          className="btn btn-destructive"
        >
          BAN
        </button>
      ) : (
        <button
          onClick={() => handleUnbanUser(user.id, user.email)}
          className="btn btn-primary"
        >
          UNBAN
        </button>
      )}
    </div>
  );
};

export default UpdateUserStatus;
