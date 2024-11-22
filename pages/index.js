import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

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
          <a
            href="#"
            className="text-[#fffff0] hover:text-[#fffff0] text-sm transition-colors">
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
}
