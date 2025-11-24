import { Toaster } from "react-hot-toast";
import AdminLayoutWrapper from "./AdminLayoutWrapper";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminLayoutWrapper>
      {children} <Toaster position="top-right" reverseOrder={false} />
    </AdminLayoutWrapper>
  );
}
