import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 relative overflow-hidden">

      {/* gold glow background */}
      <div className="absolute w-[900px] h-[900px] bg-yellow-500 opacity-10 blur-[220px] rounded-full pointer-events-none"></div>

      {/* login card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 bg-gradient-to-b from-[#141414] to-[#0b0b0b] border border-gray-800 rounded-3xl p-14 w-full max-w-lg shadow-xl"
      >

        <h2 className="text-4xl font-bold text-white mb-2">
          Welcome Back
        </h2>

        <p className="text-gray-400 mb-10 text-lg">
          Login to your gold investment account
        </p>

        <form className="space-y-6">

          <input
            type="email"
            placeholder="Email address"
            className="w-full p-4 bg-black border border-gray-700 rounded-xl text-white focus:border-yellow-400 outline-none text-lg"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 bg-black border border-gray-700 rounded-xl text-white focus:border-yellow-400 outline-none text-lg"
          />

          <div className="flex justify-between text-sm">

            <span className="text-gray-400">
              Remember me
            </span>

            <Link
              to="/forgot-password"
              className="text-yellow-400 hover:text-yellow-300"
            >
              Forgot password?
            </Link>

          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 text-black font-semibold py-4 rounded-xl hover:bg-yellow-300 transition text-lg"
          >
            Login
          </button>

        </form>

        <p className="text-gray-400 text-md mt-8 text-center">

          Don't have an account?{" "}

          <Link
            to="/signup"
            className="text-yellow-400 hover:text-yellow-300 font-medium"
          >
            Sign Up
          </Link>

        </p>

      </motion.div>

    </div>
  );
}