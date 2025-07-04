import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Settings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({ weatherApiKey: "", city: "" });
  const [loading, setLoading] = useState(true);
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);
  const token = localStorage.getItem("token");
  const [showModal, setShowModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        closeModal();
      }
    };
    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
    }, 300); // match exit animation
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
        `https://api.weatherapi.com/v1/current.json?key=${
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
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="h-screen flex flex-col items-center justify-center text-gray-600 text-xl gap-4"
          >
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            Loading settings...
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8"
          >
            <div className="flex items-center mb-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="mr-4 flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all duration-200 active:scale-95"
              >
                <ArrowLeft size={16} />
                Back
              </button>

              <h2 className="text-2xl font-bold text-gray-800">Bot Settings</h2>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Weather API Key
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="weatherApiKey"
                    value={settings.weatherApiKey}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your WeatherAPI.com key"
                    required
                  />
                  <button
                    type="button"
                    onClick={testWeatherApiKey}
                    className="relative min-w-[120px] bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 hover:shadow-lg active:scale-95 transition-all duration-200 overflow-hidden focus:outline-none focus:ring-2 focus:ring-green-400"
                    disabled={testing || !settings.weatherApiKey}
                  >
                    <span className="absolute inset-0 bg-white opacity-10 blur-sm" />
                    <span className="relative z-10">
                      {testing ? "Testing..." : "Test Key"}
                    </span>
                  </button>
                </div>
                {showModal && testResult && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 transition-opacity duration-300">
                    <div
                      ref={modalRef}
                      className={`bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative transform transition-all duration-300 ${
                        isClosing
                          ? "opacity-0 scale-95"
                          : "opacity-100 scale-100"
                      }`}
                    >
                      <button
                        onClick={closeModal}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
                      >
                        &times;
                      </button>
                      <h3
                        className={`text-lg font-semibold mb-2 ${
                          testResult.success ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {testResult.success
                          ? "Test Successful"
                          : "Test Failed"}
                      </h3>
                      <p className="text-gray-700">{testResult.message}</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  City Name (for weather updates)
                </label>
                <input
                  type="text"
                  name="city"
                  value={settings.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. London, New York, Mumbai"
                />
              </div>

              <button
                type="submit"
                className="relative overflow-hidden text-white px-6 py-2 rounded-md transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-300
    bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_2px_6px_rgba(0,0,0,0.3)] border border-blue-300"
              >
                <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/40 via-transparent to-white/10 opacity-20 pointer-events-none" />
                <span className="absolute w-[150%] h-full bg-white/30 blur-md -left-2 -top-2 rotate-12 animate-metal-shine" />
                <span className="relative z-10 font-semibold">
                  Save Settings
                </span>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
