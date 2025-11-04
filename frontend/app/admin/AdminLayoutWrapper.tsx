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
  // hydrate auth from cookie / verify on mount
  useEffect(() => {
    console.log("[AdminLayoutWrapper] dispatching checkAuth...");
    // The promise resolves with the action; log outcome for debugging
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (store.dispatch(checkAuth()) as unknown as Promise<any>)
      .then((action) => {
        console.log("[AdminLayoutWrapper] checkAuth finished", action?.type, action);
      })
      .catch((e) => {
        console.error("[AdminLayoutWrapper] checkAuth error", e);
      });
  }, []);

  return (
    <Provider store={store}>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </Provider>
  );
}
