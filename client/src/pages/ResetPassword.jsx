import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiAlertCircle, FiCheckCircle, FiLoader, FiLock } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import toast from "../utils/toast.js";

const ResetPassword = () => {
  const { resetToken } = useParams();
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSaving(true);
    try {
      await resetPassword(resetToken, password);
      setSuccess(true);
      toast.success("Password reset successfully. You can sign in now.");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "This reset link is invalid or has expired.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#fafafa] px-4 py-12">
      <section className="w-full max-w-[440px] rounded-xl border border-[#ebebeb] bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)]">
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
            <h1 className="text-2xl font-semibold tracking-[-0.6px] text-[#171717]">
              Set a new password
            </h1>
            <p className="mt-2 text-sm text-[#4d4d4d]">
              Choose a password with at least 8 characters.
            </p>
            {error && (
              <p
                role="alert"
                className="mt-5 flex items-start gap-2 rounded-md border border-[#fecaca] bg-[#fff5f5] p-3 text-sm text-[#c50000]"
              >
                <FiAlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </p>
            )}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label
                className="block text-sm font-medium text-[#171717]"
                htmlFor="new-password"
              >
                New password
              </label>
              <div className="relative -mt-2">
                <FiLock
                  className="absolute left-3 top-3 h-4 w-4 text-[#8f8f8f]"
                  aria-hidden="true"
                />
                <input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-10 w-full rounded-md border border-[#ebebeb] bg-white pl-9 pr-3 text-sm text-[#171717] focus:border-[#0070f3] focus:outline-none focus:ring-2 focus:ring-[#d3e5ff]"
                />
              </div>
              <label
                className="block text-sm font-medium text-[#171717]"
                htmlFor="confirm-password"
              >
                Confirm new password
              </label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="-mt-2 h-10 w-full rounded-md border border-[#ebebeb] bg-white px-3 text-sm text-[#171717] focus:border-[#0070f3] focus:outline-none focus:ring-2 focus:ring-[#d3e5ff]"
              />
              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#171717] px-4 text-sm font-medium text-white hover:bg-[#262626] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving && <FiLoader className="h-4 w-4 animate-spin" />}
                Update password
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
