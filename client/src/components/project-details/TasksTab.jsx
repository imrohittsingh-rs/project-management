import { useCallback, useEffect, useMemo, useState } from 'react'
import { FiAlertCircle, FiChevronDown, FiPlus, FiTrash2, FiCheck, FiX } from 'react-icons/fi'
import { getTasks, createTask, updateTask, deleteTask, createSubTask, updateSubTask, deleteSubTask, getTaskById } from '../../services/taskService'
import Loader from '../Loadingspinner'
import { ActionBtn, Input, Textarea } from './shared'
import { STATUS_CONFIG } from './sharedData'

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

  useEffect(() => {
    let active = true
    getTasks(projectId)
      .then((response) => {
        if (active) setTasks(Array.isArray(response?.data) ? response.data : [])
      })
      .catch(() => {
        if (active) setError('Unable to load tasks')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [projectId])

  const handleCreateTask = async (e) => {
    e.preventDefault()
    const title = newTask.title.trim()
    if (title.length < 3) {
      setError('Task title must be at least 3 characters.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await createTask(projectId, {
        title,
        description: newTask.description.trim(),
        assignedTo: newTask.assignedTo || undefined,
      })
      setNewTask({ title: '', description: '', assignedTo: '' })
      setShowNewTask(false)
      await loadTasks()
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create task')
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
            const taskOwner = task.assignedBy?.fullName || task.assignedBy?.username || assignee?.fullName || assignee?.username
            // Subtasks come from the detail cache (getTaskById aggregation)
            const detail = taskDetails[task._id]
            const subtasks = detail?.subtasks ?? []
            const isDetailLoading = detailLoading[task._id]

            return (
              <div key={task._id} className="rounded-[6px] border border-[#ebebeb] bg-white">
                {/* Task header row */}
                <div className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${cfg.dot}`} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[#171717]">{task.title}</p>
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
                    className={`h-7 rounded-[4px] border-0 px-2.5 text-xs font-medium focus:outline-none disabled:cursor-default ${cfg.badge}`}
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
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] text-[#8f8f8f] transition-colors hover:bg-[#f2f2f2] hover:text-[#171717]"
                    aria-expanded={isExpanded}
                    aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${task.title}`}
                  >
                    <FiChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {canManage && (
                    <button
                      type="button"
                      onClick={() => handleDeleteTask(task._id)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] text-[#8f8f8f] transition-colors hover:bg-[#fff5f5] hover:text-[#ee0000]"
                      aria-label={`Delete ${task.title}`}
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

export default TasksTab
