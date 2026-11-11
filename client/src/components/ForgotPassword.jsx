import { Link } from "react-router-dom";
import { FiAlertCircle, FiLoader } from "react-icons/fi";
import { FaRegCircleCheck } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { IoKey } from "react-icons/io5";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPassword = ({
  email,
  onEmailChange,
  touched,
  onEmailBlur,
  isSending,
  successMessage,
  errorMessage,
  onSubmit,
  onClose,
}) => {
  const decoration = [
    [13, 15],
    [34, 19],
    [85, 15],
    [18, 31],
    [77, 31],
    [5, 43],
    [24, 46],
    [96, 45],
    [17, 61],
    [89, 61],
    [12, 81],
    [84, 81],
    [18, 94],
    [31, 97],
    [73, 97],
    [88, 94],
    [38, 89],
    [62, 89],
  ];

  return (
    <div className="relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden bg-white px-4 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {decoration.map(([left, top], index) => (
          <span
            key={`${left}-${top}`}
            className="absolute h-2.5 w-2.5 rounded-full bg-[#8f8f8f]/40 blur-[3px]"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              opacity: index % 3 === 0 ? 0.8 : 0.55,
            }}
          />
        ))}
      </div>

      <section className="relative w-full max-w-[440px] rounded-xl border border-[#ebebeb] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)] sm:p-8">
        <div className="mb-5 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#f2f2f2] text-[#171717]">
            <IoKey className="h-8 w-8" aria-hidden="true" />
          </div>
          <h1 className="text-4xl font-semibold leading-8 tracking-[-0.7px] text-[#171717]">
            Forgot password?
          </h1>
          <p className="mx-auto mt-3.5 max-w-[290px] text-sm leading-5 text-[#8f8f8f]">
            Enter your account email and we&apos;ll send you a link to reset
            your password.
          </p>
        </div>

        {successMessage ? (
          <div className="space-y-4">
            <div
              role="status"
              className="flex items-start gap-2.5 rounded-md border border-[#bbf7d0] bg-[#f0fdf4] py-2 px-3.5 text-sm text-[#15803d]"
            >
              <FaRegCircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#22c55e]" />
              <div className="text-xs leading-snug sm:text-sm">
                {successMessage}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-full cursor-pointer items-center justify-center rounded-md bg-[#171717] text-sm font-medium text-white transition-colors hover:bg-[#262626]"
            >
              Return to sign in
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="space-y-4">
            {errorMessage && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-md border border-[#fecaca] bg-[#fff5f5] p-3 text-sm leading-snug text-[#c50000]"
              >
                <FiAlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#ee0000]" />
                <div className="flex-1 text-xs sm:text-sm">{errorMessage}</div>
              </div>
            )}

            <div>
              <label
                htmlFor="forgotEmail"
                className="mb-1.5 block text-xs font-semibold tracking-[-0.1px] text-[#171717]"
              >
                Email
              </label>
              <div className="relative">
                <MdEmail
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8f8f8f]"
                />
                <input
                  id="forgotEmail"
                  type="email"
                  required
                  value={email}
                  onChange={onEmailChange}
                  onBlur={onEmailBlur}
                  placeholder="Enter your email"
                  aria-invalid={
                    touched &&
                    Boolean(email.trim()) &&
                    !EMAIL_REGEX.test(email.trim())
                  }
                  aria-describedby={
                    touched &&
                    Boolean(email.trim()) &&
                    !EMAIL_REGEX.test(email.trim())
                      ? "forgot-email-error"
                      : undefined
                  }
                  className="h-10 w-full rounded-md border border-[#dedede] bg-white pl-9 pr-3 text-sm text-[#171717] placeholder:text-[#8f8f8f] focus:outline-none focus:ring-2 focus:border-[#0070f3] focus:ring-[#d3e5ff]"
                />
              </div>
              {touched && email.trim() && !EMAIL_REGEX.test(email.trim()) && (
                <p
                  id="forgot-email-error"
                  className="mt-1 text-xs text-[#ee0000]"
                >
                  Please enter a valid email address
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#171717] text-sm font-medium text-white transition-colors hover:bg-[#262626] focus:outline-none focus:ring-2 focus:ring-[#a1a1a1] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <FiLoader className="h-4 w-4 animate-spin" />
                  <span>Sending reset link...</span>
                </>
              ) : (
                "Reset password"
              )}
            </button>
            <p className="text-center text-xs text-[#8f8f8f]">
              Remember your password?{" "}
              <Link
                to="/login"
                onClick={onClose}
                className="font-medium text-[#0070f3] transition-colors hover:text-[#0761d1]"
              >
                Log in
              </Link>
            </p>
          </form>
        )}
      </section>
    </div>
  );
};

export default ForgotPassword;
