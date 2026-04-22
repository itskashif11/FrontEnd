import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo1.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false); // ✅ toggle

  const navigate = useNavigate();

 const BASE_URL = "https://backend-v8ij.vercel.app";

const handleLogin = async () => {
  try {
    const res = await axios.post(`${BASE_URL}/login`, {
      username: email,
      password: password,
    });

    localStorage.setItem("token", res.data.token);
    navigate("/dashboard");

  } catch (err) {
    alert(err.response?.data?.message || "Login failed");
  }
};

const handleSignup = async () => {
  try {
    const res = await axios.post(`${BASE_URL}/register`, {
      username: email,
      password: password,
    });

    alert(res.data.message);

  } catch (err) {
    alert(err.response?.data?.message || "Signup failed");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1c]">
      <div className="flex flex-col items-center">

        {/* LOGO */}
        <img src={logo} alt="logo" className="w-64 mb-10" />

        {/* CARD */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-[400px]">

          <h1 className="text-white text-2xl text-center mb-6">
            {isSignup ? "Sign Up" : "Login"}
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
            onClick={isSignup ? handleSignup : handleLogin}
            className="w-full bg-blue-600 p-3 rounded text-white"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>

          {/* TOGGLE */}
          <p className="text-gray-400 text-sm text-center mt-4">
            {isSignup ? "Already have an account?" : "Don't have an account?"}
            <span
              onClick={() => setIsSignup(!isSignup)}
              className="text-blue-400 cursor-pointer ml-1"
            >
              {isSignup ? "Login" : "Sign Up"}
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}