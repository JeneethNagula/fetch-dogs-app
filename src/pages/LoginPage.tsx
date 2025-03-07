import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Validate email format
  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!name.trim() || !isValidEmail(email.trim())) {
      toast.error("Please enter a valid name and email!", { theme: "colored" });
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        "https://frontend-take-home-service.fetch.com/auth/login",
        { name: name.trim(), email: email.trim() },
        { withCredentials: true }
      );
      login(name, email);
      toast.success("Login successful!", { theme: "colored" });
      navigate("/search");
    } catch (error) {
      toast.error("Login failed! Please try again.", { theme: "colored" });
      console.error("Login Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md"
        aria-labelledby="login-form"
      >
        <h2 id="login-form" className="text-2xl font-bold mb-4 text-center">
          Login
        </h2>

        {/* Name Input */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 mt-1 border rounded"
            required
          />
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mt-1 border rounded"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full p-2 rounded ${loading ? "opacity-50 cursor-not-allowed bg-blue-400" : "bg-blue-500"}`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
