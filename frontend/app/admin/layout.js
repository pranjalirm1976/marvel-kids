import AdminSidebar from "@/components/AdminSidebar";

export const metadata = {
  title: "MARVELS Admin",
  description: "Admin dashboard for MARVELS Fashion",
};

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-[#fafafa] p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
