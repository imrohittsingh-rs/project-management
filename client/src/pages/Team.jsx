import { useEffect, useMemo, useState } from 'react'
import {
  FiAlertCircle,
  FiCheckSquare,
  FiLoader,
  FiPlus,
  FiSearch,
  FiUsers,
  FiX,
} from 'react-icons/fi'
import { FaFolderOpen } from "react-icons/fa6";
import Sidebar from '../components/Sidebar'
import {
  addMemberToProject,
  getProjectMembers,
  getProjects,
} from '../services/projectService'
import { getTasks } from '../services/taskService'
import LoadingSpinner from '../components/Loadingspinner'

const roleLabel = (role) =>
  role?.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase()) ||
  'Member'

const Team = () => {
  const [projects, setProjects] = useState([])
  const [members, setMembers] = useState([])
  const [taskCount, setTaskCount] = useState(0)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteProjectId, setInviteProjectId] = useState('')
  const [inviteRole, setInviteRole] = useState('member')
  const [inviteError, setInviteError] = useState('')
  const [inviting, setInviting] = useState(false)

  useEffect(() => {
    let current = true
    const loadTeam = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await getProjects()
        const entries = response?.data || []
        const projectList = entries
          .filter((entry) => entry?.project?._id)
          .map((entry) => ({ ...entry.project, role: entry.role }))

        const results = await Promise.allSettled(
          projectList.map(async (project) => {
            const [memberResponse, taskResponse] = await Promise.all([
              getProjectMembers(project._id),
              getTasks(project._id),
            ])
            return {
              members: Array.isArray(memberResponse?.data)
                ? memberResponse.data
                : [],
              tasks: Array.isArray(taskResponse?.data) ? taskResponse.data : [],
              project,
            }
          }),
        )

        const memberMap = new Map()
        let totalTasks = 0
        let failedProjects = false
        for (const result of results) {
          if (result.status !== 'fulfilled') {
            failedProjects = true
            continue
          }
          const { members: projectMembers, tasks, project } = result.value
          totalTasks += tasks.length
          for (const membership of projectMembers) {
            const person = membership?.user
            if (!person?._id) continue
            const existing = memberMap.get(person._id) || {
              ...person,
              memberships: [],
            }
            existing.memberships.push({
              projectName: project.name,
              role: membership.role,
            })
            memberMap.set(person._id, existing)
          }
        }
        if (current) {
          setProjects(projectList)
          setMembers(
            [...memberMap.values()].sort((a, b) =>
              (a.fullName || a.username || '').localeCompare(
                b.fullName || b.username || '',
              ),
            ),
          )
          setTaskCount(totalTasks)
          if (failedProjects)
            setError('Some project team or task data could not be loaded.')
        }
      } catch {
        if (current) setError('Unable to load team data. Please try again.')
      } finally {
        if (current) setLoading(false)
      }
    }
    loadTeam()
    return () => {
      current = false
    }
  }, [refreshKey])

  const inviteProjects = useMemo(
    () =>
      projects.filter(({ role }) => ['admin', 'project_admin'].includes(role)),
    [projects],
  )
  const selectedProject = inviteProjects.find(
    ({ _id }) => _id === inviteProjectId,
  )
  const visibleMembers = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return members
    return members.filter((member) => {
      const roles = member.memberships
        .map(({ role }) => roleLabel(role))
        .join(' ')
      return `${member.fullName || ''} ${member.username || ''} ${member.email || ''} ${roles}`
        .toLowerCase()
        .includes(query)
    })
  }, [members, search])

  const openInvite = () => {
    setInviteProjectId(inviteProjects[0]?._id || '')
    setInviteRole('member')
    setInviteEmail('')
    setInviteError('')
    setShowInvite(true)
  }

  const handleInvite = async (event) => {
    event.preventDefault()
    if (!selectedProject || !inviteEmail.trim()) return
    setInviting(true)
    setInviteError('')
    try {
      await addMemberToProject(selectedProject._id, {
        email: inviteEmail.trim().toLowerCase(),
        role: selectedProject.role === 'admin' ? inviteRole : 'member',
      })
      setShowInvite(false)
      setRefreshKey((key) => key + 1)
    } catch (err) {
      setInviteError(
        err?.response?.data?.message || 'Unable to invite this member.',
      )
    } finally {
      setInviting(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-[#fafafa] md:flex-row">
      <Sidebar />
      <main className="min-w-0 flex-1 p-6 text-[#171717] sm:p-8">
        <div className="mx-auto max-w-[1180px]">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.06em]">
                Team
              </h1>
              <p className="mt-2 text-sm text-[#4d4d4d]">
                Manage team members across your projects.
              </p>
            </div>
            {inviteProjects.length > 0 && (
              <button
                type="button"
                onClick={openInvite}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-[6px] bg-[#171717] px-4 text-sm font-medium text-white transition-colors hover:bg-[#4d4d4d]"
              >
                <FiPlus className="h-4 w-4" /> Invite Member
              </button>
            )}
          </header>

          {error && (
            <p
              role="status"
              className="mt-6 flex items-center gap-2 rounded-[6px] border border-[#ffefcf] bg-[#fffaf0] px-4 py-3 text-sm text-[#ab570a]"
            >
              <FiAlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </p>
          )}

          <section
            className="mt-7 grid gap-3 sm:grid-cols-3"
            aria-label="Team summary"
          >
            <SummaryCard
              icon={<FiUsers />}
              label="Total members"
              value={loading ? '—' : members.length}
              pill="All members"
              tone="blue"
            />
            <SummaryCard
              icon={<FaFolderOpen />}
              label="Active projects"
              value={loading ? '—' : projects.length}
              pill="All projects"
              tone="green"
            />
            <SummaryCard
              icon={<FiCheckSquare />}
              label="Total tasks"
              value={loading ? '—' : taskCount}
              pill="Across projects"
              tone="violet"
            />
          </section>

          <div className="mt-6 max-w-md">
            <label className="sr-only" htmlFor="team-search">
              Search team members
            </label>
            <div className="relative">
              <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8f8f8f]" />
              <input
                id="team-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search team members..."
                className="h-10 w-full appearance-none rounded-xl border border-[#ebebeb] bg-white pl-9 pr-9 text-sm text-[#171717] placeholder:text-[#a1a1a1] transition-colors focus:border-[#171717] focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
              />
              {search && (
                <div
                  aria-label="Clear team member search"
                  onClick={() => setSearch('')}
                  className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-[#171717] transition-colors hover:bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#171717]/20"
                >
                  <FiX className="h-4 w-4" />
                </div>
              )}
            </div>
          </div>

          <section
            className="mt-5"
            aria-label="Team members"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2 rounded-[12px] border border-[#ebebeb] bg-white px-4 py-12 text-sm text-[#8f8f8f]">
                <LoadingSpinner className="h-4 w-4" /> Loading team...
              </div>
            ) : visibleMembers.length ? (
              <div className="space-y-3">
                {visibleMembers.map((member) => {
                  const roles = [
                    ...new Set(member.memberships.map(({ role }) => role)),
                  ]
                  const avatarUrl =
                    member.avatar?.url ||
                    (typeof member.avatar === 'string' ? member.avatar : '')
                  return (
                    <div
                      key={member._id}
                      className="flex flex-col gap-4 rounded-[12px] border border-[#ebebeb] bg-white px-4 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:flex-row sm:items-center sm:justify-between sm:px-5"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={`${member.fullName || member.username || 'Team member'}'s profile`}
                            className="h-10 w-10 shrink-0 rounded-full border border-[#ebebeb] object-cover"
                          />
                        ) : (
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#171717] text-xs font-semibold text-white">
                            {(member.fullName || member.username || '?')
                              .slice(0, 1)
                              .toUpperCase()}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {member.fullName || member.username}
                          </p>
                          <p className="truncate text-xs text-[#8f8f8f]">
                            {member.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 sm:justify-end">
                        {roles.map((role) => (
                          <span
                            key={role}
                            className="rounded-full bg-[#f2f2f2] px-2.5 py-1 text-[11px] font-medium capitalize text-[#4d4d4d]"
                          >
                            {roleLabel(role)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="px-4 py-10 text-center text-sm text-[#8f8f8f]">
                {search
                  ? 'No team members match your search.'
                  : 'No team members found in your projects yet.'}
              </p>
            )}
          </section>
        </div>
      </main>

      {showInvite && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4"
          onClick={(event) =>
            event.target === event.currentTarget && setShowInvite(false)
          }
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="invite-title"
            className="w-full max-w-md overflow-hidden rounded-[12px] border border-[#ebebeb] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
          >
            <div className="flex items-center justify-between border-b border-[#ebebeb] px-5 py-4">
              <h2 id="invite-title" className="text-sm font-semibold">
                Invite a team member
              </h2>
              <button
                type="button"
                aria-label="Close invite dialog"
                onClick={() => setShowInvite(false)}
                className="rounded-[6px] p-1 text-[#8f8f8f] hover:bg-[#f2f2f2] hover:text-[#171717]"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleInvite} className="space-y-4 p-5">
              {inviteError && (
                <p role="alert" className="text-sm text-[#c50000]">
                  {inviteError}
                </p>
              )}
              <div>
                <label
                  htmlFor="invite-project"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Project
                </label>
                <select
                  id="invite-project"
                  value={inviteProjectId}
                  onChange={(event) => {
                    setInviteProjectId(event.target.value)
                    setInviteRole('member')
                  }}
                  className="h-10 w-full rounded-[6px] border border-[#ebebeb] bg-white px-3 text-sm focus:border-[#0070f3] focus:outline-none focus:ring-2 focus:ring-[#d3e5ff]"
                >
                  {inviteProjects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="invite-email"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Email address
                </label>
                <input
                  id="invite-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={inviteEmail}
                  onChange={(event) => setInviteEmail(event.target.value)}
                  placeholder="teammate@example.com"
                  className="h-10 w-full rounded-[6px] border border-[#ebebeb] bg-white px-3 text-sm placeholder:text-[#a1a1a1] focus:border-[#0070f3] focus:outline-none focus:ring-2 focus:ring-[#d3e5ff]"
                />
              </div>
              {selectedProject?.role === 'admin' && (
                <div>
                  <label
                    htmlFor="invite-role"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Role
                  </label>
                  <select
                    id="invite-role"
                    value={inviteRole}
                    onChange={(event) => setInviteRole(event.target.value)}
                    className="h-10 w-full rounded-[6px] border border-[#ebebeb] bg-white px-3 text-sm focus:border-[#0070f3] focus:outline-none focus:ring-2 focus:ring-[#d3e5ff]"
                  >
                    <option value="member">Member</option>
                    <option value="project_admin">Project Admin</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              )}
              {selectedProject?.role === 'project_admin' && (
                <p className="text-xs text-[#8f8f8f]">
                  You can invite members with the Member role.
                </p>
              )}
              <button
                type="submit"
                disabled={inviting || !selectedProject}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-[6px] bg-[#171717] px-4 text-sm font-medium text-white hover:bg-[#4d4d4d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {inviting && <FiLoader className="h-4 w-4 animate-spin" />}Send
                Invite
              </button>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}

const SummaryCard = ({ icon, label, value, pill, tone }) => {
  const pillStyles = {
    blue: 'bg-[#eef5ff] text-[#2672d8]',
    green: 'bg-[#d9f7ec] text-[#13795b]',
    violet: 'bg-[#f3edff] text-[#7928ca]',
  }
  return (
    <div className="min-h-[164px] rounded-2xl border border-[#ebebeb] bg-white px-6 py-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] sm:px-7 sm:py-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#8f9db2]">{label}</p>
      <strong className="mt-3 block text-3xl font-semibold leading-none tracking-tight text-[#171717]">
        {value}
      </strong>
      <span className={`mt-6 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${pillStyles[tone]}`}>
        {icon && <span className="flex h-3.5 w-3.5 items-center justify-center [&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>}
        {pill}
      </span>
    </div>
  )
}

export default Team
