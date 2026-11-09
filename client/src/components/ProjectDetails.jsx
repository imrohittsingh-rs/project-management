import { createElement, useCallback, useEffect, useMemo, useState } from 'react'
import {
  FiAlertCircle,
  FiBarChart2,
  FiChevronDown,
  FiCheckSquare,
  FiEdit2,
  FiLoader,
  FiPlus,
  FiSettings,
  FiTrash2,
  FiUsers,
  FiFileText,
  FiX,
  FiCheck,
  FiArrowLeft,
} from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  getProjectById,
  getProjectMembers,
  addMemberToProject,
  updateMemberRole,
  deleteMember,
  deleteProject,
  updateProject,
} from '../services/projectService'
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  createSubTask,
  updateSubTask,
  deleteSubTask,
  getTaskById,
} from '../services/taskService'
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from '../services/noteService'
import Loader from './Loadingspinner'

/* ─── Constants ──────────────────────────────────────────────────── */
const TABS = [
  { label: 'Tasks', icon: FiCheckSquare },
  { label: 'Members', icon: FiUsers },
  { label: 'Notes', icon: FiFileText },
  { label: 'Settings', icon: FiSettings },
]

const STATUS_CONFIG = {
  todo:        { label: 'Todo',        dot: 'bg-[#8f8f8f]', badge: 'bg-[#f2f2f2] text-[#4d4d4d]' },
  in_progress: { label: 'In Progress', dot: 'bg-[#ab570a]', badge: 'bg-[#fff3e0] text-[#ab570a]' },
  done:        { label: 'Done',        dot: 'bg-[#13795b]', badge: 'bg-[#d9f7ec] text-[#13795b]' },
}

const ROLE_CONFIG = {
  admin:         { label: 'Admin',         badge: 'bg-[#171717] text-white' },
  project_admin: { label: 'Project Admin', badge: 'bg-[#dbeeff] text-[#1554a6]' },
  member:        { label: 'Member',        badge: 'bg-[#f2f2f2] text-[#4d4d4d]' },
}

/* ─── Helpers ────────────────────────────────────────────────────── */
const initials = (name = '') => {
  const parts = name.trim().split(' ')
  return parts.length > 1
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase()
}

/* ─── Sub-components ─────────────────────────────────────────────── */

// Inline modal backdrop
const Modal = ({ title, onClose, children }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[1px] p-4"
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div className="w-full max-w-md bg-white border border-[#ebebeb] rounded-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.10)] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#ebebeb]">
        <h2 className="text-sm font-semibold text-[#171717]">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-[6px] text-[#8f8f8f] hover:bg-[#f2f2f2] hover:text-[#171717] transition-colors"
        >
          <FiX className="h-4 w-4" />
        </button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  </div>
)

// Shared form input
const Input = ({ label, id, error, ...props }) => (
  <div>
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-[#171717] mb-1.5">
        {label}
      </label>
    )}
    <input
      id={id}
      className={`w-full h-9 px-3 text-sm bg-white border ${error ? 'border-[#ee0000]' : 'border-[#ebebeb]'} rounded-[6px] text-[#171717] placeholder:text-[#a1a1a1] focus:outline-none focus:border-[#171717] transition-colors`}
      {...props}
    />
    {error && <p className="mt-1 text-xs text-[#ee0000]">{error}</p>}
  </div>
)

const Textarea = ({ label, id, error, ...props }) => (
  <div>
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-[#171717] mb-1.5">
        {label}
      </label>
    )}
    <textarea
      id={id}
      className={`w-full px-3 py-2 text-sm bg-white border ${error ? 'border-[#ee0000]' : 'border-[#ebebeb]'} rounded-[6px] text-[#171717] placeholder:text-[#a1a1a1] focus:outline-none focus:border-[#171717] transition-colors resize-none`}
      {...props}
    />
    {error && <p className="mt-1 text-xs text-[#ee0000]">{error}</p>}
  </div>
)

const ActionBtn = ({ onClick, disabled, loading, children, variant = 'primary', className = '' }) => {
  const base = 'inline-flex items-center justify-center gap-1.5 h-8 px-3 text-sm font-medium rounded-[6px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-[#171717] text-white hover:bg-[#4d4d4d]',
    secondary: 'bg-white text-[#171717] border border-[#ebebeb] hover:bg-[#fafafa]',
    danger: 'bg-white text-[#ee0000] border border-[#fecaca] hover:bg-[#fff5f5]',
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {loading && <FiLoader className="h-3.5 w-3.5 animate-spin" />}
      {children}
    </button>
  )
}

