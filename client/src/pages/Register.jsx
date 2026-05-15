import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-panel p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-center mb-6">
          Create Account
        </h1>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 rounded-lg bg-secondary border border-gray-700 outline-none"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-secondary border border-gray-700 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-secondary border border-gray-700 outline-none"
          />

          <button
            type="submit"
            className="w-full bg-accent hover:bg-blue-700 transition p-3 rounded-lg font-semibold"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-4 text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-accent">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;