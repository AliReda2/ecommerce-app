import "leaflet/dist/leaflet.css";
import "@/app/globals.css";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import { ClientProvider } from "./clientProvider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[url('/images/pattern-bg.png')] bg-repeat bg-size-[300px_300px]">
      <ClientProvider>
        <Navbar />
      </ClientProvider>
      <main className="flex-1 mt-24">{children}</main>
      <Footer />
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
