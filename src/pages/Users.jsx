import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
        users.map((u) => (u._id === id ? { ...u, blocked: true } : u))
      );
      toast.success("User blocked successfully");
    } catch {
      toast.error("Failed to block user");
    }
  };

  const deleteUser = async (id) => {
    try {
      await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((users) => users.filter((u) => u._id !== id));
      toast.success("User deleted successfully");
    } catch {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen flex flex-col items-center justify-center text-gray-600 text-xl gap-4"
          >
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            Loading users...
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-gray-100 py-8 px-4 sm:px-6 lg:px-8"
          >
            <div className="max-w-6xl mx-auto bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow">
              <div className="flex flex-col sm:flex-row sm:items-center mb-6 gap-4 sm:gap-6">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all duration-200 active:scale-95 w-max"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
                <h2 className="text-2xl font-bold text-gray-800">Users</h2>
              </div>

              <div className="overflow-x-auto">
                <div className="max-h-[65vh] overflow-y-auto rounded-lg border border-gray-300">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 sticky top-0 z-10 shadow-sm">
                      <tr className="text-left">
                        <th className="px-4 py-2 border-b whitespace-nowrap">Telegram ID</th>
                        <th className="px-4 py-2 border-b whitespace-nowrap">Subscribed</th>
                        <th className="px-4 py-2 border-b whitespace-nowrap">Blocked</th>
                        <th className="px-4 py-2 border-b whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 border-b break-all">{user.telegramId}</td>
                          <td className="px-4 py-2 border-b">{user.subscribed ? "Yes" : "No"}</td>
                          <td className="px-4 py-2 border-b">{user.blocked ? "Yes" : "No"}</td>
                          <td className="px-4 py-2 border-b">
                            <div className="flex flex-wrap gap-2">
                              {!user.blocked && (
                                <button
                                  onClick={() => blockUser(user._id)}
                                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs sm:text-sm"
                                >
                                  Block
                                </button>
                              )}
                              <button
                                onClick={() => deleteUser(user._id)}
                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs sm:text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center py-4 text-gray-500">
                            No users found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
