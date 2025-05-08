import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
        {
          withCredentials: true,
        }
      );

      console.log("Login Success:", res.data);

      // Store token if needed
      const token = res.data.token;
      const role = res.data.role;
      setCurrentUser(role);

      sessionStorage.setItem("token", token);
      sessionStorage.setItem("role", role); // Optional

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Login to Your Account
        </h2>

        {error && (
          <p className="mb-4 text-sm text-red-500 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
