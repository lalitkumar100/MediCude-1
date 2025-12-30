import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, {
        email,
        password,
      });

      console.log(response.data.data.token);
      localStorage.setItem("token", response.data.data.token);

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section - Image */}
      <div className="w-full md:w-1/2 relative">
        <img
          src="/placeholder.svg"
          alt="Modern Pharmacy Interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-cyan-500/20 to-teal-500/20"></div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-linear-to-br from-cyan-500 to-teal-600 rounded-xl flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
              <span className="bg-linear-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                PharmaDesk
              </span>
            </h1>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="h-12 border-gray-200 focus:border-cyan-500"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="h-12 border-gray-200 focus:border-cyan-500"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-linear-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white font-semibold shadow-md hover:shadow-lg"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>

              {/* Forgot Password */}
              <div className="text-center">
                <a
                  href="/forgot-password"
                  className="text-cyan-600 hover:text-cyan-800 text-sm underline"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Help Contact */}
              <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Need help? Contact{" "}
                  <a
                    href="mailto:help@pharmaDesk.com"
                    className="text-cyan-600 hover:text-cyan-800 underline"
                  >
                    help@pharmaDesk.com
                  </a>
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
