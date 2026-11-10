import { useCallback, useEffect, useState } from "react";
import {
  FiChevronDown,
  FiGrid,
  FiList,
  FiUsers,
  FiPlus,
  FiX,
  FiLoader,
  FiLogOut,
} from "react-icons/fi";
import { FaFolderOpen } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion as Motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { getProjects, createProject } from "../services/projectService";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [projectsError, setProjectsError] = useState("");
  const [projectsOpen, setProjectsOpen] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [collapsed, setCollapsed] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 768px)").matches,
  );
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const loadProjects = useCallback(async () => {
    try {
      const response = await getProjects();
      setProjects(response?.data ?? []);
    } catch {
      setProjectsError("Unable to load projects");
    }
  }, []);

  useEffect(() => {
    if (!user) return undefined;
    let active = true;

    getProjects()
      .then((response) => {
        if (active) setProjects(response?.data ?? []);
      })
      .catch(() => {
        if (active) setProjectsError("Unable to load projects");
      });

    return () => {
      active = false;
    };
  }, [user]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    setCreateError("");
    try {
      const res = await createProject({
        name: newName.trim(),
        description: newDesc.trim(),
      });
      const created = res?.data?.project || res?.data;
      setShowCreate(false);
      setNewName("");
      setNewDesc("");
      await loadProjects();
      if (created?._id) navigate(`/projects/${created._id}`);
    } catch (err) {
      setCreateError(
        err?.response?.data?.message || "Failed to create project",
      );
    } finally {
      setCreating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <Motion.aside
        initial={false}
        animate={{
          width: collapsed
            ? "var(--sidebar-collapsed-width)"
            : "var(--sidebar-expanded-width)",
        }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
        className="[--sidebar-collapsed-width:100%] [--sidebar-expanded-width:100%] w-full shrink-0 border-b border-[#ebebeb] bg-white md:min-h-[calc(100vh-4rem)] md:border-b-0 md:border-r md:[--sidebar-collapsed-width:72px] md:[--sidebar-expanded-width:256px]"
      >
        <nav
          className={`flex flex-col gap-6 p-4 md:min-h-[calc(100vh-4rem)] ${collapsed ? "md:px-2" : ""}`}
          aria-label={`${user?.fullName || user?.username || "User"} dashboard navigation`}
        >
          {/* Workspace section */}
          <section>
            <div className="space-y-1">
              <SidebarLink
                to="/dashboard"
                icon={<FiGrid className="h-5 w-5" />}
                label="Dashboard"
                active={isActive("/dashboard")}
                collapsed={collapsed}
              />
              <SidebarLink
                to="/tasks"
                icon={<FiList className="h-5 w-5" />}
                label="All Tasks"
                active={isActive("/tasks")}
                collapsed={collapsed}
              />
              <SidebarLink
                to="/team"
                icon={<FiUsers className="h-5 w-5" />}
                label="Team"
                active={isActive("/team")}
                collapsed={collapsed}
              />
            </div>
          </section>

          <div className="border-t border-[#ebebeb]" aria-hidden="true" />

          {/* Projects section */}
          <section>
            <div
              className={`flex items-center justify-between mb-1 ${collapsed ? "px-0" : "px-3"}`}
            >
              <button
                type="button"
                onClick={() => setProjectsOpen((o) => !o)}
                className={`flex min-h-11 items-center gap-1.5 rounded-md text-sm font-medium uppercase tracking-wide text-[#8f8f8f] transition-colors hover:text-[#171717] focus-visible:outline-2 focus-visible:outline-[#0070f3] ${
                  collapsed ? "w-full justify-center" : ""
                }`}
                aria-expanded={projectsOpen}
                aria-label="Toggle projects"
              >
                <FaFolderOpen className="h-4 w-4" />
                {!collapsed && (
                  <>
                    Projects
                    <FiChevronDown
                      className={`h-4 w-4 transition-transform ${projectsOpen ? "rotate-180" : ""}`}
                    />
                  </>
                )}
              </button>
              {!collapsed && (
                <button
                  type="button"
                  onClick={() => setShowCreate(true)}
                  className="flex h-11 w-11 items-center justify-center rounded-md text-[#8f8f8f] transition-colors hover:bg-[#f2f2f2] hover:text-[#171717] focus-visible:outline-2 focus-visible:outline-[#0070f3]"
                  title="New project"
                >
                  <FiPlus className="h-4 w-4" />
                </button>
              )}
            </div>

            {projectsOpen && (
              <div className="relative mt-2 pl-3">
                {projects.length > 0 && (
                  <span
                    className="absolute bottom-5 left-[19px] top-2 w-px bg-[#ebebeb]"
                    aria-hidden="true"
                  />
                )}
                {projectsError && (
                  <p className="px-3 py-2 text-xs text-[#ee0000]">
                    {projectsError}
                  </p>
                )}
                {!projectsError && projects.length === 0 && (
                  <p className="px-3 py-2 text-xs text-[#8f8f8f]">
                    No projects yet
                  </p>
                )}
                {projects.map(({ project }) => {
                  const projectPath = `/projects/${project._id}`;
                  const isProjectActive =
                    location.pathname.startsWith(projectPath);
                  return (
                    <Link
                      key={project._id}
                      to={projectPath}
                      className={`group/project relative flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                        isProjectActive
                          ? "bg-[#f2f2f2] font-medium text-[#171717]"
                          : "text-[#4d4d4d] hover:bg-[#fafafa] hover:text-[#171717]"
                      }`}
                    >
                      <span className="flex min-w-0 flex-1 items-center gap-2 transition-transform duration-150 group-hover/project:translate-x-1">
                        <span
                          className={`relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-white text-[10px] font-semibold ${
                            isProjectActive
                              ? "bg-[#171717] text-white"
                              : "bg-[#f2f2f2] text-[#4d4d4d]"
                          }`}
                        >
                          {project.name.charAt(0).toUpperCase()}
                        </span>
                        <span className="truncate">{project.name}</span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          <button
            type="button"
            onClick={handleLogout}
            className={`mt-auto flex min-h-11 w-full cursor-pointer items-center gap-2.5 rounded-lg py-2 text-sm font-medium text-[#ee0000] transition-colors hover:bg-[#fef2f2] focus-visible:outline-2 focus-visible:outline-[#ee0000] ${
              collapsed ? "justify-center px-0" : "px-3"
            }`}
            title={collapsed ? "Sign out" : undefined}
          >
            <FiLogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </nav>
      </Motion.aside>

      {/* Create Project Modal */}
      {showCreate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[1px] p-4"
          onClick={(e) => e.target === e.currentTarget && setShowCreate(false)}
        >
          <div className="w-full max-w-md bg-white border border-[#ebebeb] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.10)] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#ebebeb]">
              <h2 className="text-sm font-semibold text-[#171717]">
                New Project
              </h2>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="p-1 rounded-md text-[#8f8f8f] hover:bg-[#f2f2f2] hover:text-[#171717] transition-colors"
                aria-label="Close create project dialog"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleCreateProject} className="p-5 space-y-4">
              {createError && (
                <p className="text-xs text-[#ee0000]">{createError}</p>
              )}
              <div>
                <label
                  htmlFor="new-proj-name"
                  className="block text-sm font-medium text-[#171717] mb-1.5"
                >
                  Project name
                </label>
                <input
                  id="new-proj-name"
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Backend API Redesign"
                  className="w-full h-9 px-3 text-sm bg-white border border-[#ebebeb] rounded-md text-[#171717] placeholder:text-[#a1a1a1] focus:outline-none focus:border-[#171717] transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor="new-proj-desc"
                  className="block text-sm font-medium text-[#171717] mb-1.5"
                >
                  Description{" "}
                  <span className="text-[#8f8f8f] font-normal">(optional)</span>
                </label>
                <textarea
                  id="new-proj-desc"
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="What is this project about?"
                  className="w-full px-3 py-2 text-sm bg-white border border-[#ebebeb] rounded-md text-[#171717] placeholder:text-[#a1a1a1] focus:outline-none focus:border-[#171717] transition-colors resize-none"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={creating || !newName.trim()}
                  className="inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium rounded-md bg-[#171717] text-white hover:bg-[#4d4d4d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {creating && (
                    <FiLoader className="h-3.5 w-3.5 animate-spin" />
                  )}
                  Create Project
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="inline-flex items-center h-8 px-3 text-sm font-medium rounded-md bg-white text-[#171717] border border-[#ebebeb] hover:bg-[#fafafa] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

const SidebarLink = ({ to, icon, label, active, collapsed }) => (
  <Link
    to={to}
    className={`group/sidebar flex min-h-11 w-full items-center gap-2.5 rounded-lg py-2 text-sm transition-colors ${
      collapsed ? "justify-center px-0" : "px-3"
    } ${
      active
        ? "bg-[#f2f2f2] font-medium text-[#171717]"
        : "text-[#4d4d4d] hover:bg-[#fafafa] hover:text-[#171717]"
    }`}
    title={collapsed ? label : undefined}
  >
    {icon && (
      <span className="h-5 w-5 shrink-0 text-[#8f8f8f] transition-transform duration-150 group-hover/sidebar:translate-x-1">
        {icon}
      </span>
    )}
    <Motion.span
      animate={{
        display: collapsed ? "none" : "inline-block",
        opacity: collapsed ? 0 : 1,
      }}
      transition={{ duration: 0.15 }}
      className="truncate whitespace-nowrap transition-transform duration-150 group-hover/sidebar:translate-x-1"
    >
      {label}
    </Motion.span>
  </Link>
);

export default Sidebar;
