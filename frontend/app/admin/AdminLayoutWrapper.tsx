"use client";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import AdminLayoutContent from "./AdminLayoutContent";
import { useEffect } from "react";
import { checkAuth } from "@/lib/features/authSlice";

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // hydrate auth from localStorage / refresh token on mount
  useEffect(() => {
    store.dispatch(checkAuth());
  }, []);

  return (
    <Provider store={store}>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </Provider>
  );
}
