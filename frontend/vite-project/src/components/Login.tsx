import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(username, password);
      // After login, redirect based on role
      const userData = JSON.parse(localStorage.getItem("user") || "null");
      // If AuthContext sets user synchronously, you can use user from context
      // Otherwise, fetch /me again or use a short delay
      setTimeout(() => {
        const role = userData?.role;
        if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/staff");
        }
      }, 100);
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <input
          className="w-full p-2 mb-4 border rounded"
          type="text"
          placeholder="Username or Staff ID"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="w-full p-2 mb-4 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <button className="w-full bg-blue-600 text-white p-2 rounded" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
