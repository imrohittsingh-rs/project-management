import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { Task } from "../models/task.models.js";
import { Subtask } from "../models/subtask.model.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";
import { AvailableUserRole, UserRoleEnum } from "../utils/constants.js";

const getTasks = asyncHandler(async (req, res) => {
  //test
});

const createTask = asyncHandler(async (req, res) => {
  
});

const getTaskById = asyncHandler(async (req, res) => {
  //test
});

const updateTask = asyncHandler(async (req, res) => {
  //test
});

const deleteTask = asyncHandler(async (req, res) => {
  //test
});

const createSubTask = asyncHandler(async (req, res) => {
  //test
});

const updateSubTask = asyncHandler(async (req, res) => {
  //test
});

const deleteSubTask = asyncHandler(async (req, res) => {
  //test
});

export {
  createTask,
  createSubTask,
  updateTask,
  updateSubTask,
  deleteTask,
  deleteSubTask,
  getTasks,
  getTaskById,
};
