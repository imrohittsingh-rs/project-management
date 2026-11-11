import { useCallback, useEffect, useState } from "react";
import { FiAlertCircle, FiPlus, FiX } from "react-icons/fi";
import {
  getProjectMembers,
  addMemberToProject,
  updateMemberRole,
  deleteMember,
} from "../../services/projectService";
import Loader from "../Loadingspinner";
import { ActionBtn, Input } from "./shared";
import { initials, ROLE_CONFIG } from "./sharedData";
import toast from "../../utils/toast.js";

const MembersTab = ({ projectId, userRole, currentUserId }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [addEmail, setAddEmail] = useState("");
  const [addRole, setAddRole] = useState("member");
  const [adding, setAdding] = useState(false);

  const isAdmin = userRole === "admin";
  const canAddMembers = isAdmin || userRole === "project_admin";

  const loadMembers = useCallback(async () => {
    try {
      const res = await getProjectMembers(projectId);
      setMembers(Array.isArray(res?.data) ? res.data : []);
    } catch {
      setError("Unable to load members");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    let active = true;
    getProjectMembers(projectId)
      .then((response) => {
        if (active)
          setMembers(Array.isArray(response?.data) ? response.data : []);
      })
      .catch(() => {
        if (active) setError("Unable to load members");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [projectId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!addEmail.trim()) return;
    setAdding(true);
    try {
      await addMemberToProject(projectId, {
        email: addEmail.trim().toLowerCase(),
        role: addRole,
      });
      setAddEmail("");
      setAddRole("member");
      setShowAdd(false);
      await loadMembers();
      toast.success("Invitation sent");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to invite member");
    } finally {
      setAdding(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateMemberRole(projectId, userId, { newRole });
      setMembers((prev) =>
        prev.map((m) => (m.user._id === userId ? { ...m, role: newRole } : m)),
      );
      toast.success("Member role updated");
    } catch {
      toast.error("Failed to update member role");
    }
  };

  const handleRemove = async (userId) => {
    if (!window.confirm("Remove this member from the project?")) return;
    try {
      await deleteMember(projectId, userId);
      setMembers((prev) => prev.filter((m) => m.user._id !== userId));
      toast.success("Member removed");
    } catch {
      toast.error("Failed to remove member");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-md border border-[#fecaca] bg-[#fff5f5] px-3 py-2 text-xs text-[#c50000]">
          <FiAlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </div>
      )}

      {canAddMembers && (
        <div className="mb-4">
          {!showAdd ? (
            <ActionBtn onClick={() => setShowAdd(true)}>
              <FiPlus className="h-3.5 w-3.5" />
              Add Member
            </ActionBtn>
          ) : (
            <form
              onSubmit={handleAdd}
              className="rounded-lg border border-[#ebebeb] bg-white p-4 space-y-3"
            >
              <p className="text-sm font-semibold text-[#171717]">Add Member</p>
              <Input
                id="add-member-email"
                label="Email address"
                type="email"
                placeholder="jane@company.com"
                value={addEmail}
                onChange={(e) => setAddEmail(e.target.value)}
                required
              />
              {isAdmin && (
                <div>
                  <label
                    htmlFor="add-member-role"
                    className="block text-sm font-medium text-[#171717] mb-1.5"
                  >
                    Role
                  </label>
                  <select
                    id="add-member-role"
                    value={addRole}
                    onChange={(e) => setAddRole(e.target.value)}
                    className="w-full h-9 px-3 text-sm bg-white border border-[#ebebeb] rounded-md text-[#171717] focus:outline-none focus:border-[#171717] transition-colors"
                  >
                    <option value="member">Member</option>
                    <option value="project_admin">Project Admin</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              )}
              {!isAdmin && (
                <p className="text-xs text-[#8f8f8f]">
                  New members are added with the Member role.
                </p>
              )}
              <div className="flex gap-2 pt-1">
                <ActionBtn type="submit" loading={adding}>
                  Add
                </ActionBtn>
                <ActionBtn
                  variant="secondary"
                  onClick={() => setShowAdd(false)}
                >
                  Cancel
                </ActionBtn>
              </div>
            </form>
          )}
        </div>
      )}

      <div className="space-y-3">
        {members.length === 0 ? (
          <div className="rounded-xl border border-[#ebebeb] bg-white px-4 py-8 text-center text-sm text-[#8f8f8f]">
            No members found.
          </div>
        ) : (
          members.map((m) => {
            const roleCfg = ROLE_CONFIG[m.role] || ROLE_CONFIG.member;
            const user = m.user;
            const isCurrentUser = user._id === currentUserId;
            return (
              <div
                key={m._id}
                className="flex items-center gap-3 rounded-2xl border border-[#ebebeb] bg-white px-4 py-3"
              >
                <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#171717] text-xs font-semibold text-white">
                  {initials(user.fullName || user.username)}
                  {user.avatar?.url && (
                    <img
                      src={user.avatar.url}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#171717] truncate">
                    {user.fullName || user.username}
                  </p>
                  <p className="text-xs text-[#8f8f8f] truncate">
                    {user.email}
                  </p>
                </div>

                {isAdmin ? (
                  <select
                    value={m.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    disabled={isCurrentUser}
                    aria-label={`Role for ${user.fullName || user.username}`}
                    title={
                      isCurrentUser
                        ? "You cannot change your own project role"
                        : undefined
                    }
                    className="h-7 rounded-md border border-[#ebebeb] bg-white px-2 text-[11px] text-[#4d4d4d] focus:outline-none"
                  >
                    <option value="member">Member</option>
                    <option value="project_admin">Project Admin</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${roleCfg.badge}`}
                  >
                    {roleCfg.label}
                  </span>
                )}

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => handleRemove(user._id)}
                    className="p-1 text-[#a1a1a1] hover:text-[#ee0000] rounded-sm transition-colors"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MembersTab;
