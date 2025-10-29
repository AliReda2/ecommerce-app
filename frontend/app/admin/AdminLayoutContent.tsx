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

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      router.replace("/login");
    }
  }, [user, router]);

  return <main className="flex-1 p-4">{children}</main>;
}
