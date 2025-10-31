// src/app/(main)/layout.tsx
"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/store";
import "@/app/globals.css";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <main className="flex-1 p-4 ">{children}</main>
    </Provider>
  );
}
