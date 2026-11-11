import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiLoader } from "react-icons/fi";
import { MdEmail } from "react-icons/md";
import { IoKey } from "react-icons/io5";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DECORATION_POINTS = [
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

function useCooldown(cooldownUntil) {
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    if (!cooldownUntil) {
      setRemainingSeconds(0);
      return undefined;
    }

    const updateRemaining = () => {
      setRemainingSeconds(
        Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000)),
      );
    };

    updateRemaining();
    const intervalId = window.setInterval(updateRemaining, 1000);
    return () => window.clearInterval(intervalId);
  }, [cooldownUntil]);

  return remainingSeconds;
}

function DecorativeBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {DECORATION_POINTS.map(([left, top], index) => (
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
  );
}

function EmailField({ email, touched, onChange, onBlur }) {
  const hasInvalidEmail =
    touched && Boolean(email.trim()) && !EMAIL_REGEX.test(email.trim());

  return (
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
          onChange={onChange}
          onBlur={onBlur}
          placeholder="Enter your email"
          aria-invalid={hasInvalidEmail}
          aria-describedby={hasInvalidEmail ? "forgot-email-error" : undefined}
          className="h-10 w-full rounded-md border border-[#dedede] bg-white pl-9 pr-3 text-sm text-[#171717] placeholder:text-[#8f8f8f] focus:outline-none focus:ring-2 focus:border-[#0070f3] focus:ring-[#d3e5ff]"
        />
      </div>
      {hasInvalidEmail && (
        <p id="forgot-email-error" className="mt-1 text-xs text-[#ee0000]">
          Please enter a valid email address
        </p>
      )}
    </div>
  );
}

function ResetPasswordButton({ isSending }) {
  return (
    <button
      type="submit"
      disabled={isSending}
      className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#171717] text-sm font-medium text-white transition-colors hover:bg-[#262626] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
  );
}

function CooldownMessage({ seconds }) {
  if (seconds === 0) return null;

  return (
    <p className="-mt-2 text-center text-xs text-[#8f8f8f]" role="status">
      You can request another link in {seconds} seconds.
    </p>
  );
}

const ForgotPassword = ({
  email,
  onEmailChange,
  touched,
  onEmailBlur,
  isSending,
  cooldownUntil,
  onSubmit,
  onClose,
}) => {
  const cooldown = useCooldown(cooldownUntil);

  return (
    <div className="relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden bg-white px-4 py-12">
      <DecorativeBackground />

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

        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <EmailField
            email={email}
            touched={touched}
            onChange={onEmailChange}
            onBlur={onEmailBlur}
          />

          {cooldown === 0 && <ResetPasswordButton isSending={isSending} />}
          <CooldownMessage seconds={cooldown} />
          <button
            type="button"
            onClick={onClose}
            className="h-10 w-full rounded-md border border-[#ebebeb] bg-white text-sm font-medium text-[#171717] transition-colors hover:bg-[#fafafa]"
          >
            Return to sign in
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
      </section>
    </div>
  );
};

export default ForgotPassword;
