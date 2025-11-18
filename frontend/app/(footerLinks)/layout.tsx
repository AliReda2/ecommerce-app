import type { ReactNode } from "react";
import Footer from "../(main)/component/Footer";

export default function FooterLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
