import { useCallback, useEffect, useState } from 'react'
import {
  FiChevronDown,
  FiFolder,
  FiGrid,
  FiList,
  FiPlus,
  FiX,
  FiLoader,
} from 'react-icons/fi'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getProjects, createProject } from '../services/projectService'

const Sidebar = () => {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const [projects, setProjects] = useState([])
  const [projectsError, setProjectsError] = useState('')
  const [projectsOpen, setProjectsOpen] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  const loadProjects = useCallback(async () => {
    try {
      const response = await getProjects()
      setProjects(response?.data ?? [])
    } catch {
      setProjectsError('Unable to load projects')
    }
  }, [])

  useEffect(() => {
    if (user) loadProjects()
  }, [user, loadProjects])

  const handleCreateProject = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    setCreating(true)
    setCreateError('')
    try {
      const res = await createProject({ name: newName.trim(), description: newDesc.trim() })
      const created = res?.data?.project || res?.data
      setShowCreate(false)
      setNewName('')
      setNewDesc('')
      await loadProjects()
      if (created?._id) navigate(`/projects/${created._id}`)
    } catch (err) {
      setCreateError(err?.response?.data?.message || 'Failed to create project')
    } finally {
      setCreating(false)
    }
  }

  const isActive = (path) => location.pathname === path

  return (
    <>
      <aside className="w-full shrink-0 border-b border-[#ebebeb] bg-white md:min-h-[calc(100vh-4rem)] md:w-64 md:border-b-0 md:border-r">
        <nav
          className="flex flex-col gap-6 p-4"
          aria-label={`${user?.fullName || user?.username || 'User'} dashboard navigation`}
        >
          {/* Workspace section */}
          <section>
            <p className="mb-2 px-3 font-mono-eyebrow text-[#8f8f8f]">Workspace</p>
            <div className="space-y-1">
              <SidebarLink
                to="/dashboard"
                icon={<FiGrid />}
                label="Dashboard"
                active={isActive('/dashboard')}
              />
              <SidebarLink
                to="/dashboard"
                icon={<FiList />}
                label="All Tasks"
                active={false}
              />
            </div>
          </section>

          {/* Projects section */}
          <section>
            <div className="flex items-center justify-between px-3 mb-1">
              <button
                type="button"
                onClick={() => setProjectsOpen((o) => !o)}
                className="flex items-center gap-1.5 font-mono-eyebrow text-[#8f8f8f] hover:text-[#171717] transition-colors"
                aria-expanded={projectsOpen}
              >
                <FiFolder className="h-3 w-3" />
                Projects
                <FiChevronDown
                  className={`h-3 w-3 transition-transform ${projectsOpen ? 'rotate-180' : ''}`}
                />
              </button>
              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="flex h-5 w-5 items-center justify-center rounded-[4px] text-[#8f8f8f] hover:bg-[#f2f2f2] hover:text-[#171717] transition-colors"
                title="New project"
              >
                <FiPlus className="h-3.5 w-3.5" />
              </button>
            </div>

            {projectsOpen && (
              <div className="mt-1 space-y-1">
                {projectsError && (
                  <p className="px-3 py-2 text-xs text-[#ee0000]">{projectsError}</p>
                )}
                {!projectsError && projects.length === 0 && (
                  <p className="px-3 py-2 text-xs text-[#8f8f8f]">No projects yet</p>
                )}
                {projects.map(({ project }) => {
                  const projectPath = `/projects/${project._id}`
                  const isProjectActive = location.pathname.startsWith(projectPath)
                  return (
                    <Link
                      key={project._id}
                      to={projectPath}
                      className={`flex w-full items-center gap-2 rounded-[6px] px-3 py-2 text-sm transition-colors ${
                        isProjectActive
                          ? 'bg-[#f2f2f2] font-medium text-[#171717]'
                          : 'text-[#4d4d4d] hover:bg-[#fafafa] hover:text-[#171717]'
                      }`}
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] bg-[#f2f2f2] text-[10px] font-semibold text-[#4d4d4d]">
                        {project.name.charAt(0).toUpperCase()}
                      </span>
                      <span className="flex-1 truncate">{project.name}</span>
                    </Link>
                  )
                })}
              </div>
            )}
          </section>
        </nav>
      </aside>

      {/* Create Project Modal */}
      {showCreate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[1px] p-4"
          onClick={(e) => e.target === e.currentTarget && setShowCreate(false)}
        >
          <div className="w-full max-w-md bg-white border border-[#ebebeb] rounded-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.10)] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#ebebeb]">
              <h2 className="text-sm font-semibold text-[#171717]">New Project</h2>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="p-1 rounded-[6px] text-[#8f8f8f] hover:bg-[#f2f2f2] hover:text-[#171717] transition-colors"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleCreateProject} className="p-5 space-y-4">
              {createError && (
                <p className="text-xs text-[#ee0000]">{createError}</p>
              )}
              <div>
                <label htmlFor="new-proj-name" className="block text-sm font-medium text-[#171717] mb-1.5">
                  Project name
                </label>
                <input
                  id="new-proj-name"
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Backend API Redesign"
                  className="w-full h-9 px-3 text-sm bg-white border border-[#ebebeb] rounded-[6px] text-[#171717] placeholder:text-[#a1a1a1] focus:outline-none focus:border-[#171717] transition-colors"
                />
              </div>
              <div>
                <label htmlFor="new-proj-desc" className="block text-sm font-medium text-[#171717] mb-1.5">
                  Description <span className="text-[#8f8f8f] font-normal">(optional)</span>
                </label>
                <textarea
                  id="new-proj-desc"
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="What is this project about?"
                  className="w-full px-3 py-2 text-sm bg-white border border-[#ebebeb] rounded-[6px] text-[#171717] placeholder:text-[#a1a1a1] focus:outline-none focus:border-[#171717] transition-colors resize-none"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={creating || !newName.trim()}
                  className="inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium rounded-[6px] bg-[#171717] text-white hover:bg-[#4d4d4d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {creating && <FiLoader className="h-3.5 w-3.5 animate-spin" />}
                  Create Project
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="inline-flex items-center h-8 px-3 text-sm font-medium rounded-[6px] bg-white text-[#171717] border border-[#ebebeb] hover:bg-[#fafafa] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

const SidebarLink = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`flex w-full items-center gap-2.5 rounded-[6px] px-3 py-2 text-sm transition-colors ${
      active
        ? 'bg-[#f2f2f2] font-medium text-[#171717]'
        : 'text-[#4d4d4d] hover:bg-[#fafafa] hover:text-[#171717]'
    }`}
  >
    {icon && <span className="h-4 w-4 shrink-0 text-[#8f8f8f]">{icon}</span>}
    <span className="truncate">{label}</span>
  </Link>
)

export default Sidebar