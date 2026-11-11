import {
  createElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  FiAlertCircle,
  FiChevronDown,
  FiPlus,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  createSubTask,
  updateSubTask,
  deleteSubTask,
  getTaskById,
} from "../../services/taskService";
import Loader from "../Loadingspinner";
import { ActionBtn, Input, Textarea } from "./shared";
import { STATUS_CONFIG } from "./sharedData";
import { FaTasks } from "react-icons/fa";
import { LuListTodo } from "react-icons/lu";
import { RiProgress5Line } from "react-icons/ri";
import { IoMdDoneAll } from "react-icons/io";
import toast from "../../utils/toast.js";

const TasksTab = ({ projectId, members, userRole }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedTask, setExpandedTask] = useState(null);
  // Cache of full task details (with subtasks) keyed by taskId
  const [taskDetails, setTaskDetails] = useState({});
  const [detailLoading, setDetailLoading] = useState({});
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [subTaskDrafts, setSubTaskDrafts] = useState({}); // taskId → title

  const canManage = ["admin", "project_admin"].includes(userRole);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getTasks(projectId);
      setTasks(Array.isArray(res?.data) ? res.data : []);
    } catch {
      setError("Unable to load tasks");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    let active = true;
    getTasks(projectId)
      .then((response) => {
        if (active)
          setTasks(Array.isArray(response?.data) ? response.data : []);
      })
      .catch(() => {
        if (active) setError("Unable to load tasks");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [projectId]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    const title = newTask.title.trim();
    if (title.length < 3) {
      setError("Task title must be at least 3 characters.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await createTask(projectId, {
        title,
        description: newTask.description.trim(),
        assignedTo: newTask.assignedTo || undefined,
      });
      setNewTask({ title: "", description: "", assignedTo: "" });
      setShowNewTask(false);
      await loadTasks();
      toast.success("Task created");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  // Fetch full task detail (with subtasks) when expanding
  const loadTaskDetail = useCallback(
    async (taskId, force = false) => {
      if (!force && taskDetails[taskId]) return; // already cached
      setDetailLoading((prev) => ({ ...prev, [taskId]: true }));
      try {
        const res = await getTaskById(projectId, taskId);
        const detail = res?.data;
        if (detail) {
          setTaskDetails((prev) => ({ ...prev, [taskId]: detail }));
        }
      } catch {
        // silently ignore; subtasks just won't show
      } finally {
        setDetailLoading((prev) => ({ ...prev, [taskId]: false }));
      }
    },
    [projectId, taskDetails],
  );

  const handleToggleExpand = (taskId) => {
    if (expandedTask === taskId) {
      setExpandedTask(null);
    } else {
      setExpandedTask(taskId);
      loadTaskDetail(taskId);
    }
  };

  // Must send full payload because backend uses createTaskValidator (title required)
  const handleStatusChange = async (task, status) => {
    try {
      await updateTask(projectId, task._id, {
        title: task.title,
        description: task.description || "",
        assignedTo: task.assignedTo?._id || task.assignedTo || undefined,
        status,
      });
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, status } : t)),
      );
    } catch {
      toast.error("Failed to update task status");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteTask(projectId, taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      toast.success("Task deleted");
      setTaskDetails((prev) => {
        const n = { ...prev };
        delete n[taskId];
        return n;
      });
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const handleCreateSubTask = async (taskId) => {
    const title = (subTaskDrafts[taskId] || "").trim();
    if (!title) return;
    try {
      await createSubTask(projectId, taskId, { title });
      setSubTaskDrafts((prev) => ({ ...prev, [taskId]: "" }));
      // Invalidate cached detail so it reloads with new subtask
      setTaskDetails((prev) => {
        const n = { ...prev };
        delete n[taskId];
        return n;
      });
      await loadTaskDetail(taskId, true);
      toast.success("Subtask created");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create subtask");
    }
  };

  const handleToggleSubTask = async (taskId, subTask) => {
    try {
      await updateSubTask(projectId, subTask._id, {
        isCompleted: !subTask.isCompleted,
      });
      // Optimistically update the detail cache (field is 'subtasks' from getTaskById)
      setTaskDetails((prev) => ({
        ...prev,
        [taskId]: {
          ...prev[taskId],
          subtasks: prev[taskId]?.subtasks?.map((st) =>
            st._id === subTask._id
              ? { ...st, isCompleted: !st.isCompleted }
              : st,
          ),
        },
      }));
      toast.success(subTask.isCompleted ? "Subtask reopened" : "Subtask completed");
    } catch {
      toast.error("Failed to update subtask");
    }
  };

  const handleDeleteSubTask = async (taskId, subTaskId) => {
    try {
      await deleteSubTask(projectId, subTaskId);
      setTaskDetails((prev) => ({
        ...prev,
        [taskId]: {
          ...prev[taskId],
          subtasks: prev[taskId]?.subtasks?.filter(
            (st) => st._id !== subTaskId,
          ),
        },
      }));
      toast.success("Subtask deleted");
    } catch {
      toast.error("Failed to delete subtask");
    }
  };

  const stats = useMemo(
    () => ({
      total: tasks.length,
      done: tasks.filter((t) => t.status === "done").length,
      inProgress: tasks.filter((t) => t.status === "in_progress").length,
      todo: tasks.filter((t) => t.status === "todo").length,
    }),
    [tasks],
  );

  const statCards = [
    {
      label: "Total",
      value: stats.total,
      pill: "All tasks",
      pillCls: "bg-[#eef5ff] text-[#2672d8]",
      Icon: FaTasks,
    },
    {
      label: "Todo",
      value: stats.todo,
      pill: "Not started",
      pillCls: "bg-[#f2f2f2] text-[#4d4d4d]",
      Icon: LuListTodo,
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      pill: "Active work",
      pillCls: "bg-[#fff3e0] text-[#ab570a]",
      Icon: RiProgress5Line,
    },
    {
      label: "Done",
      value: stats.done,
      pill: "Completed",
      pillCls: "bg-[#d9f7ec] text-[#13795b]",
      Icon: IoMdDoneAll,
    },
  ];

  if (loading) return <Loader />;

  return (
    <div>
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-md border border-[#fecaca] bg-[#fff5f5] px-3 py-2 text-xs text-[#c50000]">
          <FiAlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </div>
      )}

      {/* Stats row */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ label, value, pill, pillCls, Icon }) => (
          <div
            key={label}
            className="min-h-[164px] rounded-2xl border border-[#ebebeb] bg-white px-6 py-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] sm:px-7 sm:py-6"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-[#8f9db2]">
              {label}
            </p>
            <strong className="mt-3 block text-3xl font-semibold leading-none tracking-tight text-[#171717]">
              {value}
            </strong>
            <span
              className={`mt-6 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${pillCls}`}
            >
              {createElement(Icon, {
                className: "h-3.5 w-3.5",
                "aria-hidden": true,
              })}
              {pill}
            </span>
          </div>
        ))}
      </div>

      {/* New task button */}
      {canManage && (
        <div className="mb-4">
          {!showNewTask ? (
            <ActionBtn onClick={() => setShowNewTask(true)}>
              <FiPlus className="h-3.5 w-3.5" />
              New Task
            </ActionBtn>
          ) : (
            <form
              onSubmit={handleCreateTask}
              className="rounded-md border border-[#ebebeb] bg-white p-4 space-y-3"
            >
              <p className="text-sm font-semibold text-[#171717]">New Task</p>
              <Input
                id="new-task-title"
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask((p) => ({ ...p, title: e.target.value }))
                }
                required
              />
              <Textarea
                id="new-task-desc"
                placeholder="Description (optional)"
                rows={2}
                value={newTask.description}
                onChange={(e) =>
                  setNewTask((p) => ({ ...p, description: e.target.value }))
                }
              />
              <div>
                <label
                  htmlFor="new-task-assignee"
                  className="block text-sm font-medium text-[#171717] mb-1.5"
                >
                  Assign to
                </label>
                <select
                  id="new-task-assignee"
                  value={newTask.assignedTo}
                  onChange={(e) =>
                    setNewTask((p) => ({ ...p, assignedTo: e.target.value }))
                  }
                  className="w-full h-9 px-3 text-sm bg-white border border-[#ebebeb] rounded-md text-[#171717] focus:outline-none focus:border-[#171717] transition-colors"
                >
                  <option value="">Unassigned</option>
                  {members.map((m) => (
                    <option key={m.user._id} value={m.user._id}>
                      {m.user.fullName || m.user.username}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-1">
                <ActionBtn type="submit" loading={submitting}>
                  Create
                </ActionBtn>
                <ActionBtn
                  variant="secondary"
                  onClick={() => setShowNewTask(false)}
                >
                  Cancel
                </ActionBtn>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Task list */}
      {tasks.length === 0 ? (
        <div className="rounded-[6px] border border-[#ebebeb] bg-white px-4 py-10 text-center">
          <p className="text-sm font-medium text-[#171717]">No tasks yet</p>
          <p className="mt-1 text-xs text-[#8f8f8f]">
            {canManage
              ? "Create the first task to get started."
              : "Tasks will appear here once created."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => {
            const isExpanded = expandedTask === task._id;
            const cfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.todo;
            const assignee = task.assignedTo;
            const taskOwner =
              task.assignedBy?.fullName ||
              task.assignedBy?.username ||
              assignee?.fullName ||
              assignee?.username;
            // Subtasks come from the detail cache (getTaskById aggregation)
            const detail = taskDetails[task._id];
            const subtasks = detail?.subtasks ?? [];
            const isDetailLoading = detailLoading[task._id];

            return (
              <div
                key={task._id}
                className="rounded-[14px] border border-[#ebebeb] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-shadow"
              >
                {/* Task header row */}
                <div className="flex items-center gap-3 px-4 py-4 sm:px-5 sm:py-[18px]">
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${cfg.dot}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[#171717]">
                      {task.title}
                    </p>
                    {taskOwner && (
                      <p className="mt-0.5 text-xs text-[#8f8f8f]">
                        {taskOwner}
                      </p>
                    )}
                  </div>

                  {/* Status selector */}
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task, e.target.value)}
                    disabled={!canManage}
                    className={`h-7 rounded-lg border-0 px-2.5 text-xs font-medium focus:outline-none disabled:cursor-default ${cfg.badge}`}
                    aria-label={`Status for ${task.title}`}
                  >
                    {Object.entries(STATUS_CONFIG).map(([val, { label }]) => (
                      <option key={val} value={val}>
                        {label}
                      </option>
                    ))}
                  </select>

                  {/* Expand button */}
                  <button
                    type="button"
                    onClick={() => handleToggleExpand(task._id)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#8f8f8f] transition-colors hover:bg-[#f2f2f2] hover:text-[#171717]"
                    aria-expanded={isExpanded}
                    aria-label={`${isExpanded ? "Collapse" : "Expand"} ${task.title}`}
                  >
                    <FiChevronDown
                      className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </button>

                  {canManage && (
                    <button
                      type="button"
                      onClick={() => handleDeleteTask(task._id)}
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-[#ffdada] text-[#ff2d3d] transition-colors hover:bg-[#fff5f5] hover:border-[#ffb8b8] cursor-pointer"
                      aria-label={`Delete ${task.title}`}
                    >
                      <FaTrash className="h-3 w-3" />
                    </button>
                  )}
                </div>

                {/* Expanded: description + subtasks */}
                {isExpanded && (
                  <div className="border-t border-[#f2f2f2] px-4 pb-5 pt-4 sm:px-5">
                    {task.description && (
                      <p className="mb-4 text-sm leading-5 text-[#4d4d4d]">
                        {task.description}
                      </p>
                    )}

                    <p className="mb-3 inline-flex rounded bg-[#f2f2f2] px-3 py-1 text-xs font-medium text-[#4d4d4d]">
                      Subtasks
                    </p>

                    {isDetailLoading ? (
                      <p className="mb-3 text-xs text-[#8f8f8f]">Loading...</p>
                    ) : subtasks.length > 0 ? (
                      <div className="mb-4 space-y-2">
                        {subtasks.map((st) => (
                          <div
                            key={st._id}
                            className="flex min-h-7 items-center gap-2"
                          >
                            <button
                              type="button"
                              onClick={() => handleToggleSubTask(task._id, st)}
                              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border transition-colors ${
                                st.isCompleted
                                  ? "bg-[#171717] border-[#171717]"
                                  : "border-[#d7d7d7] hover:border-[#171717]"
                              }`}
                            >
                              {st.isCompleted && (
                                <FiCheck className="h-2.5 w-2.5 text-white" />
                              )}
                            </button>
                            <span
                              className={`flex-1 text-xs ${st.isCompleted ? "text-[#8f8f8f] line-through" : "text-[#4d4d4d]"}`}
                            >
                              {st.title}
                            </span>
                            {canManage && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteSubTask(task._id, st._id)
                                }
                                className="p-0.5 text-[#a1a1a1] hover:text-[#ee0000] transition-colors"
                              >
                                <FiX className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mb-4 text-sm text-[#8f8f8f]">No subtasks</p>
                    )}

                    {canManage && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add subtask..."
                          value={subTaskDrafts[task._id] || ""}
                          onChange={(e) =>
                            setSubTaskDrafts((prev) => ({
                              ...prev,
                              [task._id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleCreateSubTask(task._id)
                          }
                          className="h-9 min-w-0 flex-1 rounded-[6px] border border-[#ebebeb] bg-white px-3 text-sm text-[#171717] placeholder:text-[#a1a1a1] transition-colors focus:border-[#171717] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleCreateSubTask(task._id)}
                          className="h-9 rounded-[6px] bg-[#171717] px-3 text-sm font-medium text-white transition-colors hover:bg-[#4d4d4d] focus:outline-none focus:ring-2 focus:ring-[#d3e5ff] focus:ring-offset-1"
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TasksTab;
