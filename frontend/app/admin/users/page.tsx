"use client";
import { useEffect, useState } from "react";
import UsersTable from "./components/UsersTable";
import { api } from "@/api/axios";

export default function Users() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get("/users");
        if (!mounted) return;
        setData(res.data.data);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.response?.data?.message || e?.message || "Failed to load users");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div className="p-4">Loading users…</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  return <UsersTable data={data} />;
}