/* ─── Tasks Tab ──────────────────────────────────────────────────── */
const TasksTab = ({ projectId, members, userRole }) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedTask, setExpandedTask] = useState(null)
  // Cache of full task details (with subtasks) keyed by taskId
  const [taskDetails, setTaskDetails] = useState({})
  const [detailLoading, setDetailLoading] = useState({})
  const [showNewTask, setShowNewTask] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '' })
  const [submitting, setSubmitting] = useState(false)
  const [subTaskDrafts, setSubTaskDrafts] = useState({}) // taskId → title

  const canManage = ['admin', 'project_admin'].includes(userRole)

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true)
      const res = await getTasks(projectId)
      setTasks(Array.isArray(res?.data) ? res.data : [])
    } catch {
      setError('Unable to load tasks')
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => { loadTasks() }, [loadTasks])

  const handleCreateTask = async (e) => {
    e.preventDefault()
    if (!newTask.title.trim()) return
    setSubmitting(true)
    try {
      await createTask(projectId, {
        title: newTask.title.trim(),
        description: newTask.description.trim(),
        assignedTo: newTask.assignedTo || undefined,
      })
      setNewTask({ title: '', description: '', assignedTo: '' })
      setShowNewTask(false)
      await loadTasks()
    } catch {
      setError('Failed to create task')
    } finally {
      setSubmitting(false)
    }
  }

  // Fetch full task detail (with subtasks) when expanding
  const loadTaskDetail = useCallback(async (taskId) => {
    if (taskDetails[taskId]) return // already cached
    setDetailLoading((prev) => ({ ...prev, [taskId]: true }))
    try {
      const res = await getTaskById(projectId, taskId)
      const detail = res?.data
      if (detail) {
        setTaskDetails((prev) => ({ ...prev, [taskId]: detail }))
      }
    } catch {
      // silently ignore; subtasks just won't show
    } finally {
      setDetailLoading((prev) => ({ ...prev, [taskId]: false }))
    }
  }, [projectId, taskDetails])

  const handleToggleExpand = (taskId) => {
    if (expandedTask === taskId) {
      setExpandedTask(null)
    } else {
      setExpandedTask(taskId)
      loadTaskDetail(taskId)
    }
  }

  // Must send full payload because backend uses createTaskValidator (title required)
  const handleStatusChange = async (task, status) => {
    try {
      await updateTask(projectId, task._id, {
        title: task.title,
        description: task.description || '',
        assignedTo: task.assignedTo?._id || task.assignedTo || undefined,
        status,
      })
      setTasks((prev) => prev.map((t) => (t._id === task._id ? { ...t, status } : t)))
    } catch {
      setError('Failed to update status')
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return
    try {
      await deleteTask(projectId, taskId)
      setTasks((prev) => prev.filter((t) => t._id !== taskId))
      setTaskDetails((prev) => { const n = { ...prev }; delete n[taskId]; return n })
    } catch {
      setError('Failed to delete task')
    }
  }

  const handleCreateSubTask = async (taskId) => {
    const title = (subTaskDrafts[taskId] || '').trim()
    if (!title) return
    try {
      await createSubTask(projectId, taskId, { title })
      setSubTaskDrafts((prev) => ({ ...prev, [taskId]: '' }))
      // Invalidate cached detail so it reloads with new subtask
      setTaskDetails((prev) => { const n = { ...prev }; delete n[taskId]; return n })
      await loadTaskDetail(taskId)
    } catch {
      setError('Failed to create subtask')
    }
  }

  const handleToggleSubTask = async (taskId, subTask) => {
    try {
      await updateSubTask(projectId, subTask._id, { isCompleted: !subTask.isCompleted })
      // Optimistically update the detail cache (field is 'subtasks' from getTaskById)
      setTaskDetails((prev) => ({
        ...prev,
        [taskId]: {
          ...prev[taskId],
          subtasks: prev[taskId]?.subtasks?.map((st) =>
            st._id === subTask._id ? { ...st, isCompleted: !st.isCompleted } : st
          ),
        },
      }))
    } catch {
      setError('Failed to update subtask')
    }
  }

  const handleDeleteSubTask = async (taskId, subTaskId) => {
    try {
      await deleteSubTask(projectId, subTaskId)
      setTaskDetails((prev) => ({
        ...prev,
        [taskId]: {
          ...prev[taskId],
          subtasks: prev[taskId]?.subtasks?.filter((st) => st._id !== subTaskId),
        },
      }))
    } catch {
      setError('Failed to delete subtask')
    }
  }

  const stats = useMemo(() => ({
    total: tasks.length,
    done: tasks.filter((t) => t.status === 'done').length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    todo: tasks.filter((t) => t.status === 'todo').length,
  }), [tasks])

  if (loading) return <Loader />

  return (
    <div>
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-[6px] border border-[#fecaca] bg-[#fff5f5] px-3 py-2 text-xs text-[#c50000]">
          <FiAlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </div>
      )}

      {/* Stats row */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total', value: stats.total },
          { label: 'Todo', value: stats.todo },
          { label: 'In Progress', value: stats.inProgress, cls: 'text-[#ab570a]' },
          { label: 'Done', value: stats.done, cls: 'text-[#13795b]' },
        ].map(({ label, value, cls = 'text-[#171717]' }) => (
          <div key={label} className="rounded-[6px] border border-[#ebebeb] bg-white px-4 py-3">
            <p className="text-xs text-[#8f8f8f]">{label}</p>
            <strong className={`mt-1 block text-xl font-semibold tracking-tight ${cls}`}>{value}</strong>
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
            <form onSubmit={handleCreateTask} className="rounded-[6px] border border-[#ebebeb] bg-white p-4 space-y-3">
              <p className="text-sm font-semibold text-[#171717]">New Task</p>
              <Input
                id="new-task-title"
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask((p) => ({ ...p, title: e.target.value }))}
                required
              />
              <Textarea
                id="new-task-desc"
                placeholder="Description (optional)"
                rows={2}
                value={newTask.description}
                onChange={(e) => setNewTask((p) => ({ ...p, description: e.target.value }))}
              />
              <div>
                <label htmlFor="new-task-assignee" className="block text-sm font-medium text-[#171717] mb-1.5">
                  Assign to
                </label>
                <select
                  id="new-task-assignee"
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask((p) => ({ ...p, assignedTo: e.target.value }))}
                  className="w-full h-9 px-3 text-sm bg-white border border-[#ebebeb] rounded-[6px] text-[#171717] focus:outline-none focus:border-[#171717] transition-colors"
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
                <ActionBtn type="submit" loading={submitting}>Create</ActionBtn>
                <ActionBtn variant="secondary" onClick={() => setShowNewTask(false)}>Cancel</ActionBtn>
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
            {canManage ? 'Create the first task to get started.' : 'Tasks will appear here once created.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => {
            const isExpanded = expandedTask === task._id
            const cfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.todo
            const assignee = task.assignedTo
            // Subtasks come from the detail cache (getTaskById aggregation)
            const detail = taskDetails[task._id]
            const subtasks = detail?.subtasks ?? []
            const isDetailLoading = detailLoading[task._id]

            return (
              <div key={task._id} className="rounded-[6px] border border-[#ebebeb] bg-white">
                {/* Task header row */}
                <div className="flex items-center gap-3 px-4 py-3">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${cfg.dot}`} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[#171717]">{task.title}</p>
                    {assignee && (
                      <p className="mt-0.5 text-xs text-[#8f8f8f]">
                        {assignee.fullName || assignee.username}
                      </p>
                    )}
                  </div>

                  {/* Status selector */}
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task, e.target.value)}
                    className={`h-6 rounded-[4px] border-0 text-[11px] font-medium px-1.5 focus:outline-none ${cfg.badge}`}
                    aria-label={`Status for ${task.title}`}
                  >
                    {Object.entries(STATUS_CONFIG).map(([val, { label }]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>

                  {/* Expand button */}
                  <button
                    type="button"
                    onClick={() => handleToggleExpand(task._id)}
                    className="p-1 text-[#8f8f8f] hover:text-[#171717] rounded-[4px] transition-colors"
                    aria-expanded={isExpanded}
                  >
                    <FiChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {canManage && (
                    <button
                      type="button"
                      onClick={() => handleDeleteTask(task._id)}
                      className="p-1 text-[#8f8f8f] hover:text-[#ee0000] rounded-[4px] transition-colors"
                    >
                      <FiTrash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Expanded: description + subtasks */}
                {isExpanded && (
                  <div className="border-t border-[#f2f2f2] px-4 pb-4 pt-3">
                    {task.description && (
                      <p className="mb-3 text-xs text-[#4d4d4d] leading-relaxed">{task.description}</p>
                    )}

                    <p className="mb-2 font-mono text-[10px] uppercase tracking-wide text-[#8f8f8f]">Subtasks</p>

                    {isDetailLoading ? (
                      <p className="mb-3 text-xs text-[#8f8f8f]">Loading...</p>
                    ) : subtasks.length > 0 ? (
                      <div className="space-y-1 mb-3">
                        {subtasks.map((st) => (
                          <div key={st._id} className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleToggleSubTask(task._id, st)}
                              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border transition-colors ${
                                st.isCompleted
                                  ? 'bg-[#171717] border-[#171717]'
                                  : 'border-[#d7d7d7] hover:border-[#171717]'
                              }`}
                            >
                              {st.isCompleted && <FiCheck className="h-2.5 w-2.5 text-white" />}
                            </button>
                            <span className={`flex-1 text-xs ${st.isCompleted ? 'text-[#8f8f8f] line-through' : 'text-[#4d4d4d]'}`}>
                              {st.title}
                            </span>
                            {canManage && (
                              <button
                                type="button"
                                onClick={() => handleDeleteSubTask(task._id, st._id)}
                                className="p-0.5 text-[#a1a1a1] hover:text-[#ee0000] transition-colors"
                              >
                                <FiX className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mb-3 text-xs text-[#8f8f8f]">No subtasks</p>
                    )}

                    {canManage && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add subtask..."
                          value={subTaskDrafts[task._id] || ''}
                          onChange={(e) =>
                            setSubTaskDrafts((prev) => ({ ...prev, [task._id]: e.target.value }))
                          }
                          onKeyDown={(e) => e.key === 'Enter' && handleCreateSubTask(task._id)}
                          className="h-7 flex-1 rounded-[4px] border border-[#ebebeb] px-2 text-xs text-[#171717] placeholder:text-[#a1a1a1] focus:outline-none focus:border-[#171717] transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => handleCreateSubTask(task._id)}
                          className="h-7 px-2.5 text-xs font-medium rounded-[4px] bg-[#171717] text-white hover:bg-[#4d4d4d] transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ─── Members Tab ────────────────────────────────────────────────── */
const MembersTab = ({ projectId, userRole }) => {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [addEmail, setAddEmail] = useState('')
  const [addRole, setAddRole] = useState('member')
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState('')

  const isAdmin = userRole === 'admin'

  const loadMembers = useCallback(async () => {
    try {
      const res = await getProjectMembers(projectId)
      setMembers(Array.isArray(res?.data) ? res.data : [])
    } catch {
      setError('Unable to load members')
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => { loadMembers() }, [loadMembers])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!addEmail.trim()) return
    setAdding(true)
    setAddError('')
    try {
      await addMemberToProject(projectId, { email: addEmail.trim().toLowerCase(), role: addRole })
      setAddEmail('')
      setAddRole('member')
      setShowAdd(false)
      await loadMembers()
    } catch (err) {
      setAddError(err?.response?.data?.message || 'Failed to add member')
    } finally {
      setAdding(false)
    }
  }

  const handleRoleChange = async (userId, role) => {
    try {
      await updateMemberRole(projectId, userId, { role })
      setMembers((prev) => prev.map((m) => (m.user._id === userId ? { ...m, role } : m)))
    } catch {
      setError('Failed to update role')
    }
  }

  const handleRemove = async (userId) => {
    if (!window.confirm('Remove this member from the project?')) return
    try {
      await deleteMember(projectId, userId)
      setMembers((prev) => prev.filter((m) => m.user._id !== userId))
    } catch {
      setError('Failed to remove member')
    }
  }

  if (loading) return <Loader />

  return (
    <div>
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-[6px] border border-[#fecaca] bg-[#fff5f5] px-3 py-2 text-xs text-[#c50000]">
          <FiAlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </div>
      )}

      {isAdmin && (
        <div className="mb-4">
          {!showAdd ? (
            <ActionBtn onClick={() => setShowAdd(true)}>
              <FiPlus className="h-3.5 w-3.5" />
              Add Member
            </ActionBtn>
          ) : (
            <form onSubmit={handleAdd} className="rounded-[6px] border border-[#ebebeb] bg-white p-4 space-y-3">
              <p className="text-sm font-semibold text-[#171717]">Add Member</p>
              {addError && <p className="text-xs text-[#ee0000]">{addError}</p>}
              <Input
                id="add-member-email"
                label="Email address"
                type="email"
                placeholder="jane@company.com"
                value={addEmail}
                onChange={(e) => setAddEmail(e.target.value)}
                required
              />
              <div>
                <label htmlFor="add-member-role" className="block text-sm font-medium text-[#171717] mb-1.5">
                  Role
                </label>
                <select
                  id="add-member-role"
                  value={addRole}
                  onChange={(e) => setAddRole(e.target.value)}
                  className="w-full h-9 px-3 text-sm bg-white border border-[#ebebeb] rounded-[6px] text-[#171717] focus:outline-none focus:border-[#171717] transition-colors"
                >
                  <option value="member">Member</option>
                  <option value="project_admin">Project Admin</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-2 pt-1">
                <ActionBtn type="submit" loading={adding}>Add</ActionBtn>
                <ActionBtn variant="secondary" onClick={() => setShowAdd(false)}>Cancel</ActionBtn>
              </div>
            </form>
          )}
        </div>
      )}

      <div className="rounded-[6px] border border-[#ebebeb] bg-white overflow-hidden">
        {members.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-[#8f8f8f]">No members found.</p>
        ) : (
          <div className="divide-y divide-[#f2f2f2]">
            {members.map((m) => {
              const roleCfg = ROLE_CONFIG[m.role] || ROLE_CONFIG.member
              const user = m.user
              return (
                <div key={m._id} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#171717] text-xs font-semibold text-white">
                    {initials(user.fullName || user.username)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#171717] truncate">
                      {user.fullName || user.username}
                    </p>
                    <p className="text-xs text-[#8f8f8f] truncate">{user.email}</p>
                  </div>

                  {isAdmin ? (
                    <select
                      value={m.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="h-6 rounded-[4px] border border-[#ebebeb] bg-white px-2 text-[11px] text-[#4d4d4d] focus:outline-none"
                    >
                      <option value="member">Member</option>
                      <option value="project_admin">Project Admin</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span className={`rounded-[4px] px-2 py-0.5 text-[11px] font-medium ${roleCfg.badge}`}>
                      {roleCfg.label}
                    </span>
                  )}

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleRemove(user._id)}
                      className="p-1 text-[#a1a1a1] hover:text-[#ee0000] rounded-[4px] transition-colors"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Notes Tab ──────────────────────────────────────────────────── */
const NotesTab = ({ projectId, userRole }) => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingNote, setEditingNote] = useState(null) // null | { _id, content } | 'new'
  const [draft, setDraft] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isAdmin = userRole === 'admin'

  const loadNotes = useCallback(async () => {
    try {
      const res = await getNotes(projectId)
      setNotes(Array.isArray(res?.data) ? res.data : [])
    } catch {
      setError('Unable to load notes')
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => { loadNotes() }, [loadNotes])

  const handleSave = async () => {
    if (!draft.trim()) return
    setSubmitting(true)
    try {
      if (editingNote === 'new') {
        await createNote(projectId, { content: draft.trim() })
      } else {
        await updateNote(projectId, editingNote._id, { content: draft.trim() })
      }
      setEditingNote(null)
      setDraft('')
      await loadNotes()
    } catch {
      setError('Failed to save note')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (noteId) => {
    if (!window.confirm('Delete this note?')) return
    try {
      await deleteNote(projectId, noteId)
      setNotes((prev) => prev.filter((n) => n._id !== noteId))
    } catch {
      setError('Failed to delete note')
    }
  }

  if (loading) return <Loader />

  return (
    <div>
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-[6px] border border-[#fecaca] bg-[#fff5f5] px-3 py-2 text-xs text-[#c50000]">
          <FiAlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </div>
      )}

      {isAdmin && editingNote === null && (
        <div className="mb-4">
          <ActionBtn onClick={() => { setEditingNote('new'); setDraft('') }}>
            <FiPlus className="h-3.5 w-3.5" />
            New Note
          </ActionBtn>
        </div>
      )}

      {/* Edit/Create form */}
      {editingNote !== null && (
        <div className="mb-4 rounded-[6px] border border-[#ebebeb] bg-white p-4 space-y-3">
          <p className="text-sm font-semibold text-[#171717]">
            {editingNote === 'new' ? 'New Note' : 'Edit Note'}
          </p>
          <Textarea
            id="note-draft"
            placeholder="Write your note..."
            rows={5}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <div className="flex gap-2">
            <ActionBtn loading={submitting} onClick={handleSave}>Save</ActionBtn>
            <ActionBtn variant="secondary" onClick={() => { setEditingNote(null); setDraft('') }}>
              Cancel
            </ActionBtn>
          </div>
        </div>
      )}

      {notes.length === 0 && editingNote === null ? (
        <div className="rounded-[6px] border border-[#ebebeb] bg-white px-4 py-10 text-center">
          <p className="text-sm font-medium text-[#171717]">No notes yet</p>
          <p className="mt-1 text-xs text-[#8f8f8f]">
            {isAdmin ? 'Add the first project note.' : 'Notes will appear here once created by an admin.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div key={note._id} className="rounded-[6px] border border-[#ebebeb] bg-white p-4">
              <p className="text-sm text-[#4d4d4d] leading-relaxed whitespace-pre-wrap">{note.content}</p>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-[#8f8f8f]">
                  {note.createdBy?.fullName || note.createdBy?.username}
                  {note.updatedAt && note.updatedAt !== note.createdAt && ' · edited'}
                </p>
                {isAdmin && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => { setEditingNote(note); setDraft(note.content) }}
                      className="p-1 text-[#8f8f8f] hover:text-[#171717] rounded-[4px] transition-colors"
                    >
                      <FiEdit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(note._id)}
                      className="p-1 text-[#8f8f8f] hover:text-[#ee0000] rounded-[4px] transition-colors"
                    >
                      <FiTrash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Settings Tab ───────────────────────────────────────────────── */
const SettingsTab = ({ project, userRole, onProjectDeleted, onProjectUpdated }) => {
  const [name, setName] = useState(project?.name || '')
  const [description, setDescription] = useState(project?.description || '')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const isAdmin = userRole === 'admin'

  const handleSave = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const res = await updateProject(project._id, { name: name.trim(), description: description.trim() })
      setSuccess('Project updated successfully.')
      onProjectUpdated(res?.data)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update project')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(`Delete project "${project.name}"? This cannot be undone.`)) return
    setDeleting(true)
    try {
      await deleteProject(project._id)
      onProjectDeleted()
    } catch {
      setError('Failed to delete project')
      setDeleting(false)
    }
  }

  if (!isAdmin) {
    return (
      <div className="rounded-[6px] border border-[#ebebeb] bg-white px-4 py-8 text-center">
        <FiSettings className="mx-auto mb-2 h-5 w-5 text-[#8f8f8f]" />
        <p className="text-sm text-[#8f8f8f]">Only project admins can access settings.</p>
      </div>
    )
  }

  return (
    <div className="max-w-xl space-y-6">
      {/* Edit project */}
      <div className="rounded-[6px] border border-[#ebebeb] bg-white p-5">
        <h3 className="mb-4 text-sm font-semibold text-[#171717]">Project Details</h3>
        {error && <p className="mb-3 text-xs text-[#ee0000]">{error}</p>}
        {success && <p className="mb-3 text-xs text-[#13795b]">{success}</p>}
        <form onSubmit={handleSave} className="space-y-3">
          <Input
            id="settings-name"
            label="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Textarea
            id="settings-desc"
            label="Description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short project description..."
          />
          <ActionBtn type="submit" loading={saving}>
            Save Changes
          </ActionBtn>
        </form>
      </div>

      {/* Danger zone */}
      <div className="rounded-[6px] border border-[#fecaca] bg-white p-5">
        <h3 className="mb-1 text-sm font-semibold text-[#171717]">Danger Zone</h3>
        <p className="mb-4 text-xs text-[#4d4d4d]">
          Deleting a project is permanent and cannot be undone. All tasks, subtasks, and notes will be removed.
        </p>
        <ActionBtn variant="danger" loading={deleting} onClick={handleDelete}>
          <FiTrash2 className="h-3.5 w-3.5" />
          Delete Project
        </ActionBtn>
      </div>
    </div>
  )
}

/* ─── Main ProjectDetails Component ─────────────────────────────── */
const ProjectDetails = () => {
  const { projectId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [project, setProject] = useState(null)
  const [userRole, setUserRole] = useState('member')
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('Tasks')

  const loadProject = useCallback(async () => {
    try {
      setLoading(true)
      const [projRes, membersRes] = await Promise.all([
        getProjectById(projectId),
        getProjectMembers(projectId),
      ])
      const proj = projRes?.data?.project || projRes?.data
      setProject(proj)

      const memberList = Array.isArray(membersRes?.data) ? membersRes.data : []
      setMembers(memberList)

      // Determine current user's role
      const currentMember = memberList.find((m) => m.user._id === user?._id)
      if (currentMember) setUserRole(currentMember.role)
    } catch {
      setError('Unable to load project. It may not exist or you may not have access.')
    } finally {
      setLoading(false)
    }
  }, [projectId, user])

  useEffect(() => { loadProject() }, [loadProject])

  if (loading) return <Loader />

  if (error || !project) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#fafafa] px-4">
        <div className="max-w-sm text-center">
          <FiAlertCircle className="mx-auto mb-3 h-8 w-8 text-[#ee0000]" />
          <p className="text-sm font-medium text-[#171717]">{error || 'Project not found'}</p>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="mt-4 text-sm text-[#0070f3] hover:underline"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-[#fafafa] px-4 py-6 sm:px-8">
      <div className="mx-auto max-w-[1180px]">
        {/* Header */}
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="rounded-[6px] p-1.5 text-[#4d4d4d] hover:bg-white hover:text-[#171717] transition-colors"
              aria-label="Back to dashboard"
            >
              <FiArrowLeft className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-xl font-semibold tracking-tight text-[#171717] truncate">
                {project.name}
              </h1>
              {project.description && (
                <p className="mt-0.5 text-xs text-[#8f8f8f] truncate">{project.description}</p>
              )}
            </div>
            <span className={`shrink-0 rounded-[4px] px-2 py-0.5 text-[11px] font-medium ${ROLE_CONFIG[userRole]?.badge || ROLE_CONFIG.member.badge}`}>
              {ROLE_CONFIG[userRole]?.label || 'Member'}
            </span>
          </div>
        </header>

        {/* Tab nav */}
        <nav
          className="mb-5 flex w-fit max-w-full overflow-x-auto rounded-[6px] border border-[#ebebeb] bg-white"
          aria-label="Project sections"
        >
          {TABS.map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              onClick={() => setActiveTab(label)}
              className={`inline-flex h-9 shrink-0 items-center gap-1.5 px-4 text-sm transition-colors ${
                activeTab === label
                  ? 'bg-[#f2f2f2] font-medium text-[#171717]'
                  : 'text-[#4d4d4d] hover:bg-[#fafafa] hover:text-[#171717]'
              }`}
              aria-current={activeTab === label ? 'page' : undefined}
            >
              {createElement(Icon, { className: 'h-4 w-4' })}
              {label}
            </button>
          ))}
        </nav>

        {/* Tab content */}
        {activeTab === 'Tasks' && (
          <TasksTab projectId={projectId} members={members} userRole={userRole} />
        )}
        {activeTab === 'Members' && (
          <MembersTab projectId={projectId} userRole={userRole} />
        )}
        {activeTab === 'Notes' && (
          <NotesTab projectId={projectId} userRole={userRole} />
        )}
        {activeTab === 'Settings' && (
          <SettingsTab
            project={project}
            userRole={userRole}
            onProjectDeleted={() => navigate('/dashboard')}
            onProjectUpdated={(updated) => updated && setProject((p) => ({ ...p, ...updated }))}
          />
        )}
      </div>
    </section>
  )
}

export default ProjectDetails
