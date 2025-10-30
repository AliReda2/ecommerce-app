"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";

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
      router.replace("/login");
    }
  }, [authChecked, user, router]);

  // optional: show a loading state while auth is being checked
  if (!authChecked) return null; // or a spinner component

  return <main className="flex-1 p-4">{children}</main>;
}
