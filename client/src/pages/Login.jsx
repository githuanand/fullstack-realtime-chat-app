import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import useAuthStore from "../store/authStore";

function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
  e.preventDefault();

  alert("Login button clicked");

  console.log("Form Data:", formData);

  const success = await login(formData);

  console.log("Login result:", success);

  if (success) {
    alert("Login successful");
    navigate("/");
  } else {
    alert("Invalid credentials or backend issue");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-panel p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome Back
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full p-4 rounded-lg bg-secondary border border-gray-700 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full p-4 rounded-lg bg-secondary border border-gray-700 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-blue-700 transition p-4 rounded-lg font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-400">
          Don’t have an account?{" "}
          <Link to="/register" className="text-accent">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;