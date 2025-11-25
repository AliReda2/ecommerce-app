"use client";

import GridShape from "@/components/admin/common/GridShape";
import ThemeTogglerTwo from "@/components/admin/common/ThemeTogglerTwo";
import { ThemeProvider } from "@/components/admin/context/ThemeContext";
import { store } from "@/lib/store";
import Image from "next/image";
import Link from "next/link";
import { Provider } from "react-redux";
import "@/app/globals.css";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
          <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
            {children}

            <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
              <div className="relative flex items-center justify-center z-1">
                <GridShape />
                <div className="flex flex-col items-center max-w-xs">
                  <Link href="/">
                    <Image
                      src="/images/codart.webp"
                      width={231}
                      height={48}
                      alt="Logo"
                    />
                  </Link>
                  <p className="text-center text-gray-400 dark:text-white/60">
                    Somthing something ...
                  </p>
                </div>
              </div>
            </div>

            <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
              <ThemeTogglerTwo />
            </div>
          </div>
        </div>
      </ThemeProvider>
    </Provider>
  );
}
