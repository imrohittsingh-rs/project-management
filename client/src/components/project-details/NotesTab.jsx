import { useCallback, useEffect, useState } from 'react'
import { FiAlertCircle, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { getNotes, createNote, updateNote, deleteNote } from '../../services/noteService'
import Loader from '../Loadingspinner'
import { ActionBtn, Textarea } from './shared'

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

  useEffect(() => {
    let active = true
    getNotes(projectId)
      .then((response) => {
        if (active) setNotes(Array.isArray(response?.data) ? response.data : [])
      })
      .catch(() => {
        if (active) setError('Unable to load notes')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [projectId])

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

export default NotesTab
