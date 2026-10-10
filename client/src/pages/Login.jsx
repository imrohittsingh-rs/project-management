import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Eye, EyeOff, ArrowUpRight } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.identifier.trim() || !formData.password) {
      toast.error("Please provide both email/username and password.");
      return;
    }

    setIsLoading(true);
    try {
      const isEmail = formData.identifier.includes("@");
      const payload = {
        password: formData.password,
        ...(isEmail
          ? { email: formData.identifier.trim() }
          : { username: formData.identifier.trim() }),
      };

      await login(payload);
      toast.success("Welcome back! Logged in successfully.");
      navigate("/dashboard");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 pt-20 pb-6 px-4 sm:px-6 flex items-center justify-center font-sans">
      {/* Main Split Container */}
      <div className="w-full max-w-4xl mx-auto rounded-3xl bg-white/95 border border-gray-200/80 shadow-soft overflow-hidden grid grid-cols-1 lg:grid-cols-12 backdrop-blur-md">
        {/* Left Side: 3D Workspace Illustration */}
        <div className="hidden lg:flex lg:col-span-6 relative overflow-hidden bg-gradient-to-br from-[#e5f6be] to-[#d6f09e] p-6 items-center justify-center">
          <img
            src="/Images/auth-3d.jpg"
            alt="Developer Illustration"
            className="w-full h-full object-cover object-center rounded-2xl shadow-xs"
          />
        </div>

        {/* Right Side: Authentication Form */}
        <div className="lg:col-span-6 p-7 sm:p-9 flex flex-col justify-center bg-white">
          <div className="w-full max-w-sm mx-auto">
            {/* Brand Header */}
            <div className="flex items-center justify-center gap-2 mb-5">
              <img
                src="/Images/image.png"
                alt="Project Camp"
                className="w-8 h-8 object-contain rounded-lg"
              />
              <span className="font-bold text-lg tracking-tight text-gray-950">
                Project<span>Camp</span>
              </span>
            </div>

            {/* Title */}
            <div className="text-center mb-5">
              <h1 className="text-2xl font-bold tracking-tight text-gray-950">
                Welcome back
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Enter your credentials to access your workspace
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email or username
                </label>
                <input
                  type="text"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  placeholder="name@company.com or username"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50/70 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:border-transparent transition-all shadow-xs"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    Password
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      toast.info(
                        "Password reset instructions will be sent to your email."
                      );
                    }}
                    className="text-[11px] font-medium text-gray-500 hover:text-gray-950 transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-gray-50/70 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:border-transparent transition-all shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-700 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Main ChaiUI Action Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-5 rounded-none rounded-bl-lg rounded-tr-lg bg-[#111318] hover:bg-black text-white font-semibold text-sm shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Log in</span>
                    <ArrowUpRight className="w-4 h-4 text-[#c8f53c]" />
                  </>
                )}
              </button>
            </form>

            {/* Footer toggle link */}
            <div className="text-center mt-5 pt-3.5 border-t border-gray-100">
              <p className="text-xs text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-gray-950 hover:underline inline-flex items-center gap-0.5"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
