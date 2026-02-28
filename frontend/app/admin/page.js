import { Package, ShoppingCart, IndianRupee } from "lucide-react";

const metrics = [
  {
    title: "Total Products",
    value: "12",
    icon: Package,
    bg: "bg-blue-100",
    text: "text-blue-600",
  },
  {
    title: "Total Orders",
    value: "5",
    icon: ShoppingCart,
    bg: "bg-green-100",
    text: "text-green-600",
  },
  {
    title: "Revenue",
    value: "₹4,500",
    icon: IndianRupee,
    bg: "bg-purple-100",
    text: "text-purple-600",
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-gray-800">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map(({ title, value, icon: Icon, bg, text }) => (
          <div
            key={title}
            className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm"
          >
            <div className={`rounded-xl ${bg} p-3`}>
              <Icon size={24} className={text} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{title}</p>
              <p className="text-2xl font-semibold text-gray-800">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
