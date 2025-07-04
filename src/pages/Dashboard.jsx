import { Link } from 'react-router-dom';
import { Users, Settings, LogOut } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <Link to="/login" className="flex items-center gap-1 text-red-600 hover:underline">
            <LogOut size={18} />
            Logout
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Manage Users */}
          <Link
            to="/users"
            className="bg-white border hover:shadow-md transition rounded-lg p-6 flex items-center gap-4 group"
          >
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
              <Users size={28} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600">
                Manage Users
              </h2>
              <p className="text-sm text-gray-500">Block or remove user access</p>
            </div>
          </Link>

          {/* Settings */}
          <Link
            to="/settings"
            className="bg-white border hover:shadow-md transition rounded-lg p-6 flex items-center gap-4 group"
          >
            <div className="bg-gray-100 text-gray-600 p-3 rounded-full">
              <Settings size={28} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800 group-hover:text-gray-700">
                Settings
              </h2>
              <p className="text-sm text-gray-500">Configure weather APIs and other bot settings</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
