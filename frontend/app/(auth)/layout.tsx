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
  return <Provider store={store}>{children}</Provider>;
}
