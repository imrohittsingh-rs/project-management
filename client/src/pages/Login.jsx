import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiLock,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiLoader,
  FiArrowRight,
  FiCheckCircle,
  FiMail,
  FiArrowLeft
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext.jsx";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/;

export default function Login() {
  const { user, login, forgotPassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [touched, setTouched] = useState({
    identifier: false,
    password: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  // Forgot password sub-state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotTouched, setForgotTouched] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [forgotSuccessMessage, setForgotSuccessMessage] = useState("");
  const [forgotErrorMessage, setForgotErrorMessage] = useState("");

  const handleIdentifierChange = (e) => {
    setIdentifier(e.target.value);
    if (serverError) setServerError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (serverError) setServerError("");
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true
    }));
  };

  // Validation rules
  const trimmedId = identifier.trim();
  const isEmailInput = trimmedId.includes("@");

  let identifierError = null;
  if (touched.identifier) {
    if (!trimmedId) {
      identifierError = "Email or username is required";
    } else if (isEmailInput && !EMAIL_REGEX.test(trimmedId)) {
      identifierError = "Please enter a valid email address";
    } else if (!isEmailInput && !USERNAME_REGEX.test(trimmedId.toLowerCase())) {
      identifierError = "Username must be 3-20 alphanumeric characters or underscore";
    }
  }

  let passwordError = null;
  if (touched.password) {
    if (!password) {
      passwordError = "Password is required";
    }
  }

  const isFormValid =
    trimmedId.length > 0 &&
    (!isEmailInput || EMAIL_REGEX.test(trimmedId)) &&
    (isEmailInput || USERNAME_REGEX.test(trimmedId.toLowerCase())) &&
    password.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      identifier: true,
      password: true
    });

    if (!isFormValid || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setServerError("");

    try {
      // Build credentials object according to whether identifier is email or username
      const cleanIdentifier = trimmedId;
      const isEmail = cleanIdentifier.includes("@");

      const payload = {
        ...(isEmail
          ? { email: cleanIdentifier.toLowerCase() }
          : { username: cleanIdentifier.toLowerCase() }),
        password
      };

      await login(payload);
      navigate("/dashboard");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.msg ||
        err?.message ||
        "Invalid username/email or password. Please try again.";
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotTouched(true);

    if (!forgotEmail.trim() || !EMAIL_REGEX.test(forgotEmail.trim()) || isSendingReset) {
      return;
    }

    setIsSendingReset(true);
    setForgotErrorMessage("");
    setForgotSuccessMessage("");

    try {
      const response = await forgotPassword({ email: forgotEmail.trim().toLowerCase() });
      const msg = response?.message || "Password reset instructions sent to your email.";
      setForgotSuccessMessage(msg);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to send reset link. Please verify the email address.";
      setForgotErrorMessage(msg);
    } finally {
      setIsSendingReset(false);
    }
  };

  // Forgot password overlay
  if (showForgotModal) {
    return (
      <div className="min-h-screen w-full bg-[#fafafa] flex flex-col justify-center items-center py-12 px-4 selection:bg-[#d3e5ff] selection:text-[#0761d1]">
        <div className="w-full max-w-[440px] bg-white border border-[#ebebeb] rounded-[12px] p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)]">
          <div className="mb-6">
            <button
              type="button"
              onClick={() => {
                setShowForgotModal(false);
                setForgotErrorMessage("");
                setForgotSuccessMessage("");
              }}
              className="inline-flex items-center gap-1.5 text-xs text-[#8f8f8f] hover:text-[#171717] transition-colors mb-4 cursor-pointer"
            >
              <FiArrowLeft className="w-3.5 h-3.5" />
              <span>Back to sign in</span>
            </button>

            <h1 className="text-2xl font-semibold text-[#171717] tracking-[-0.4px] mb-1.5">
              Reset your password
            </h1>
            <p className="text-sm text-[#4d4d4d]">
              Enter your account email and we'll send you a link to reset your password.
            </p>
          </div>

          {forgotSuccessMessage ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-[6px] bg-[#f0fdf4] border border-[#bbf7d0] text-[#15803d] text-sm flex items-start gap-2.5">
                <FiCheckCircle className="w-4 h-4 mt-0.5 shrink-0 text-[#22c55e]" />
                <div className="text-xs sm:text-sm leading-snug">{forgotSuccessMessage}</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotSuccessMessage("");
                }}
                className="w-full h-10 bg-[#171717] hover:bg-[#262626] active:bg-[#000000] text-white text-sm font-medium rounded-[6px] transition-colors flex items-center justify-center cursor-pointer"
              >
                Return to sign in
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotSubmit} noValidate className="space-y-4">
              {forgotErrorMessage && (
                <div
                  role="alert"
                  className="p-3 rounded-[6px] bg-[#fff5f5] border border-[#fecaca] text-[#c50000] text-sm flex items-start gap-2.5 leading-snug"
                >
                  <FiAlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-[#ee0000]" />
                  <div className="flex-1 text-xs sm:text-sm">{forgotErrorMessage}</div>
                </div>
              )}

              <div>
                <label
                  htmlFor="forgotEmail"
                  className="block text-sm font-medium text-[#171717] tracking-[-0.28px] mb-1.5"
                >
                  Work email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8f8f8f]">
                    <FiMail className="w-4 h-4" />
                  </div>
                  <input
                    id="forgotEmail"
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => {
                      setForgotEmail(e.target.value);
                      if (forgotErrorMessage) setForgotErrorMessage("");
                    }}
                    onBlur={() => setForgotTouched(true)}
                    placeholder="jane@company.com"
                    className="w-full h-10 pl-9 pr-3 text-sm text-[#171717] bg-white border border-[#ebebeb] focus:border-[#0070f3] focus:ring-2 focus:ring-[#d3e5ff] rounded-[6px] placeholder:text-[#a1a1a1] focus:outline-none transition-all"
                  />
                </div>
                {forgotTouched && !EMAIL_REGEX.test(forgotEmail.trim()) && (
                  <p className="mt-1 text-xs text-[#ee0000]">Please enter a valid email address</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSendingReset}
                className="w-full h-10 bg-[#171717] hover:bg-[#262626] active:bg-[#000000] text-white text-sm font-medium rounded-[6px] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSendingReset ? (
                  <>
                    <FiLoader className="w-4 h-4 animate-spin text-white" />
                    <span>Sending reset link...</span>
                  </>
                ) : (
                  <>
                    <span>Send reset link</span>
                    <FiArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#fafafa] flex flex-col justify-center items-center py-12 px-4 selection:bg-[#d3e5ff] selection:text-[#0761d1]">
      {/* Main Card */}
      <div className="w-full max-w-[440px] bg-white border border-[#ebebeb] rounded-[12px] p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)]">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl text-center font-semibold text-[#171717] tracking-[-0.6px] mb-1.5">
            Sign in to Project Camp
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

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Email or Username Field */}
          <div>
            <label
              htmlFor="identifier"
              className="block text-sm font-medium text-[#171717] tracking-[-0.28px] mb-1.5"
            >
              Email or username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8f8f8f]">
                <FiUser className="w-4 h-4" />
              </div>
              <input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="username email"
                autoCapitalize="none"
                spellCheck="false"
                required
                value={identifier}
                onChange={handleIdentifierChange}
                onBlur={() => handleBlur("identifier")}
                placeholder="Enter you email or username"
                aria-invalid={Boolean(identifierError)}
                aria-describedby={identifierError ? "identifier-error" : undefined}
                className={`w-full h-10 pl-9 pr-3 text-sm text-[#171717] bg-white border ${
                  identifierError
                    ? "border-[#ee0000] focus:border-[#ee0000] focus:ring-[#fee2e2]"
                    : "border-[#ebebeb] focus:border-[#0070f3] focus:ring-[#d3e5ff]"
                } rounded-[6px] placeholder:text-[#a1a1a1] focus:outline-none focus:ring-2 transition-all`}
              />
            </div>
            {identifierError && (
              <p id="identifier-error" className="mt-1 text-xs text-[#ee0000]">
                {identifierError}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium text-[#171717] tracking-[-0.28px]"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs text-[#0070f3] hover:text-[#0761d1] transition-colors cursor-pointer bg-transparent border-none p-0"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8f8f8f]">
                <FiLock className="w-4 h-4" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => handleBlur("password")}
                placeholder="••••••••"
                aria-invalid={Boolean(passwordError)}
                aria-describedby={passwordError ? "password-error" : undefined}
                className={`w-full h-10 pl-9 pr-10 text-sm text-[#171717] bg-white border ${
                  passwordError
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
            {passwordError && (
              <p id="password-error" className="mt-1 text-xs text-[#ee0000]">
                {passwordError}
              </p>
            )}
          </div>

          {/* Remember me option */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded-[4px] border-[#ebebeb] text-[#171717] focus:ring-[#0070f3] accent-[#171717] cursor-pointer"
              />
              <span className="text-xs text-[#4d4d4d]">Keep me signed in</span>
            </label>
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
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign in</span>
                <FiArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Card Footer: Sign Up Link */}
        <div className="mt-6 pt-5 border-t border-[#ebebeb] text-center">
          <p className="text-sm text-[#4d4d4d]">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-[#0070f3] hover:text-[#0761d1] transition-colors cursor-pointer bg-transparent border-none p-0 inline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
