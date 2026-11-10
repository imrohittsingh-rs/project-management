import { useState } from "react";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiLoader,
  FiAlertCircle,
  FiCheck,
  FiCamera,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const PasswordInput = ({
  id,
  label,
  value,
  onChange,
  show,
  onToggle,
  autoComplete = "current-password",
}) => (
  <div>
    <label
      htmlFor={id}
      className="mb-1.5 block text-sm font-medium text-[#171717]"
    >
      {label}
    </label>
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#8f8f8f]">
        <FiLock aria-hidden="true" className="h-4 w-4" />
      </div>
      <input
        id={id}
        type={show ? "text" : "password"}
        required
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className="h-10 w-full rounded-xl border border-[#ebebeb] bg-white pl-9 pr-10 text-sm text-[#171717] placeholder:text-[#a1a1a1] transition-colors focus:border-[#171717] focus:outline-none"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#8f8f8f] transition-colors hover:text-[#171717]"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? (
          <FiEyeOff aria-hidden="true" className="h-4 w-4" />
        ) : (
          <FiEye aria-hidden="true" className="h-4 w-4" />
        )}
      </button>
    </div>
  </div>
);

const Profile = () => {
  const { user, updateAvatar, changePassword, resendVerificationEmail } =
    useAuth();

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const [avatarSuccess, setAvatarSuccess] = useState("");

  const avatarUrl =
    user?.avatar?.url || (typeof user?.avatar === "string" ? user.avatar : "");

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAvatarError("");
    setAvatarSuccess("");
    if (!file.type.startsWith("image/")) {
      setAvatarError("Choose an image file.");
      event.target.value = "";
      return;
    }
    if (file.size > 1_000_000) {
      setAvatarError("Image must be 1 MB or smaller.");
      event.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);
    setAvatarBusy(true);
    try {
      await updateAvatar(formData);
      setAvatarSuccess("Profile picture updated.");
    } catch (err) {
      setAvatarError(
        err?.response?.data?.message || "Unable to update profile picture.",
      );
    } finally {
      setAvatarBusy(false);
      event.target.value = "";
    }
  };

  const getInitials = () => {
    if (!user) return "U";
    if (user.fullName) {
      const parts = user.fullName.trim().split(" ");
      return parts.length > 1
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : user.fullName.slice(0, 2).toUpperCase();
    }
    return (user.username || "U").slice(0, 2).toUpperCase();
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPwError("New passwords do not match.");
      return;
    }
    if (passwords.newPassword.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }

    setSaving(true);
    try {
      await changePassword({
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      });
      setPwSuccess("Password changed successfully.");
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPwError(err?.response?.data?.message || "Failed to change password.");
    } finally {
      setSaving(false);
    }
  };

  const handleResendVerification = async () => {
    setResending(true);
    setResendMsg("");
    try {
      const res = await resendVerificationEmail();
      setResendMsg(res?.message || "Verification email sent.");
    } catch (err) {
      setResendMsg(
        err?.response?.data?.message || "Failed to resend verification email.",
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#fafafa] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-xl">
        <header className="mb-8">
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#171717]">
            Profile
          </h1>
        </header>

        {/* User info card */}
        <div className="mb-6 rounded-2xl border border-[#ebebeb] bg-white p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-4">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={`${user?.fullName || user?.username}'s profile`}
                  className="h-14 w-14 shrink-0 rounded-full border border-[#ebebeb] object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#171717] text-xl font-semibold text-white">
                  {getInitials()}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-[#171717]">
                  {user?.fullName || user?.username}
                </p>
                <p className="truncate text-sm text-[#8f8f8f]">{user?.email}</p>
                {user?.isEmailVerified === false && (
                  <span className="mt-1 inline-block rounded-full bg-[#fff3e0] px-2 py-0.5 text-[11px] font-medium text-[#ab570a]">
                    Email not verified
                  </span>
                )}
                {user?.isEmailVerified === true && (
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#d9f7ec] px-2 py-0.5 text-[11px] font-medium text-[#13795b]">
                    <FiCheck className="h-3 w-3" /> Email verified
                  </span>
                )}
              </div>
            </div>

            <div className="sm:shrink-0">
            <label
              htmlFor="profile-picture"
              className={`inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-dashed border-black/50 bg-white px-3 text-sm font-medium text-[#171717] transition-colors hover:bg-[#fafafa] ${avatarBusy ? "pointer-events-none opacity-60" : ""}`}
            >
              {avatarBusy ? (
                <FiLoader className="h-4 w-4 animate-spin" />
              ) : (
                <FiCamera className="h-4 w-4" />
              )}
              {avatarBusy
                ? "Uploading..."
                : avatarUrl
                  ? "Change picture"
                  : "Upload picture"}
            </label>
            <input
              id="profile-picture"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={avatarBusy}
              className="sr-only"
            />
            <p className="mt-1.5 pl-4 text-xs text-[#8f8f8f]">
              Image file, up to 1 MB.
            </p>
            {avatarError && (
              <p role="alert" className="mt-2 text-xs text-[#c50000]">
                {avatarError}
              </p>
            )}
            {avatarSuccess && (
              <p role="status" className="mt-2 text-xs text-[#13795b]">
                {avatarSuccess}
              </p>
            )}
            </div>
          </div>

          <div className="mt-5 space-y-3 border-t border-[#f2f2f2] pt-5">
            <div className="flex items-center gap-3 text-sm">
              <FiUser className="h-4 w-4 shrink-0 text-[#8f8f8f]" />
              <span className="text-[#4d4d4d]">@{user?.username}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <FiMail className="h-4 w-4 shrink-0 text-[#8f8f8f]" />
              <span className="text-[#4d4d4d]">{user?.email}</span>
            </div>
          </div>
        </div>

        {/* Email verification resend */}
        {user?.isEmailVerified === false && (
          <div className="mb-6 rounded-xl border border-[#f0e3bb] bg-[#fffbeb] p-4">
            <p className="text-sm text-[#ab570a]">
              Your email address is not yet verified.
            </p>
            {resendMsg && (
              <p className="mt-1 text-xs text-[#4d4d4d]">{resendMsg}</p>
            )}
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={resending}
              className="mt-3 inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium rounded-full bg-[#171717] text-white hover:bg-[#4d4d4d] disabled:opacity-50 transition-colors"
            >
              {resending && <FiLoader className="h-3.5 w-3.5 animate-spin" />}
              Resend verification email
            </button>
          </div>
        )}

        {/* Change password */}
        <div className="rounded-2xl border border-[#ebebeb] bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-[#171717]">
            Change Password
          </h2>
          {pwError && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#fecaca] bg-[#fff5f5] px-3 py-2 text-xs text-[#c50000]">
              <FiAlertCircle className="h-3.5 w-3.5 shrink-0" />
              {pwError}
            </div>
          )}
          {pwSuccess && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-xs text-[#15803d]">
              <FiCheck className="h-3.5 w-3.5 shrink-0" />
              {pwSuccess}
            </div>
          )}
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <PasswordInput
              id="old-password"
              label="Current password"
              value={passwords.oldPassword}
              onChange={(e) =>
                setPasswords((p) => ({ ...p, oldPassword: e.target.value }))
              }
              show={showOld}
              onToggle={() => setShowOld((v) => !v)}
            />
            <PasswordInput
              id="new-password"
              label="New password"
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords((p) => ({ ...p, newPassword: e.target.value }))
              }
              show={showNew}
              autoComplete="new-password"
              onToggle={() => setShowNew((v) => !v)}
            />
            <PasswordInput
              id="confirm-password"
              label="Confirm new password"
              value={passwords.confirmPassword}
              onChange={(e) =>
                setPasswords((p) => ({ ...p, confirmPassword: e.target.value }))
              }
              show={showConfirm}
              autoComplete="new-password"
              onToggle={() => setShowConfirm((v) => !v)}
            />
            <button
              type="submit"
              disabled={
                saving ||
                !passwords.oldPassword ||
                !passwords.newPassword ||
                !passwords.confirmPassword
              }
              className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-medium rounded-full bg-[#171717] text-white hover:bg-[#4d4d4d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving && <FiLoader className="h-3.5 w-3.5 animate-spin" />}
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
