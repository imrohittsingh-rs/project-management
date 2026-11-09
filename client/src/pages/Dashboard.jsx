import { useEffect, useMemo, useState } from 'react'
import {
  FiCheckCircle,
  FiClock,
  FiFolder,
  FiList,
} from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Loader from '../components/Loadingspinner'
import { useAuth } from '../context/AuthContext'
import { getProjects } from '../services/projectService'
import { getTasks } from '../services/taskService'

const Dashboard = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [projectsError, setProjectsError] = useState('')
  const [tasksError, setTasksError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (loading) {
      return
    }

    if (!user) {
      navigate('/login', { replace: true })
      return
    }

    let isCurrent = true

    const loadDashboard = async () => {
      setIsLoading(true)
      setProjectsError('')
      setTasksError('')

      try {
        const projectsResponse = await getProjects()
        const projectEntries = Array.isArray(projectsResponse?.data)
          ? projectsResponse.data
          : []

        if (!isCurrent) {
          return
        }

        setProjects(projectEntries)

        const taskResults = await Promise.allSettled(
          projectEntries
            .map((entry) => entry?.project)
            .filter((project) => project?._id)
            .map(async (project) => {
              const response = await getTasks(project._id)
              const projectTasks = Array.isArray(response?.data) ? response.data : []

              return projectTasks.map((task) => ({
                ...task,
                projectId: project._id,
                projectName: project.name,
              }))
            }),
        )

        if (!isCurrent) {
          return
        }

        const failedTaskRequests = taskResults.filter(
          (result) => result.status === 'rejected',
        )
        const loadedTasks = taskResults
          .filter((result) => result.status === 'fulfilled')
          .flatMap((result) => result.value)

        setTasks(loadedTasks)

        if (failedTaskRequests.length > 0) {
          setTasksError('Some project tasks could not be loaded')
        }
      } catch (error) {
        console.error('Failed to load dashboard projects:', error)
        if (isCurrent) {
          setProjectsError('Unable to load your projects')
          setProjects([])
          setTasks([])
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      isCurrent = false
    }
  }, [loading, navigate, user])

  const taskSummary = useMemo(() => {
    const completed = tasks.filter((task) => task.status === 'done').length
    const inProgress = tasks.filter((task) => task.status === 'in_progress').length

    return {
      completed,
      inProgress,
      todo: tasks.length - completed - inProgress,
    }
  }, [tasks])

  const recentTasks = tasks.slice().sort((firstTask, secondTask) => {
    const firstDate = new Date(firstTask.updatedAt || firstTask.createdAt || 0).getTime()
    const secondDate = new Date(
      secondTask.updatedAt || secondTask.createdAt || 0,
    ).getTime()

    return secondDate - firstDate
  }).slice(0, 5)

  if (loading || isLoading) {
    return <Loader />
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-[#fafafa] md:flex-row">
      <Sidebar />
      <main className="min-w-0 flex-1 p-6 text-[#171717] sm:p-8">
        <div className="mx-auto max-w-[1180px]">
          <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono-eyebrow text-[#8f8f8f]">Overview</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.06em]">
                Welcome back, {user?.fullName || user?.username || 'there'}
              </h1>
              <p className="mt-2 text-sm text-[#4d4d4d]">
                Keep your projects moving and your team aligned.
              </p>
            </div>
          </header>

          {projectsError && (
            <p className="mt-6 rounded-[6px] border border-[#f4cccc] bg-[#fff5f5] px-4 py-3 text-sm text-[#c50000]">
              {projectsError}
            </p>
          )}

          <section className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Workspace summary">
            <SummaryCard icon={<FiFolder />} label="Projects" value={projects.length} />
            <SummaryCard icon={<FiList />} label="Total tasks" value={tasks.length} />
            <SummaryCard
              icon={<FiClock />}
              label="In progress"
              value={taskSummary.inProgress}
              valueClass="text-[#ab570a]"
            />
            <SummaryCard
              icon={<FiCheckCircle />}
              label="Completed"
              value={taskSummary.completed}
              valueClass="text-[#13795b]"
            />
          </section>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <section className="rounded-[6px] border border-[#ebebeb] bg-white">
              <SectionHeader title="Recent tasks" />
              {tasksError && (
                <p className="border-b border-[#f2f2f2] px-4 py-3 text-xs text-[#ab570a]">
                  {tasksError}
                </p>
              )}
              {recentTasks.length > 0 ? (
                <div className="divide-y divide-[#f2f2f2]">
                  {recentTasks.map((task) => (
                    <TaskItem key={`${task.projectId}-${task._id}`} task={task} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No tasks yet"
                  message="Tasks from your projects will appear here."
                />
              )}
            </section>

            <section className="rounded-[6px] border border-[#ebebeb] bg-white">
              <SectionHeader title="Your projects" />
              {projects.length > 0 ? (
                <div className="divide-y divide-[#f2f2f2]">
                  {projects.slice(0, 5).map(({ project, role }) => (
                    <Link
                      key={project._id}
                      to={`/projects/${project._id}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-[#fafafa] transition-colors"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] bg-[#f2f2f2] text-sm font-semibold text-[#4d4d4d]">
                        {project.name.charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{project.name}</p>
                        <p className="mt-0.5 text-xs text-[#8f8f8f]">
                          {project.members || 0} members
                        </p>
                      </div>
                      <span className="text-[11px] capitalize text-[#8f8f8f]">
                        {role?.replace('_', ' ') || 'member'}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No projects yet"
                  message="Create a project to start organizing your work."
                />
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

const SummaryCard = ({ icon, label, value, valueClass = 'text-[#171717]' }) => (
  <div className="rounded-[6px] border border-[#ebebeb] bg-white px-4 py-3">
    <div className="flex items-center justify-between text-xs text-[#8f8f8f]">
      <span>{label}</span>
      <span className="text-[#4d4d4d]">{icon}</span>
    </div>
    <strong className={`mt-2 block text-2xl font-semibold tracking-[-0.04em] ${valueClass}`}>
      {value}
    </strong>
  </div>
)

const SectionHeader = ({ title }) => (
  <div className="border-b border-[#ebebeb] px-4 py-3">
    <h2 className="text-sm font-semibold">{title}</h2>
  </div>
)

const TaskItem = ({ task }) => (
  <div className="flex items-center gap-3 px-4 py-3">
    <span
      className={`h-2 w-2 shrink-0 rounded-full ${
        task.status === 'done'
          ? 'bg-[#13795b]'
          : task.status === 'in_progress'
            ? 'bg-[#ab570a]'
            : 'bg-[#8f8f8f]'
      }`}
    />
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-medium">{task.title}</p>
      <p className="mt-0.5 truncate text-xs text-[#8f8f8f]">{task.projectName}</p>
    </div>
    <span className="shrink-0 text-[11px] capitalize text-[#8f8f8f]">
      {task.status?.replace('_', ' ') || 'todo'}
    </span>
  </div>
)

const EmptyState = ({ title, message }) => (
  <div className="px-4 py-10 text-center">
    <p className="text-sm font-medium">{title}</p>
    <p className="mt-1 text-xs text-[#8f8f8f]">{message}</p>
  </div>
)

export default Dashboard
