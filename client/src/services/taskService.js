import api from "../api/axios.js";

export const getTasks = async (projectId) => {
  const res = await api.get(`/tasks/${projectId}`);
  return res.data;
};

export const createTask = async (projectId, taskData) => {
  const res = await api.post(`/tasks/${projectId}`, taskData);
  return res.data;
};

export const getTaskById = async (projectId, taskId) => {
  const res = await api.get(`/tasks/${projectId}/t/${taskId}`);
  return res.data;
};

export const updateTask = async (projectId, taskId, taskData) => {
  const res = await api.put(`/tasks/${projectId}/t/${taskId}`, taskData);
  return res.data;
};

export const deleteTask = async (projectId, taskId) => {
  const res = await api.delete(`/tasks/${projectId}/t/${taskId}`);
  return res.data;
};

export const createSubTask = async (projectId, taskId, subTaskData) => {
  const res = await api.post(`/tasks/${projectId}/t/${taskId}/subtasks`, subTaskData);
  return res.data;
};

export const updateSubTask = async (projectId, subTaskId, subTaskData) => {
  const res = await api.put(`/tasks/${projectId}/st/${subTaskId}`, subTaskData);
  return res.data;
};

export const deleteSubTask = async (projectId, subTaskId) => {
  const res = await api.delete(`/tasks/${projectId}/st/${subTaskId}`);
  return res.data;
};
