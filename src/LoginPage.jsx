import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Array of images for the slideshow
const images = [
  "/img3.png", 
  "/img4.png"
];

export default function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Slideshow State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Effect for the 3-second image rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, {
        email,
        password,
      });
     console.log("Login successful:", response.data);
      localStorage.setItem("token", response.data.token);
      if(response.data.role === "worker"){
      navigate("/worker");
      }
      else{
        navigate("/dashboard");
      }
      
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Left Section - Image Slideshow */}
      <div className="hidden md:block md:w-1/2 relative h-screen bg-gray-200">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Slide ${index}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        {/* Overlay for better text/logo visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/40 to-transparent"></div>
        
        {/* Branding on top of image (Optional) */}
        <div className="absolute bottom-12 left-12 text-white z-10">
          <h2 className="text-4xl font-bold">PharmaDesk</h2>
          <p className="text-lg opacity-80">AI integrated Managing Tool for your Pharmacy</p>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8 md:p-12 h-screen overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 mt-2">Please enter your details to login</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 mt-8">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                className="h-11 focus:ring-2 focus:ring-cyan-500"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs text-cyan-600 hover:underline">Forgot?</a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-11 focus:ring-2 focus:ring-cyan-500"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-cyan-600 hover:bg-cyan-700 text-white transition-all shadow-md"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Sign In"}
            </Button>

            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg text-center border border-red-100">
                {error}
              </div>
            )}
          </form>

          <p className="text-center text-sm text-gray-500">
            Don't have an account? <span className="text-cyan-600 font-medium cursor-pointer">Contact Admin</span>
          </p>
        </div>
      </div>
    </div>
  );
}