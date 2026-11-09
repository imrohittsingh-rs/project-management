import api from "../api/axios.js";

export const getNotes = async (projectId) => {
  const res = await api.get(`/notes/${projectId}`);
  return res.data;
};

export const getNoteById = async (projectId, noteId) => {
  const res = await api.get(`/notes/${projectId}/n/${noteId}`);
  return res.data;
};

export const createNote = async (projectId, noteData) => {
  const res = await api.post(`/notes/${projectId}`, noteData);
  return res.data;
};

export const updateNote = async (projectId, noteId, noteData) => {
  const res = await api.put(`/notes/${projectId}/n/${noteId}`, noteData);
  return res.data;
};

export const deleteNote = async (projectId, noteId) => {
  const res = await api.delete(`/notes/${projectId}/n/${noteId}`);
  return res.data;
};
