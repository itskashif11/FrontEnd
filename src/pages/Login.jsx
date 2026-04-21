
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
    if (email === "admin" && password === "admin") {
      navigate("/dashboard"); // ✅ go to InvoiceGrid
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1c]">

      <div className="flex flex-col items-center">

        {/* LOGO */}
        <img
          src="/logo.png"
          alt="logo"
         className="w-64 mb-10"
        />

        {/* CARD */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-[400px]">

          <h1 className="text-white text-2xl text-center mb-6">
            Login
          </h1>

          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-3 p-3 rounded bg-gray-900 text-white"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 p-3 rounded bg-gray-900 text-white"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 p-3 rounded text-white"
          >
            Login
          </button>

        </div>
      </div>
    </div>
  );
}