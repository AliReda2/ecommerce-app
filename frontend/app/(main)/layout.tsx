"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/store";
import "@/app/globals.css";
import Navbar from "./component/Navbar";
import { Toaster } from "react-hot-toast";
import Footer from "./component/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <main className="pt-26 bg-[url('/images/pattern-bg.png')] bg-repeat bg-size-[300px_300px]">
        <Navbar />
        {children}
        <Toaster position="top-right" reverseOrder={false} />
        <Footer />
      </main>
    </Provider>
  );
}
