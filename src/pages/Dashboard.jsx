import { Link } from "react-router-dom";
import { Users, Settings, LogOut } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-indigo-700">
            Admin Dashboard
          </h1>
          <Link
            to="/login"
            className="flex items-center gap-2 text-rose-600 hover:text-rose-700 transition text-base font-medium"
          >
            <LogOut size={20} />
            Logout
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            to="/users"
            icon={<Users size={28} />}
            title="Manage Users"
            description="View, block, or delete users"
            bg="bg-indigo-100"
            iconColor="text-indigo-700"
            hover="group-hover:text-indigo-800"
          />
          <DashboardCard
            to="/settings"
            icon={<Settings size={28} />}
            title="Settings"
            description="Configure weather APIs and bot settings"
            bg="bg-purple-100"
            iconColor="text-purple-700"
            hover="group-hover:text-purple-800"
          />
        </div>
      </main>
    </div>
  );
}

function DashboardCard({ to, icon, title, description, bg, iconColor, hover }) {
  return (
    <Link
      to={to}
      className="group bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-200 rounded-xl p-6 flex items-start space-x-5"
    >
      <div className={`${bg} ${iconColor} p-3 rounded-full shadow-sm`}>
        {icon}
      </div>
      <div className="flex-1">
        <h2
          className={`text-lg sm:text-xl font-semibold text-gray-800 ${hover}`}
        >
          {title}
        </h2>
        <p className="text-sm sm:text-base text-gray-500 mt-1">{description}</p>
      </div>
    </Link>
  );
}
