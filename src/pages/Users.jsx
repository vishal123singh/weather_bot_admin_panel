import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://weatherbotbackend-production.up.railway.app/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setUsers)
      .finally(() => setLoading(false));
  }, [token]);

  const blockUser = async (id) => {
    try {
      await fetch(`${API_URL}/users/${id}/block`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((users) =>
        users.map((u) => (u._id === id ? { ...u, blocked: true } : u)),
      );
      toast.success("User blocked");
    } catch {
      toast.error("Failed to block user");
    }
  };

  const unblockUser = async (id) => {
    try {
      await fetch(`${API_URL}/users/${id}/unblock`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((users) =>
        users.map((u) => (u._id === id ? { ...u, blocked: false } : u)),
      );
      toast.success("User unblocked");
    } catch {
      toast.error("Failed to unblock user");
    }
  };

  const deleteUser = async (id) => {
    try {
      await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((users) => users.filter((u) => u._id !== id));
      toast.success("User deleted");
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const renderSkeletonRow = (_, i) => (
    <tr key={i}>
      <td className="px-4 py-3 border-b">
        <div className="h-4 bg-gray-200 rounded w-28 animate-pulse" />
      </td>
      <td className="px-4 py-3 border-b">
        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
      </td>
      <td className="px-4 py-3 border-b">
        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
      </td>
      <td className="px-4 py-3 border-b">
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence mode="wait">
        <motion.div
          key={loading ? "skeleton" : "data"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.4 }}
          className="max-w-7xl mx-auto px-4 py-8 sm:py-10"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 text-gray-700 text-sm sm:text-base font-medium rounded-full shadow-sm transition active:scale-95 w-max"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <h2 className="text-xl sm:text-2xl font-bold text-indigo-700">
              Manage Users
            </h2>
          </div>

          {/* Mobile layout: Card-based */}
          <div className="sm:hidden space-y-6">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="p-3 sm:p-5 rounded-xl border bg-white shadow space-y-3 animate-pulse"
                  >
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="flex gap-2 mt-3">
                      <div className="h-8 w-20 bg-gray-200 rounded" />
                      <div className="h-8 w-20 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))
              : users.map((user) => (
                  <div
                    key={user._id}
                    className="p-3 sm:p-5 rounded-xl border bg-white shadow space-y-3 sm:space-y-4"
                  >
                    <div>
                      <p className="font-semibold text-gray-700 text-sm sm:text-base">
                        Telegram ID
                      </p>
                      <p className="text-gray-900 break-all text-sm sm:text-lg">
                        {user.telegramId}
                      </p>
                    </div>

                    <p className="text-gray-700 text-sm sm:text-base">
                      <span className="font-semibold">Subscribed:</span>{" "}
                      {user.subscribed ? "Yes" : "No"}
                    </p>

                    <p className="text-gray-700 text-sm sm:text-base">
                      <span className="font-semibold">Blocked:</span>{" "}
                      {user.blocked ? "Yes" : "No"}
                    </p>

                    <div className="flex flex-col gap-2 mt-3 sm:mt-4">
                      <button
                        onClick={() =>
                          user.blocked
                            ? unblockUser(user._id)
                            : blockUser(user._id)
                        }
                        className={`w-full py-1.5 text-sm sm:text-base rounded font-semibold transition ${
                          user.blocked
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "bg-yellow-500 hover:bg-yellow-600 text-white"
                        }`}
                      >
                        {user.blocked ? "Unblock" : "Block"}
                      </button>
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="w-full py-1.5 text-sm sm:text-base bg-rose-600 hover:bg-rose-700 text-white rounded font-semibold transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
          </div>

          {/* Desktop layout: Table */}
          <div className="hidden sm:block overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white mt-4">
            <table className="min-w-[600px] w-full text-sm sm:text-base">
              <thead className="bg-indigo-50 text-indigo-700 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 border-b text-left">Telegram ID</th>
                  <th className="px-4 py-3 border-b text-left">Subscribed</th>
                  <th className="px-4 py-3 border-b text-left">Blocked</th>
                  <th className="px-4 py-3 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 5 }).map(renderSkeletonRow)
                  : users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 border-b break-all">
                          {user.telegramId}
                        </td>
                        <td className="px-4 py-3 border-b">
                          {user.subscribed ? "Yes" : "No"}
                        </td>
                        <td className="px-4 py-3 border-b">
                          {user.blocked ? "Yes" : "No"}
                        </td>
                        <td className="px-4 py-3 border-b">
                          <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={() =>
                                user.blocked
                                  ? unblockUser(user._id)
                                  : blockUser(user._id)
                              }
                              className={`px-3 py-1.5 text-sm rounded font-medium transition ${
                                user.blocked
                                  ? "bg-green-500 hover:bg-green-600 text-white"
                                  : "bg-yellow-500 hover:bg-yellow-600 text-white"
                              }`}
                            >
                              {user.blocked ? "Unblock" : "Block"}
                            </button>
                            <button
                              onClick={() => deleteUser(user._id)}
                              className="px-3 py-1.5 text-sm bg-rose-600 hover:bg-rose-700 text-white rounded font-medium transition"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                {!loading && users.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-gray-500 py-6">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
