import { createElement, useEffect, useState } from 'react'
import { FiAlertCircle, FiCheckSquare, FiUsers, FiFileText, FiSettings, FiArrowLeft } from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getProjectById, getProjectMembers } from '../services/projectService'
import Loader from './Loadingspinner'
import TasksTab from './project-details/TasksTab'
import MembersTab from './project-details/MembersTab'
import NotesTab from './project-details/NotesTab'
import SettingsTab from './project-details/SettingsTab'
import { ROLE_CONFIG } from './project-details/sharedData'

const TABS = [
  { label: 'Tasks', icon: FiCheckSquare },
  { label: 'Members', icon: FiUsers },
  { label: 'Notes', icon: FiFileText },
  { label: 'Settings', icon: FiSettings },
]

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

  useEffect(() => {
    let active = true

    Promise.all([getProjectById(projectId), getProjectMembers(projectId)])
      .then(([projectResponse, membersResponse]) => {
        if (!active) return

        setProject(projectResponse?.data?.project || projectResponse?.data)
        const memberList = Array.isArray(membersResponse?.data) ? membersResponse.data : []
        setMembers(memberList)
        const currentMember = memberList.find((member) => member.user?._id === user?._id)
        setUserRole(currentMember?.role || 'member')
      })
      .catch(() => {
        if (active) setError('Unable to load project. It may not exist or you may not have access.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [projectId, user?._id])

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
              className={`inline-flex min-h-11 shrink-0 items-center gap-1.5 px-3 text-sm transition-colors sm:px-4 ${
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
