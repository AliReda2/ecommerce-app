"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import AppLayout from "@/components/admin/layout/AppLayout";
import { ThemeProvider } from "@/components/admin/context/ThemeContext";

const allowedRoles = ["ADMIN", "SUPERADMIN"];

export default function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const authChecked = useAppSelector((state) => state.auth.authChecked);

  useEffect(() => {
    if (authChecked) {
      const isAllowed =
        user && allowedRoles.includes(String(user.role).toUpperCase());

      if (!isAllowed) {
        router.replace("/admin-auth/login");
      }
    }
  }, [authChecked, user, router]);

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const isAllowed =
    user && allowedRoles.includes(String(user.role).toUpperCase());

  if (!isAllowed) {
    return null;
  }

  return (
    <ThemeProvider>
      <AppLayout>{children}</AppLayout>
    </ThemeProvider>
  );
}
