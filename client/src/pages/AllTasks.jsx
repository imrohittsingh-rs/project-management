import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { BsArrowReturnRight } from "react-icons/bs";
import {
  FiAlertCircle,
  FiChevronDown,
  FiSearch,
  FiX,
} from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loadingspinner";
import { getProjects } from "../services/projectService";
import { getTasks } from "../services/taskService";

const STATUS_CONFIG = {
  todo: {
    label: "Todo",
    className: "bg-gray-500",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-orange-500",
  },
  done: {
    label: "Done",
    className: "bg-green-500",
  },
};

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All status" },
  { value: "todo", label: "Todo" },
  { value: "in_progress", label: "In progress" },
  { value: "done", label: "Done" },
];

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.todo;

  return (
    <span
      title={config.label}
      aria-label={config.label}
      className={`inline-block h-2 w-2 shrink-0 rounded-full ${config.className}`}
    />
  );
};

const getUserName = (user) =>
  user?.fullName || user?.username || "Unknown user";

const getUserInitials = (user) =>
  getUserName(user)
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const AllTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const statusMenuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isStatusMenuOpen &&
        !statusMenuRef.current?.contains(event.target)
      ) {
        setIsStatusMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isStatusMenuOpen]);

  useEffect(() => {
    let current = true;
    const loadTasks = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getProjects();
        const projects = (Array.isArray(response?.data) ? response.data : [])
          .map((entry) => entry?.project)
          .filter((project) => project?._id);
        const results = await Promise.allSettled(
          projects.map(async (project) => {
            const taskResponse = await getTasks(project._id);
            return (
              Array.isArray(taskResponse?.data) ? taskResponse.data : []
            ).map((task) => ({
              ...task,
              projectId: project._id,
              projectName: project.name,
            }));
          }),
        );
        if (current) {
          setTasks(
            results
              .filter((result) => result.status === "fulfilled")
              .flatMap((result) => result.value),
          );
          if (results.some((result) => result.status === "rejected")) {
            setError("Some project tasks could not be loaded.");
          }
        }
      } catch {
        if (current) setError("Unable to load tasks. Please try again.");
      } finally {
        if (current) setLoading(false);
      }
    };
    loadTasks();
    return () => {
      current = false;
    };
  }, []);

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tasks
      .filter((task) => {
        const matchesStatus =
          statusFilter === "all" || task.status === statusFilter;
        const assignee =
          task.assignedTo?.fullName || task.assignedTo?.username || "";
        const matchesSearch =
          !query ||
          `${task.title} ${task.description || ""} ${task.projectName} ${assignee}`
            .toLowerCase()
            .includes(query);
        return matchesStatus && matchesSearch;
      })
      .sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt || 0) -
          new Date(a.updatedAt || a.createdAt || 0),
      );
  }, [tasks, search, statusFilter]);

  const selectedStatus = STATUS_FILTER_OPTIONS.find(
    (option) => option.value === statusFilter,
  );

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-[#fafafa] md:flex-row">
      <Sidebar />
      <main className="min-w-0 flex-1 p-6 text-[#171717] sm:p-8">
        <div className="mx-auto max-w-[1180px]">
          <header>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.06em]">
              All Tasks
            </h1>
            <p className="mt-2 text-sm text-[#4d4d4d]">
              Tasks from every project you belong to.
            </p>
          </header>

          {error && (
            <p
              role="status"
              className="mt-6 flex items-center gap-2 rounded-md border border-[#ffefcf] bg-[#fffaf0] px-4 py-3 text-sm text-[#ab570a]"
            >
              <FiAlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </p>
          )}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">Search tasks or projects</span>
              <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8f8f8f]" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search tasks or projects..."
                className="h-10 w-full appearance-none rounded-xl border border-[#ebebeb] bg-white pl-9 pr-9 text-sm text-[#171717] placeholder:text-[#a1a1a1] transition-colors focus:border-[#171717] focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
              />
              {search && (
                <button
                  type="button"
                  aria-label="Clear task search"
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-[#171717] transition-colors hover:bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#171717]/20"
                >
                  <FiX className="h-4 w-4" />
                </button>
              )}
            </label>

            <label className="sr-only" htmlFor="task-status-filter">
              Filter by status
            </label>
            <div ref={statusMenuRef} className="relative">
              <button
                id="task-status-filter"
                type="button"
                aria-haspopup="listbox"
                aria-expanded={isStatusMenuOpen}
                onClick={() => setIsStatusMenuOpen((isOpen) => !isOpen)}
                className="flex h-10 min-w-36 items-center justify-between gap-3 rounded-xl border border-[#ebebeb] bg-white px-3 text-sm text-[#171717] transition-colors hover:border-[#d9d9d9] focus:border-[#171717] focus:outline-none"
              >
                <span className="flex items-center gap-2">
                  {statusFilter !== "all" && <StatusBadge status={statusFilter} />}
                  {selectedStatus?.label}
                </span>
                <FiChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isStatusMenuOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>
              {isStatusMenuOpen && (
                <div
                  role="listbox"
                  aria-label="Filter by status"
                  className="absolute right-0 z-10 mt-2 min-w-full overflow-hidden rounded-xl border border-[#ebebeb] bg-white p-1 shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
                >
                  {STATUS_FILTER_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={statusFilter === option.value}
                      onClick={() => {
                        setStatusFilter(option.value);
                        setIsStatusMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-[#171717] hover:bg-[#fafafa]"
                    >
                      {option.value === "all" ? (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-transparent" />
                      ) : (
                        <StatusBadge status={option.value} />
                      )}
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <section
            className="mt-5 overflow-hidden rounded-2xl border border-[#ebebeb] bg-white"
            aria-label="Tasks"
          >
            {loading ? (
              <Loader />
            ) : filteredTasks.length ? (
              <div className="divide-y divide-[#f2f2f2]">
                {filteredTasks.map((task) => (
                  <Link
                    key={`${task.projectId}-${task._id}`}
                    to={`/projects/${task.projectId}`}
                    className="flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-[#fafafa] sm:flex-row sm:items-center sm:px-5"
                  >
                    <div className="flex shrink-0 items-center gap-2 sm:w-36">
                      <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#171717] text-[10px] font-semibold text-white">
                        {task.assignedBy?.avatar?.url ? (
                          <img
                            src={task.assignedBy.avatar.url}
                            alt={`${getUserName(task.assignedBy)}'s profile`}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          getUserInitials(task.assignedBy)
                        )}
                      </div>
                      <span className="truncate text-xs text-[#4d4d4d]">
                        {getUserName(task.assignedBy)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {task.title}
                      </p>
                      <p className="mt-1 flex min-w-0 items-center gap-1 truncate text-xs text-[#8f8f8f]">
                        <BsArrowReturnRight
                          className="h-3.5 w-3.5 shrink-0"
                          aria-hidden="true"
                        />
                        <span className="truncate">
                          {task.projectName}
                          {task.assignedTo
                            ? ` · ${task.assignedTo.fullName || task.assignedTo.username}`
                            : ""}
                        </span>
                      </p>
                    </div>
                    <StatusBadge status={task.status} />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="px-4 py-12 text-center text-sm text-[#8f8f8f]">
                {tasks.length
                  ? "No tasks match these filters."
                  : "No tasks found in your projects yet."}
              </p>
            )}
          </section>
          {!loading && (
            <p className="mt-3 text-xs text-[#8f8f8f]">
              {filteredTasks.length}{" "}
              {filteredTasks.length === 1 ? "task" : "tasks"}
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default AllTasks;
