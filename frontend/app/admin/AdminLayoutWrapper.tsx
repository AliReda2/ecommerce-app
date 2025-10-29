"use client";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import AdminLayoutContent from "./AdminLayoutContent";

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </Provider>
  );
}
