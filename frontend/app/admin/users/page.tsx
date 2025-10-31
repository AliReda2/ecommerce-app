"use client";

import { useEffect } from "react";
import { banUser, unbanUser, fetchAllUsers } from "@/lib/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Link from "next/link";

const Users = () => {
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
    <>
      <div className="overflow-x-auto p-4">
        <table className="min-w-full border border-gray-300 text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">First Name</th>
              <th className="px-4 py-2 border">Last Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Is Active</th>
              <th className="px-4 py-2 border">Updated At</th>
              <th className="px-4 py-2 border">Created At</th>
              <th className="px-4 py-2 border text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{user.id}</td>
                  <td className="px-4 py-2 border">{user.firstName}</td>
                  <td className="px-4 py-2 border">{user.lastName}</td>
                  <td className="px-4 py-2 border">{user.email}</td>
                  <td className="px-4 py-2 border">
                    {user.isActive ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(user.updatedAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(user.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border text-center">
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
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Link href={"/admin"}>Go Back</Link>
    </>
  );
};

export default Users;
