import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import googleIcon from "../assets/google.png"; // Adjust path as needed

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://weather-bot-backend-vwea.onrender.com/api";

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      navigate("/dashboard");
    }
  }, [navigate]);

  const onSubmit = async (data) => {
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        localStorage.setItem("token", result.token);
        navigate("/dashboard");
      } else {
        setErrorMsg(result.error || "Login failed");
      }
    } catch {
      setErrorMsg("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-cyan-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md animate-fadeIn">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div>
            <input
              type="email"
              placeholder="Email"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-500 focus:ring-red-300"
                  : "focus:ring-indigo-400"
              }`}
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <input
              type="password"
              placeholder="Password"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.password
                  ? "border-red-500 focus:ring-red-300"
                  : "focus:ring-indigo-400"
              }`}
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-md hover:opacity-90 transition active:scale-95 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-3 text-gray-500">or</span>
          </div>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100 transition active:scale-95"
        >
          <img src={googleIcon} alt="Google" className="w-5 h-5" />
          <span className="text-sm text-gray-700 font-medium">
            Login with Google
          </span>
        </button>

        {/* Error Message */}
        {errorMsg && (
          <div className="text-red-500 text-center mt-4 text-sm">
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
}
