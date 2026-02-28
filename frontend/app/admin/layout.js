import AdminSidebar from "@/components/AdminSidebar";

export const metadata = {
  title: "Marvel Admin",
  description: "Admin dashboard for Marvel Kids & Sports Wear",
};

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
        {children}
      </main>
    </div>
  );
}
