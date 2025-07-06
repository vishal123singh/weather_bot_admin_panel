import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://weatherbotbackend-production.up.railway.app/api";

const WEATHER_API_ENDPOINT =
  import.meta.env.VITE_WEATHER_API_ENDPOINT ||
  "https://api.weatherapi.com/v1/current.json";


export default function Settings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({ weatherApiKey: "", city: "" });
  const [loading, setLoading] = useState(true);
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (showModal) {
      const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
          closeModal();
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showModal]);

  useEffect(() => {
    fetch(`${API_URL}/settings`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setSettings)
      .finally(() => setLoading(false));
  }, [token]);

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setIsClosing(false);
    }, 300);
  };

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      toast.success("Settings updated!");
    } catch (err) {
      toast.error("Failed to update settings.");
    }
  };

  const testWeatherApiKey = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const city = settings.city || "London";
      const res = await fetch(
        `${WEATHER_API_ENDPOINT}?key=${
          settings.weatherApiKey
        }&q=${encodeURIComponent(city)}`,
      );
      if (!res.ok) throw new Error("Invalid API Key or request failed");
      const data = await res.json();
      setTestResult({
        success: true,
        message: `${data.location.name}: ${data.current.temp_c}°C, ${data.current.condition.text}`,
      });
      setShowModal(true);
    } catch (err) {
      setTestResult({ success: false, message: `${err.message}` });
      setShowModal(true);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-10 px-2 sm:px-4">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl p-4 sm:p-8 space-y-6"
          >
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-1/2 sm:w-40 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
            <div className="w-1/3 sm:w-32 h-10 bg-gray-200 rounded animate-pulse" />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl p-4 sm:p-8"
          >
            <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1 sm:gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium shadow-sm transition active:scale-95"
              >
                <ArrowLeft size={14} className="sm:w-4" />
                <span>Back</span>
              </button>
              <h2 className="text-xl sm:text-2xl font-bold text-indigo-700">
                Bot Settings
              </h2>
            </div>

            <form onSubmit={handleSave} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm sm:text-base text-gray-700 font-semibold mb-1 sm:mb-2">
                  Weather API Key
                </label>
                <div className="flex flex-col gap-2 sm:gap-3">
                  <input
                    type="text"
                    name="weatherApiKey"
                    value={settings.weatherApiKey}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter WeatherAPI.com key"
                    required
                  />
                  <button
                    type="button"
                    onClick={testWeatherApiKey}
                    className={`w-full sm:w-auto px-4 py-2 rounded-md text-white font-medium transition ${
                      testing
                        ? "bg-gray-400"
                        : "bg-emerald-600 hover:bg-emerald-700"
                    } shadow focus:outline-none focus:ring-2 focus:ring-emerald-400`}
                    disabled={testing || !settings.weatherApiKey}
                  >
                    {testing ? "Testing..." : "Test Key"}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm sm:text-base text-gray-700 font-semibold mb-1 sm:mb-2">
                  City Name (for weather updates)
                </label>
                <input
                  type="text"
                  name="city"
                  value={settings.city}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. London, New York, Mumbai"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto relative overflow-hidden text-white px-4 sm:px-6 py-2 rounded-md font-semibold transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-gradient-to-br from-indigo-600 via-indigo-500 to-indigo-700 shadow-md
             hover:from-indigo-700 hover:via-indigo-600 hover:to-indigo-800  /* Darker gradient on hover */
             hover:shadow-lg              /* Larger shadow on hover */
             hover:-translate-y-0.5        /* Slight upward lift */
             transform transition-all duration-200 ease-in-out" /* Smooth transition */
              >
                <span className="relative z-10">Save Settings</span>
                <span className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300 rounded-md"></span>{" "}
                {/* Light overlay on hover */}
              </button>
            </form>

            {/* Modal */}
            {showModal && testResult && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 transition-opacity duration-300 px-2 sm:px-0">
                <div
                  ref={modalRef}
                  className={`bg-white rounded-lg shadow-xl w-full sm:max-w-md mx-2 sm:mx-0 p-4 sm:p-6 relative transform transition-all duration-300 ${
                    isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100"
                  }`}
                >
                  <button
                    onClick={closeModal}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
                  >
                    &times;
                  </button>
                  <h3
                    className={`text-base sm:text-lg font-semibold mb-2 ${
                      testResult.success ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {testResult.success ? "Test Successful" : "Test Failed"}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700">
                    {testResult.message}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}