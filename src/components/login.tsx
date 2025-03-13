"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2
import { Tv, Film, Popcorn, Clapperboard, PlayCircle, Monitor, Eye, EyeOff } from "lucide-react"; // Import icons

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility

  const validatePassword = (password: string) => {
    return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password);
  };

  const showToast = (message: string, type: "success" | "error") => {
    Swal.fire({
      toast: true,
      position: "top-right",
      icon: type,
      title: message,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      customClass: {
        popup: "bg-gray-900 text-white text-sm shadow-lg",
      },
    });
  };

  const handleSubmit = async () => {
    if (isSignUp && !validatePassword(form.password)) {
      setError("Password must have 8+ chars, 1 uppercase, 1 number, 1 special character.");
      showToast("Invalid password format!", "error");
      return;
    }
    try {
      const url = isSignUp ? "http://localhost:5000/auth/register" : "http://localhost:5000/auth/login";
      await axios.post(url, form);
      showToast(isSignUp ? "Sign-Up Successful!" : "Login Successful!", "success");
    } catch {
      setError("Something went wrong!");
      showToast("Authentication failed!", "error");
    }
  };

  const toggleForm = () => {
    setIsSignUp((prev) => !prev);
    setError("");
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen w-full overflow-hidden text-white bg-black">
      {/* Full-page rotating icons */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
      >
        <div className="absolute w-[800px] h-[800px] bg-red-500 rounded-full blur-[200px] opacity-30"></div>
        <div className="absolute w-[600px] h-[600px] bg-blue-500 rounded-full blur-[150px] opacity-30"></div>

        {/* Rotating Icons in Full Page */}
        {[Tv, Film, Popcorn, Clapperboard, PlayCircle, Monitor].map((Icon, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{ rotate: [-10, 10, -10] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          >
            <Icon size={50} color="white" className="opacity-20" />
          </motion.div>
        ))}
      </motion.div>

      {/* Floating Icon Cards Around Form */}
      <div className="absolute flex flex-wrap gap-6">
        {[Tv, Film, Popcorn, Clapperboard, PlayCircle, Monitor].map((Icon, index) => (
          <motion.div
            key={index}
            className="w-32 h-32 bg-gray-900/80 shadow-lg backdrop-blur-lg rounded-xl flex items-center justify-center"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: index * 0.2 }}
          >
            <Icon size={40} color="red" />
          </motion.div>
        ))}
      </div>

      {/* Login / Signup Form */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isSignUp ? "signup" : "login"}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="relative z-10 bg-opacity-90 p-8 rounded-xl shadow-2xl backdrop-blur-lg bg-gray-900 w-96 text-center border border-gray-800"
        >
          <h2 className="text-3xl font-extrabold mb-6">{isSignUp ? "Sign Up for Netflix" : "Login to Netflix"}</h2>

          {isSignUp && (
            <motion.input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 mb-4 bg-gray-800 rounded-md focus:ring-2 focus:ring-red-500 transition-all"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              whileFocus={{ scale: 1.02 }}
            />
          )}

          <motion.input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-4 bg-gray-800 rounded-md focus:ring-2 focus:ring-red-500 transition-all"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            whileFocus={{ scale: 1.02 }}
          />

          <div className="relative w-full">
            <motion.input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 mb-4 bg-gray-800 rounded-md focus:ring-2 focus:ring-red-500 transition-all pr-12"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              whileFocus={{ scale: 1.02 }}
            />
            <button
              type="button"
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-all"
          >
            {isSignUp ? "Sign Up" : "Login"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={toggleForm}
            className="mt-4 text-sm text-gray-400 hover:text-white transition-all"
          >
            {isSignUp ? "Already have an account? Login" : "New here? Create an account"}
          </motion.button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
