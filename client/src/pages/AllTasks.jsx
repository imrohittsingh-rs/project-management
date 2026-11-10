import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiAlertCircle, FiSearch } from 'react-icons/fi'
import Sidebar from '../components/Sidebar'
import Loader from '../components/Loadingspinner'
import { getProjects } from '../services/projectService'
import { getTasks } from '../services/taskService'

const STATUS_STYLES = {
  todo: 'bg-[#f2f2f2] text-[#4d4d4d]',
  in_progress: 'bg-[#fff3e0] text-[#ab570a]',
  done: 'bg-[#d9f7ec] text-[#13795b]',
}

const AllTasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    let current = true
    const loadTasks = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await getProjects()
        const projects = (Array.isArray(response?.data) ? response.data : [])
          .map((entry) => entry?.project)
          .filter((project) => project?._id)
        const results = await Promise.allSettled(projects.map(async (project) => {
          const taskResponse = await getTasks(project._id)
          return (Array.isArray(taskResponse?.data) ? taskResponse.data : []).map((task) => ({
            ...task,
            projectId: project._id,
            projectName: project.name,
          }))
        }))
        if (!current) return
        setTasks(results.filter((result) => result.status === 'fulfilled').flatMap((result) => result.value))
        if (results.some((result) => result.status === 'rejected')) {
          setError('Some project tasks could not be loaded.')
        }
      } catch {
        if (current) setError('Unable to load tasks. Please try again.')
      } finally {
        if (current) setLoading(false)
      }
    }
    loadTasks()
    return () => { current = false }
  }, [])

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase()
    return tasks.filter((task) => {
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter
      const assignee = task.assignedTo?.fullName || task.assignedTo?.username || ''
      const matchesSearch = !query || `${task.title} ${task.description || ''} ${task.projectName} ${assignee}`.toLowerCase().includes(query)
      return matchesStatus && matchesSearch
    }).sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))
  }, [tasks, search, statusFilter])

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-[#fafafa] md:flex-row">
      <Sidebar />
      <main className="min-w-0 flex-1 p-6 text-[#171717] sm:p-8">
        <div className="mx-auto max-w-[1180px]">
          <header>
            <p className="font-mono-eyebrow text-[#8f8f8f]">Workspace</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.06em]">All Tasks</h1>
            <p className="mt-2 text-sm text-[#4d4d4d]">Tasks from every project you belong to.</p>
          </header>

          {error && <p role="status" className="mt-6 flex items-center gap-2 rounded-[6px] border border-[#ffefcf] bg-[#fffaf0] px-4 py-3 text-sm text-[#ab570a]"><FiAlertCircle className="h-4 w-4 shrink-0" />{error}</p>}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">Search tasks</span>
              <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8f8f8f]" />
              <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks or projects..." className="h-10 w-full rounded-[6px] border border-[#ebebeb] bg-white pl-9 pr-3 text-sm placeholder:text-[#a1a1a1] focus:border-[#0070f3] focus:outline-none focus:ring-2 focus:ring-[#d3e5ff]" />
            </label>
            <label className="sr-only" htmlFor="task-status-filter">Filter by status</label>
            <select id="task-status-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-10 rounded-[6px] border border-[#ebebeb] bg-white px-3 text-sm text-[#4d4d4d] focus:border-[#0070f3] focus:outline-none focus:ring-2 focus:ring-[#d3e5ff]">
              <option value="all">All status</option>
              <option value="todo">Todo</option>
              <option value="in_progress">In progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <section className="mt-5 overflow-hidden rounded-[6px] border border-[#ebebeb] bg-white" aria-label="Tasks">
            {loading ? <Loader /> : filteredTasks.length ? (
              <div className="divide-y divide-[#f2f2f2]">
                {filteredTasks.map((task) => (
                  <Link key={`${task.projectId}-${task._id}`} to={`/projects/${task.projectId}`} className="flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-[#fafafa] sm:flex-row sm:items-center sm:px-5">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{task.title}</p>
                      <p className="mt-1 truncate text-xs text-[#8f8f8f]">{task.projectName}{task.assignedTo ? ` · ${task.assignedTo.fullName || task.assignedTo.username}` : ''}</p>
                    </div>
                    <span className={`w-fit rounded-[4px] px-2 py-1 text-[11px] font-medium ${STATUS_STYLES[task.status] || STATUS_STYLES.todo}`}>{task.status?.replace('_', ' ') || 'todo'}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="px-4 py-12 text-center text-sm text-[#8f8f8f]">{tasks.length ? 'No tasks match these filters.' : 'No tasks found in your projects yet.'}</p>
            )}
          </section>
          {!loading && <p className="mt-3 text-xs text-[#8f8f8f]">{filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}</p>}
        </div>
      </main>
    </div>
  )
}

export default AllTasks
