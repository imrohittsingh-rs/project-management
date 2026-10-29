import api from "../api/axios.js";

export const getProjects = async () => {
  const res = await api.get("/projects");
  return res.data;
};

export const getProjectById = async (projectId) => {
  const res = await api.get(`/projects/${projectId}`);
  return res.data;
};

export const createProject = async (projectData) => {
  const res = await api.post("/projects", projectData);
  return res.data;
};

export const updateProject = async (projectId, projectData) => {
  const res = await api.put(`/projects/${projectId}`, projectData);
  return res.data;
};

export const deleteProject = async (projectId) => {
  const res = await api.delete(`/projects/${projectId}`);
  return res.data;
};

export const getProjectMembers = async (projectId) => {
  const res = await api.get(`/projects/${projectId}/members`);
  return res.data;
};

export const addMemberToProject = async (projectId, memberData) => {
  const res = await api.post(`/projects/${projectId}/members`, memberData);
  return res.data;
};

export const updateMemberRole = async (projectId, userId, roleData) => {
  const res = await api.put(`/projects/${projectId}/members/${userId}`, roleData);
  return res.data;
};

export const deleteMember = async (projectId, userId) => {
  const res = await api.delete(`/projects/${projectId}/members/${userId}`);
  return res.data;
};
