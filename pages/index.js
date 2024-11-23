import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import bcryptjs from "bcryptjs";

function ForgotPassword({ onCancel }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/intern/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, step: "sendOTP" }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setStep(2);
        setMessage("OTP sent to your email");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/intern/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, step: "verifyOTP" }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setStep(3);
        setMessage("OTP verified successfully");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    try {
      // Hash password before sending
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(newPassword, salt);

      const res = await fetch("/api/intern/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword: hashedPassword, step: "updatePassword" }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage("Password updated successfully");
        setTimeout(() => onCancel(), 2000); // Return to login after 2 seconds
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-900/50 text-red-300 p-4 rounded-xl text-sm border border-red-700">
          {error}
        </div>
      )}
      {message && (
        <div className="bg-green-900/50 text-green-300 p-4 rounded-xl text-sm border border-green-700">
          {message}
        </div>
      )}

      {step === 1 && (
        <form onSubmit={handleSendOTP}>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white"
            />
            <button
              type="submit"
              className="w-full bg-[#fffff0] text-black font-medium py-3 rounded-xl">
              Send OTP
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOTP}>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-300">
              Enter OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white"
            />
            <button
              type="submit"
              className="w-full bg-[#fffff0] text-black font-medium py-3 rounded-xl">
              Verify OTP
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleUpdatePassword}>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-300">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white"
            />
            <button
              type="submit"
              className="w-full bg-[#fffff0] text-black font-medium py-3 rounded-xl">
              Update Password
            </button>
          </div>
        </form>
      )}

      <button
        onClick={onCancel}
        className="w-full text-gray-400 hover:text-white text-sm">
        Back to Login
      </button>
    </div>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/dashboard");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  if (showForgotPassword) {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-10 w-full max-w-md border border-gray-100">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Reset Password
            </h1>
          </div>
          <ForgotPassword onCancel={() => setShowForgotPassword(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-10 w-full max-w-md border border-gray-100">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            NOXALGO LLP
          </h1>
          <p className="text-gray-400 mt-3 text-lg">
            Welcome back! Please sign in to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 ">
          {error && (
            <div className="bg-red-900/50 text-red-300 p-4 rounded-xl text-sm border border-red-700">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 t 0 transition-all outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#fffff0] focus:border-[#fffff0] transition-all outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#fffff0] hover:bg-[#fffff0] text-black font-medium py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-blue-500/20 mt-8">
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setShowForgotPassword(true)}
            className="text-[#fffff0] hover:text-[#fffff0] text-sm transition-colors">
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
}
