"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import AppLayout from "@/components/admin/layout/AppLayout"; // Import the fixed AppLayout
import { ThemeProvider } from "@/components/admin/context/ThemeContext";

export default function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const authChecked = useAppSelector((state) => state.auth.authChecked);

  useEffect(() => {
    // Wait until we've checked auth (hydration or refresh attempt)
    if (authChecked && (!user || user.role !== "ADMIN")) {
      router.replace("/admin-auth/login");
    }
  }, [authChecked, user, router]);

  // Show a loading state while auth is being checked
  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // If not authorized, don't render the layout
  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return (
    <ThemeProvider>
      <AppLayout>{children}</AppLayout>
    </ThemeProvider>
  );
}
