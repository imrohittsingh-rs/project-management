import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Eye, EyeOff, Upload, ArrowUpRight } from "lucide-react";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.fullName ||
      !formData.username ||
      !formData.email ||
      !formData.password
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    try {
      let payload;
      if (avatarFile) {
        payload = new FormData();
        payload.append("fullName", formData.fullName.trim());
        payload.append("username", formData.username.trim().toLowerCase());
        payload.append("email", formData.email.trim().toLowerCase());
        payload.append("password", formData.password);
        payload.append("avatar", avatarFile);
      } else {
        payload = {
          fullName: formData.fullName.trim(),
          username: formData.username.trim().toLowerCase(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        };
      }

      await register(payload);
      toast.success("Account created successfully! Verification email sent.");
      navigate("/login");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Registration failed. Please check your details.";
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
        <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-center bg-white">
          <div className="w-full max-w-sm mx-auto">
            {/* Brand Header */}
            <div className="flex items-center justify-center gap-2 mb-4">
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
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold tracking-tight text-gray-950">
                Create account
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Start managing your projects and team velocity
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-50/70 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:border-transparent transition-all shadow-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="johndoe"
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50/70 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:border-transparent transition-all shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@work.com"
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50/70 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:border-transparent transition-all shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    required
                    className="w-full pl-3.5 pr-10 py-2 rounded-xl bg-gray-50/70 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:border-transparent transition-all shadow-xs"
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

              {/* Avatar upload */}
              <div>
                <label className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-gray-50/70 border border-dashed border-gray-300 text-xs text-gray-600 hover:border-gray-900 hover:bg-gray-100 cursor-pointer transition-colors">
                  <div className="flex items-center gap-2">
                    <Upload className="w-3.5 h-3.5 text-gray-500" />
                    <span className="truncate max-w-[180px]">
                      {avatarFile ? avatarFile.name : "Profile photo (optional)"}
                    </span>
                  </div>
                  {avatarFile && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAvatarFile(null);
                      }}
                      className="text-[11px] text-rose-500 hover:underline"
                    >
                      Clear
                    </button>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Main Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-5 rounded-none rounded-bl-lg rounded-tr-lg bg-[#111318] hover:bg-black text-white font-semibold text-sm shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create account</span>
                    <ArrowUpRight className="w-4 h-4 text-[#c8f53c]" />
                  </>
                )}
              </button>
            </form>

            {/* Footer toggle link */}
            <div className="text-center mt-4 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-gray-950 hover:underline inline-flex items-center gap-0.5"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
