import { useState } from 'react'
import { FiSettings, FiTrash2 } from 'react-icons/fi'
import { deleteProject, updateProject } from '../../services/projectService'
import { ActionBtn, Input, Textarea } from './shared'
import toast from '../../utils/toast.js'

const SettingsTab = ({ project, userRole, onProjectDeleted, onProjectUpdated }) => {
  const [name, setName] = useState(project?.name || '')
  const [description, setDescription] = useState(project?.description || '')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const isAdmin = userRole === 'admin'

  const handleSave = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    try {
      const res = await updateProject(project._id, { name: name.trim(), description: description.trim() })
      onProjectUpdated(res?.data)
      toast.success('Project updated')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update project')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(`Delete project "${project.name}"? This cannot be undone.`)) return
    setDeleting(true)
    try {
      await deleteProject(project._id)
      toast.success('Project deleted')
      onProjectDeleted()
    } catch {
      toast.error('Failed to delete project')
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

export default SettingsTab
