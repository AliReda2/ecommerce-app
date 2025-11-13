// src/app/(main)/layout.tsx
"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/store";
import "@/app/globals.css";
import Navbar from "./component/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <main className="bg-[url('/images/pattern-bg.png')] bg-repeat bg-size-[300px_300px]">
        <Navbar />
        {children}
      </main>
    </Provider>
  );
}
