"use client";
import React, { useState } from "react";
import Link from "next/link";
import api from "@/utils/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/page";
const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setUser } = useAuth();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/v1/auth/login", {
        email,
        password,
      });
      router.push("/");
      toast.success("Logged in successfully!");

      const { accessToken, user } = response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("username", user.username);
      localStorage.setItem("email", user.email);
      localStorage.setItem("id", user.id);

      setUser(user.username);
      api.interceptors.request.use((config) => {
        const token = localStorage.getItem("accessToken");
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      });
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-[#f9f1dd] to-[#fceac4]">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border-4 border-yellow-200 overflow-hidden transition-all duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#d6a243] to-red-700 p-6 text-white text-center">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-yellow-100 mt-1 text-sm italic">
            Log in to continue your fragrant journey
          </p>
        </div>

        {/* Form */}
        <div className="p-8 bg-[#fffdf6]">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none text-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none text-gray-900 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-yellow-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div className="flex justify-end mt-1">
                <a
                  href="#"
                  className="text-sm text-yellow-700 hover:text-yellow-900 transition"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#d6a243] to-[#a22c29] text-white font-bold p-3 rounded-lg hover:brightness-110 transition transform hover:scale-105"
            >
              Log In
            </button>

            <div className="text-center mt-6">
              <Link
                href="/signup"
                className="text-yellow-700 font-medium hover:text-yellow-900 transition"
              >
                Don&apos;t have an account? Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
