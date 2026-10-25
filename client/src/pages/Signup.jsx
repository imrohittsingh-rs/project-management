import { useState } from "react";
import {
  FiUser,
  FiAtSign,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiLoader,
  FiArrowRight,
  FiCheckCircle
} from "react-icons/fi";
import { FaCircleCheck } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";

const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup({ onNavigateToLogin }) {
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [touched, setTouched] = useState({
    fullName: false,
    username: false,
    email: false,
    password: false,
    confirmPassword: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successData, setSuccessData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Usernames must be lowercase in accordance with backend validation
    const nextVal = name === "username" ? value.toLowerCase().replace(/\s+/g, "") : value;

    setFormData((prev) => ({
      ...prev,
      [name]: nextVal
    }));

    if (serverError) {
      setServerError("");
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true
    }));
  };

  // Password requirement criteria
  const checks = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password)
  };

  // Field validation rules
  const errors = {
    fullName:
      touched.fullName && (!formData.fullName.trim()
        ? "Full name is required"
        : formData.fullName.trim().length < 3
        ? "Full name must be at least 3 characters"
        : formData.fullName.length > 100
        ? "Full name must not exceed 100 characters"
        : null),
    username:
      touched.username && (!formData.username.trim()
        ? "Username is required"
        : !USERNAME_REGEX.test(formData.username)
        ? "Username must be 3-20 lowercase characters (letters, numbers, underscores)"
        : null),
    email:
      touched.email && (!formData.email.trim()
        ? "Email address is required"
        : !EMAIL_REGEX.test(formData.email.trim())
        ? "Please enter a valid email address"
        : null),
    password:
      touched.password && (!formData.password
        ? "Password is required"
        : formData.password.length < 8
        ? "Password must be at least 8 characters"
        : null),
    confirmPassword:
      touched.confirmPassword && (!formData.confirmPassword
        ? "Please confirm your password"
        : formData.password !== formData.confirmPassword
        ? "Passwords do not match"
        : null)
  };

  const isFormValid =
    formData.fullName.trim().length >= 3 &&
    USERNAME_REGEX.test(formData.username) &&
    EMAIL_REGEX.test(formData.email.trim()) &&
    formData.password.length >= 8 &&
    formData.password === formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      fullName: true,
      username: true,
      email: true,
      password: true,
      confirmPassword: true
    });

    if (!isFormValid || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setServerError("");

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      };

      const response = await register(payload);
      toast.success(response?.message || "Registration successful! Please check your email.");

      setSuccessData({
        email: payload.email,
        username: payload.username,
        message:
          response?.message ||
          "Registration successful. A verification link has been sent to your email."
      });
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.msg ||
        err?.message ||
        "An unexpected error occurred during registration. Please try again.";
      setServerError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToLogin = () => {
    if (typeof onNavigateToLogin === "function") {
      onNavigateToLogin();
    } else {
      window.location.href = "/login";
    }
  };

  // Success state: Verification email sent
  if (successData) {
    return (
      <div className="min-h-screen w-full bg-[#fafafa] flex items-center justify-center p-4 selection:bg-[#d3e5ff] selection:text-[#0761d1]">
        <div className="w-full max-w-[440px] bg-white border border-[#ebebeb] rounded-[12px] p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)]">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-[8px] bg-[#f2f2f2] border border-[#ebebeb] flex items-center justify-center text-[#171717] mb-5">
              <FiCheckCircle className="w-6 h-6 text-emerald-500" />
            </div>

            <h1 className="text-2xl font-semibold text-[#171717] tracking-tight mb-2">
              Verify your email
            </h1>

            <p className="text-sm text-[#4d4d4d] leading-relaxed mb-6">
              We sent a verification link to{" "}
              <span className="font-medium text-[#171717]">{successData.email}</span>. Please click the link in your email to activate your account and get started.
            </p>

            <div className="w-full border-t border-[#ebebeb] pt-6 space-y-3">
              <button
                type="button"
                onClick={handleGoToLogin}
                className="w-full h-10 px-4 bg-[#171717] hover:bg-[#262626] active:bg-[#000000] text-white text-sm font-medium rounded-[6px] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                Continue to sign in
                <FiArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setSuccessData(null);
                  setFormData({
                    fullName: "",
                    username: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                  });
                  setTouched({
                    fullName: false,
                    username: false,
                    email: false,
                    password: false,
                    confirmPassword: false
                  });
                }}
                className="w-full h-10 px-4 bg-white hover:bg-[#fafafa] text-[#4d4d4d] hover:text-[#171717] border border-[#ebebeb] text-sm font-medium rounded-[6px] transition-colors cursor-pointer"
              >
                Register another account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#fafafa] flex flex-col justify-center items-center py-12 px-4 selection:bg-[#d3e5ff] selection:text-[#0761d1]">

      {/* Main Card */}
      <div className="w-full max-w-[440px] bg-white border border-[#ebebeb] rounded-[12px] p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)]">
        <div className="mb-6">
          <h1 className="text-3xl text-center font-semibold text-[#171717] tracking-[-0.6px] mb-1.5">
            Your first project <br /> is just a sign-up away.
          </h1>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div
            role="alert"
            className="mb-5 p-3 rounded-[6px] bg-[#fff5f5] border border-[#fecaca] text-[#c50000] text-sm flex items-start gap-2.5 leading-snug"
          >
            <FiAlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-[#ee0000]" />
            <div className="flex-1 text-xs sm:text-sm">{serverError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Full Name Field */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-[#171717] tracking-[-0.28px] mb-1.5"
            >
              Full name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8f8f8f]">
                <FiUser className="w-4 h-4" />
              </div>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Jane Doe"
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={errors.fullName ? "fullName-error" : undefined}
                className={`w-full h-10 pl-9 pr-3 text-sm text-[#171717] bg-white border ${
                  errors.fullName
                    ? "border-[#ee0000] focus:border-[#ee0000] focus:ring-[#fee2e2]"
                    : "border-[#ebebeb] focus:border-[#0070f3] focus:ring-[#d3e5ff]"
                } rounded-[6px] placeholder:text-[#a1a1a1] focus:outline-none focus:ring-2 transition-all`}
              />
            </div>
            {errors.fullName && (
              <p id="fullName-error" className="mt-1 text-xs text-[#ee0000]">
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Username Field */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-[#171717] tracking-[-0.28px] mb-1.5"
            >
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8f8f8f]">
                <FiAtSign className="w-4 h-4" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck="false"
                required
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="janedoe"
                aria-invalid={Boolean(errors.username)}
                aria-describedby={errors.username ? "username-error" : undefined}
                className={`w-full h-10 pl-9 pr-3 text-sm text-[#171717] bg-white border ${
                  errors.username
                    ? "border-[#ee0000] focus:border-[#ee0000] focus:ring-[#fee2e2]"
                    : "border-[#ebebeb] focus:border-[#0070f3] focus:ring-[#d3e5ff]"
                } rounded-[6px] placeholder:text-[#a1a1a1] focus:outline-none focus:ring-2 transition-all`}
              />
            </div>
            {errors.username ? (
              <p id="username-error" className="mt-1 text-xs text-[#ee0000]">
                {errors.username}
              </p>
            ) : (
              <p className="mt-1 text-xs text-[#8f8f8f]">
                3-20 characters, lowercase letters, numbers, and underscores only.
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#171717] tracking-[-0.28px] mb-1.5"
            >
              Work email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8f8f8f]">
                <FiMail className="w-4 h-4" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="jane@company.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={`w-full h-10 pl-9 pr-3 text-sm text-[#171717] bg-white border ${
                  errors.email
                    ? "border-[#ee0000] focus:border-[#ee0000] focus:ring-[#fee2e2]"
                    : "border-[#ebebeb] focus:border-[#0070f3] focus:ring-[#d3e5ff]"
                } rounded-[6px] placeholder:text-[#a1a1a1] focus:outline-none focus:ring-2 transition-all`}
              />
            </div>
            {errors.email && (
              <p id="email-error" className="mt-1 text-xs text-[#ee0000]">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#171717] tracking-[-0.28px] mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8f8f8f]">
                <FiLock className="w-4 h-4" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="••••••••"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "password-error" : undefined}
                className={`w-full h-10 pl-9 pr-10 text-sm text-[#171717] bg-white border ${
                  errors.password
                    ? "border-[#ee0000] focus:border-[#ee0000] focus:ring-[#fee2e2]"
                    : "border-[#ebebeb] focus:border-[#0070f3] focus:ring-[#d3e5ff]"
                } rounded-[6px] placeholder:text-[#a1a1a1] focus:outline-none focus:ring-2 transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8f8f8f] hover:text-[#171717] transition-colors focus:outline-none cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="mt-1 text-xs text-[#ee0000]">
                {errors.password}
              </p>
            )}

            {/* Password Requirement Indicators */}
            {formData.password && (
              <div className="mt-2.5 p-2.5 bg-[#fafafa] border border-[#ebebeb] rounded-[6px] space-y-1.5 text-xs text-[#4d4d4d]">
                <div className="flex items-center gap-1.5">
                  <FaCircleCheck className={`w-3.5 h-3.5 shrink-0 overflow-visible transition-colors ${checks.length ? "text-emerald-500" : "text-gray-300"}`} />
                  <span>8 characters</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FaCircleCheck className={`w-3.5 h-3.5 shrink-0 overflow-visible transition-colors ${checks.uppercase ? "text-emerald-500" : "text-gray-300"}`} />
                  <span>Uppercase letter</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FaCircleCheck className={`w-3.5 h-3.5 shrink-0 overflow-visible transition-colors ${checks.lowercase ? "text-emerald-500" : "text-gray-300"}`} />
                  <span>Lowercase letter</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FaCircleCheck className={`w-3.5 h-3.5 shrink-0 overflow-visible transition-colors ${checks.number ? "text-emerald-500" : "text-gray-300"}`} />
                  <span>Number</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FaCircleCheck className={`w-3.5 h-3.5 shrink-0 overflow-visible transition-colors ${checks.special ? "text-emerald-500" : "text-gray-300"}`} />
                  <span>Special character</span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-[#171717] tracking-[-0.28px] mb-1.5"
            >
              Confirm password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8f8f8f]">
                <FiLock className="w-4 h-4" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="••••••••"
                aria-invalid={Boolean(errors.confirmPassword)}
                aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                className={`w-full h-10 pl-9 pr-10 text-sm text-[#171717] bg-white border ${
                  errors.confirmPassword
                    ? "border-[#ee0000] focus:border-[#ee0000] focus:ring-[#fee2e2]"
                    : "border-[#ebebeb] focus:border-[#0070f3] focus:ring-[#d3e5ff]"
                } rounded-[6px] placeholder:text-[#a1a1a1] focus:outline-none focus:ring-2 transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8f8f8f] hover:text-[#171717] transition-colors focus:outline-none cursor-pointer"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <FiEyeOff className="w-4 h-4" />
                ) : (
                  <FiEye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p id="confirmPassword-error" className="mt-1 text-xs text-[#ee0000]">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10 mt-2 bg-[#171717] hover:bg-[#262626] active:bg-[#000000] text-white text-sm font-medium rounded-[6px] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xs"
          >
            {isSubmitting ? (
              <>
                <FiLoader className="w-4 h-4 animate-spin text-white" />
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <span>Create account</span>
                <FiArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Card Footer: Sign In Link */}
        <div className="mt-6 pt-5 border-t border-[#ebebeb] text-center">
          <p className="text-sm text-[#4d4d4d]">
            Already have an account?{" "}
            <button
              type="button"
              onClick={handleGoToLogin}
              className="font-medium text-[#0070f3] hover:text-[#0761d1] transition-colors cursor-pointer bg-transparent border-none p-0 inline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
