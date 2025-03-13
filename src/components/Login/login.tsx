"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { Tv, Film, Popcorn, Clapperboard, PlayCircle, Monitor, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [serverOtp, setServerOtp] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token"); // or get from cookies
    if (token) {
      const userId = JSON.parse(atob(token.split('.')[1])).userId; // Decode the token to get userId
      router.push(`/home/${userId}`);
    }
  }, [router]);

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
      const url = isSignUp
        ? "https://duggu-apis.vercel.app/duggu-api/auth/register"
        : "https://duggu-apis.vercel.app/duggu-api/auth/login";
  
      const lowerCaseEmail = form.email.toLowerCase(); // ✅ Convert to lowercase
      console.log("🔍 Sending Email:", lowerCaseEmail); // ✅ Debugging: Check in console
  
      const { data } = await axios.post(url, {
        ...form,
        email: lowerCaseEmail, 
      });
  
      showToast(isSignUp ? "Sign-Up Successful!" : "Login Successful!", "success");
  
      if (data.userId) {
        localStorage.setItem("token", data.token);
        router.push(`/home/${data.userId}`);
      }
    } catch (error) {
      setError("Something went wrong!");
      showToast("Authentication failed!", "error");
    }
  };
  

  const sendOtp = async () => {
    if (!form.email) {
      setError("Email is required");
      showToast("Email is required", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("https://duggu-apis.vercel.app/duggu-api/auth/send-otp", {
        email: form.email.toLowerCase() // ✅ Converts email to lowercase
      });

      if (response.data.success) {
        setOtpSent(true);
        console.log("✅ OTP Sent:", response.data.otp);
        showToast("OTP sent successfully!", "success");
      } else {
        setError("Failed to send OTP");
        showToast("Failed to send OTP", "error");
      }
    } catch (err) {
      console.error("❌ OTP Sending Error:", err);
      setError("Error sending OTP");
      showToast("Error sending OTP", "error");
    } finally {
      setLoading(false);
    }
  };


  const verifyOtp = async () => {
    if (!form.email || !otp) {
      setError("Email and OTP are required");
      showToast("Email and OTP are required", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("https://duggu-apis.vercel.app/duggu-api/auth/verify-otp", {
        email: form.email.toLowerCase(), // ✅ Converts email to lowercase
        otp
      });

      if (response.data.success) {
        setOtpVerified(true);
        console.log("✅ OTP Verified!");
        showToast("OTP verified successfully!", "success");
      } else {
        setError("Invalid OTP");
        showToast("Invalid OTP", "error");
      }
    } catch (err) {
      console.error("❌ OTP Verification Error:", err);
      setError("Invalid OTP");
      showToast("Invalid OTP", "error");
    } finally {
      setLoading(false);
    }
  };

   const resetPassword = async () => {
    if (!validatePassword(newPassword)) {
      setError("New password must meet security requirements.");
      showToast("Invalid password format!", "error");
      return;
    }

    try {
      const response = await axios.post("https://duggu-apis.vercel.app/duggu-api/auth/reset-password", {
        email: form.email.toLowerCase(),
        otp,
        newPassword,
      });
      showToast(response.data.message, "success");

      setForgotPassword(false);
      setOtpSent(false);
      setOtpVerified(false);
      setOtp("");
      setNewPassword("");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      showToast(axiosError.response?.data?.message || "Error resetting password!", "error");
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
          key={isSignUp ? "signup" : forgotPassword ? "forgot-password" : "login"}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="relative z-10 bg-opacity-90 p-8 rounded-xl shadow-2xl backdrop-blur-lg bg-gray-900 w-96 text-center border border-gray-800"
        >
          <h2 className="text-3xl font-extrabold mb-6">
            {isSignUp
              ? "Sign Up for Netflix"
              : forgotPassword
                ? "Reset Password"
                : "Login to Netflix"}
          </h2>

          {!forgotPassword && isSignUp && (
            <motion.input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 mb-4 bg-gray-800 rounded-md"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          )}

          {!forgotPassword && (
            <>
              <motion.input
                type="email"
                placeholder="Email"
                className="w-full p-3 mb-4 bg-gray-800 rounded-md"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}  // ✅ Updates form.email correctly
              />

              <div className="relative">
                <motion.input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full p-3 mb-4 bg-gray-800 rounded-md"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </>
          )}

          {/* FORGOT PASSWORD SECTION */}
          {forgotPassword && (
            <>
              {/* Enter Email */}
              <motion.input
                type="email"
                placeholder="Enter your registered email"
                className="w-full p-3 mb-4 bg-gray-800 rounded-md"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              {/* OTP Input (Disabled Initially) */}
              <motion.input
                type="text"
                placeholder="Enter OTP"
                className="w-full p-3 mb-4 bg-gray-800 rounded-md"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={!otpSent} // OTP input is disabled until OTP is sent
              />

              {/* Send OTP / Verify OTP Button */}
              {!otpSent ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={sendOtp}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
                >
                  Send OTP
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={verifyOtp}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
                >
                  Verify OTP
                </motion.button>
              )}

              {/* New Password Input (Appears after OTP verification) */}
              {otpVerified && (
               <div className="mt-4 p-4 bg-gray-800 rounded-lg">
               <div className="relative">
                 <motion.input
                   type={showPassword ? "text" : "password"}
                   placeholder="Enter New Password"
                   className="w-full p-3 bg-gray-900 rounded-md pr-12" // Adjusted padding for eye button
                   value={newPassword}
                   onChange={(e) => setNewPassword(e.target.value)}
                 />
                 <button
                   type="button"
                   className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                   onClick={() => setShowPassword((prev) => !prev)}
                 >
                   {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                 </button>
               </div>
             
               <motion.button
                 whileHover={{ scale: 1.05 }}
                 onClick={resetPassword}
                 className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold"
               >
                 Change Password
               </motion.button>
             </div>
             
              )}

              {/* Back to Login */}
              <div className="flex justify-center mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setForgotPassword(false)}
                  className="text-sm text-gray-400 hover:text-white transition-all"
                >
                  Back to Login
                </motion.button>
              </div>
            </>
          )}

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {!isSignUp && !forgotPassword && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleSubmit}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold"
              >
                Login
              </motion.button>

              <div className="flex justify-between mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={toggleForm}
                  className="text-sm text-gray-400 hover:text-white transition-all"
                >
                  Create an Account
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setForgotPassword(true)}
                  className="text-sm text-gray-400 hover:text-white transition-all"
                >
                  Forgot Password?
                </motion.button>
              </div>
            </>
          )}

          {isSignUp && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleSubmit}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold"
              >
                Sign Up
              </motion.button>

              <div className="flex justify-center mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={toggleForm}
                  className="text-sm text-gray-400 hover:text-white transition-all"
                >
                  Already have an account? Login
                </motion.button>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>


    </div>
  );
}