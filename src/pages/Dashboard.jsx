import { Link } from "react-router-dom";
import { Users, Settings, LogOut } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-indigo-700 tracking-tight">
            Admin Dashboard
          </h1>
          <Link
            to="/login"
            className="flex items-center gap-2 px-4 py-2 text-sm sm:text-base font-medium text-rose-700 hover:text-white hover:bg-rose-600 border border-rose-300 rounded-full transition-all duration-200 shadow-sm"
          >
            <LogOut size={18} />
            <span className="inline">Logout</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <DashboardCard
            to="/users"
            icon={<Users size={24} className="sm:w-6 sm:h-6" />}
            title="Manage Users"
            description="View, block, or delete users."
            iconBg="bg-indigo-100"
            iconColor="text-indigo-700"
          />
          <DashboardCard
            to="/settings"
            icon={<Settings size={24} className="sm:w-6 sm:h-6" />}
            title="Settings"
            description="Configure Weather APIs and bot settings."
            iconBg="bg-purple-100"
            iconColor="text-purple-700"
          />
        </div>
      </main>
    </div>
  );
}

function DashboardCard({ to, icon, title, description, iconBg, iconColor }) {
  return (
    <Link
      to={to}
      className="group flex items-start gap-4 bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 hover:shadow-md sm:hover:shadow-lg transition duration-200 w-full"
    >
      <div className={`${iconBg} ${iconColor} p-3 rounded-full shadow`}>
        {icon}
      </div>
      <div className="flex-1">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-black truncate">
          {title}
        </h2>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{description}</p>
      </div>
    </Link>
  );
}
