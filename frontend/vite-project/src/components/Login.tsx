import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import logo from "../assets/logo.svg";

const Login: React.FC = () => {
  const { login, user } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Login useEffect user:", user);
    if (!user) return;
    // Only navigate if user is set and role is present
    if (user.role === "admin") {
      navigate("/admin", { replace: true });
    } else if (user.role === "staff" || user.role === "doctor" || user.role === "nurse" || user.role === "nursing_assistant") {
      navigate("/staff", { replace: true });
    }
    // Only run once after login
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(username, password);
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-50">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-96">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="SIAD Logo" className="h-12" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            placeholder="Username or Staff ID"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Login
          </Button>

          <div className="text-right text-sm text-blue-600 hover:underline cursor-pointer">
            Forgot password?
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
