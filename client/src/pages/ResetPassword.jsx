import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiAlertCircle, FiCheckCircle, FiLoader, FiLock } from "react-icons/fi";
import { FaCircleCheck } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";
import toast from "../utils/toast.js";

const ResetPassword = () => {
  const { resetToken } = useParams();
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const checks = {
    length: password.length >= 8 && password.length <= 100,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const isPasswordValid = Object.values(checks).every(Boolean);
  const errors = {
    password:
      touched.password &&
      (!password
        ? "Password is required"
        : password.length > 100
          ? "Password must not exceed 100 characters"
          : !isPasswordValid
            ? "Please satisfy all password requirements."
            : null),
    confirmPassword:
      touched.confirmPassword &&
      (!confirmPassword
        ? "Please confirm your password"
        : password !== confirmPassword
          ? "Passwords do not match"
          : null),
  };
  const isFormValid = isPasswordValid && password === confirmPassword;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched({ password: true, confirmPassword: true });
    setError("");

    if (!isFormValid || saving) return;

    setSaving(true);
    try {
      await resetPassword(resetToken, password);
      setSuccess(true);
      toast.success("Password reset successfully. You can sign in now.");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "This reset link is invalid or has expired.";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setError("");
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    setError("");
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#fafafa] px-4 py-12">
      <section className="w-full max-w-[440px] rounded-xl border border-[#ebebeb] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] sm:p-8">
        {success ? (
          <div className="text-center">
            <FiCheckCircle
              className="mx-auto mb-4 h-8 w-8 text-[#0070f3]"
              aria-hidden="true"
            />
            <h1 className="text-2xl font-semibold tracking-[-0.6px] text-[#171717]">
              Password updated
            </h1>
            <p className="mt-2 text-sm text-[#4d4d4d]">
              You can now sign in with your new password.
            </p>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-6 h-10 w-full rounded-md bg-[#171717] px-4 text-sm font-medium text-white hover:bg-[#262626]"
            >
              Continue to sign in
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-semibold tracking-[-0.6px] text-[#171717]">
              Set a new password
            </h1>
            {error && (
              <p
                role="alert"
                className="mt-5 flex items-start gap-2 rounded-md border border-[#fecaca] bg-[#fff5f5] p-3 text-sm text-[#c50000]"
              >
                <FiAlertCircle
                  className="mt-0.5 h-4 w-4 shrink-0"
                  aria-hidden="true"
                />
                {error}
              </p>
            )}
            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
              <div>
                <label
                  className="mb-1.5 block text-sm font-medium text-[#171717]"
                  htmlFor="new-password"
                >
                  New password
                </label>
                <div className="relative">
                  <FiLock
                    className="absolute left-3 top-3 h-4 w-4 text-[#8f8f8f]"
                    aria-hidden="true"
                  />
                  <input
                    id="new-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    maxLength={100}
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={() =>
                      setTouched((prev) => ({ ...prev, password: true }))
                    }
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={
                      errors.password
                        ? "new-password-error"
                        : "password-requirements"
                    }
                    className={`h-10 w-full rounded-md border bg-white pl-9 pr-3 text-sm text-[#171717] placeholder:text-[#a1a1a1] focus:outline-none focus:ring-2 transition-all ${
                      errors.password
                        ? "border-[#ee0000] focus:border-[#ee0000] focus:ring-[#fee2e2]"
                        : "border-[#ebebeb] focus:border-[#0070f3] focus:ring-[#d3e5ff]"
                    }`}
                  />
                </div>
                {errors.password ? (
                  <p
                    id="new-password-error"
                    className="mt-1 text-xs text-[#ee0000]"
                  >
                    {errors.password}
                  </p>
                ) : null}
                <div
                  id="password-requirements"
                  className="mt-2.5 space-y-1.5 rounded-md border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs text-[#4d4d4d]"
                >
                  {[
                    ["length", "8-100 characters"],
                    ["uppercase", "Uppercase letter"],
                    ["lowercase", "Lowercase letter"],
                    ["number", "Number"],
                    ["special", "Special character"],
                  ].map(([key, label]) => (
                    <div key={key} className="flex items-center gap-1.5">
                      <FaCircleCheck
                        className={`h-3.5 w-3.5 shrink-0 transition-colors ${
                          checks[key] ? "text-emerald-500" : "text-gray-300"
                        }`}
                        aria-hidden="true"
                      />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label
                  className="mb-1.5 block text-sm font-medium text-[#171717]"
                  htmlFor="confirm-password"
                >
                  Confirm new password
                </label>
                <div className="relative">
                  <FiLock
                    className="absolute left-3 top-3 h-4 w-4 text-[#8f8f8f]"
                    aria-hidden="true"
                  />
                  <input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    maxLength={100}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    onBlur={() =>
                      setTouched((prev) => ({ ...prev, confirmPassword: true }))
                    }
                    aria-invalid={Boolean(errors.confirmPassword)}
                    aria-describedby={
                      errors.confirmPassword
                        ? "confirm-password-error"
                        : undefined
                    }
                    className={`h-10 w-full rounded-md border bg-white pl-9 pr-3 text-sm text-[#171717] placeholder:text-[#a1a1a1] focus:outline-none focus:ring-2 transition-all ${
                      errors.confirmPassword
                        ? "border-[#ee0000] focus:border-[#ee0000] focus:ring-[#fee2e2]"
                        : "border-[#ebebeb] focus:border-[#0070f3] focus:ring-[#d3e5ff]"
                    }`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p
                    id="confirm-password-error"
                    className="mt-1 text-xs text-[#ee0000]"
                  >
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#171717] px-4 text-sm font-medium text-white hover:bg-[#262626] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving && (
                  <FiLoader
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                {saving ? "Updating password..." : "Update password"}
              </button>
            </form>
            <p className="mt-5 text-center text-sm text-[#4d4d4d]">
              Return to{" "}
              <Link
                to="/login"
                className="font-medium text-[#0070f3] hover:text-[#0761d1]"
              >
                sign in
              </Link>
            </p>
          </>
        )}
      </section>
    </div>
  );
};

export default ResetPassword;
