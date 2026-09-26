import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { Task } from "../models/task.models.js";
import { Subtask } from "../models/subtask.model.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { UserRoleEnum } from "../utils/constants.js";
import mongoose from "mongoose";

const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const tasks = await Task.find({
    project: new mongoose.Types.ObjectId(projectId),
  }).populate("assignedTo", "avatar username fullName");
  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
});

const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, status } = req.body;
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const files = req.files || [];
  const attachments = files.map((file) => {
    return {
      url: `${process.env.SERVER_URL}/images/${file.filename}`,
      mimetype: file.mimetype,
      size: file.size,
    };
  });

  const task = await Task.create({
    title,
    description,
    assignedTo: assignedTo ? new mongoose.Types.ObjectId(assignedTo) : null,
    assignedBy: new mongoose.Types.ObjectId(req.user._id),
    status,
    project: new mongoose.Types.ObjectId(projectId),
    attachments,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully"));
});

const getTaskById = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;
  const task = await Task.aggregate([
    // 1. Match the task by ID
    {
      $match: {
        _id: new mongoose.Types.ObjectId(taskId),
        project: new mongoose.Types.ObjectId(projectId),
      },
    },
    // 2. Lookup the assignedTo user details
    {
      $lookup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "_id",
        as: "assignedTo",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    // 3. Lookup the subtasks for the task and their assignedTo user details
    {
      $lookup: {
        from: "subtasks",
        localField: "_id",
        foreignField: "task",
        as: "subtasks",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "createdBy",
              foreignField: "_id",
              as: "createdBy",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    username: 1,
                    fullName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              createdBy: { $arrayElemAt: ["$createdBy", 0] },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        assignedTo: { $arrayElemAt: ["$assignedTo", 0] },
      },
    },
  ]);

  if (!task || task.length === 0) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task[0], "Task fetched successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;
  const { title, description, assignedTo, status } = req.body;

  const task = await Task.findByIdAndUpdate(
    { _id: taskId, project: projectId },
    {
      title,
      description,
      assignedTo: assignedTo ? new mongoose.Types.ObjectId(assignedTo) : null,
      status,
    },
    { new: true },
  );

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task updated successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;
  const task = await Task.findOneAndDelete({
    _id: taskId,
    project: projectId,
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Task deleted successfully"));
});

const createSubTask = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;
  const { title } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const task = await Task.findOne({
    _id: taskId,
    project: new mongoose.Types.ObjectId(projectId),
  });
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const subtask = await Subtask.create({
    title,
    task: new mongoose.Types.ObjectId(taskId),
    createdBy: new mongoose.Types.ObjectId(req.user._id),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, subtask, "Subtask created successfully"));
});

const updateSubTask = asyncHandler(async (req, res) => {
  const { projectId, subTaskId } = req.params;
  const { title, isCompleted } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const updates = {};
  if (req.user.role === UserRoleEnum.MEMBER) {
    // Members cannot update the title
    if (title !== undefined) {
      throw new ApiError(403, "Members can only update subtask completion");
    }
    if (isCompleted !== undefined) updates.isCompleted = isCompleted;
  } else {
    // Admin or Project Admin can update both title and isCompleted
    if (title !== undefined) updates.title = title;
    if (isCompleted !== undefined) updates.isCompleted = isCompleted;
  }

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "At least one subtask field is required");
  }

  const existingSubtask = await Subtask.findById(subTaskId);
  if (!existingSubtask) {
    throw new ApiError(404, "Subtask not found");
  }

  const task = await Task.findOne({
    _id: existingSubtask.task,
    project: new mongoose.Types.ObjectId(projectId),
  });
  if (!task) {
    throw new ApiError(404, "Subtask not found");
  }

  const subtask = await Subtask.findOneAndUpdate(
    { _id: existingSubtask._id, task: task._id },
    updates,
    { new: true },
  );

  if (!subtask) {
    throw new ApiError(404, "Subtask not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, subtask, "Subtask updated successfully"));
});

const deleteSubTask = asyncHandler(async (req, res) => {
  const { projectId, subTaskId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const existingSubtask = await Subtask.findById(subTaskId);
  if (!existingSubtask) {
    throw new ApiError(404, "Subtask not found");
  }

  const task = await Task.findOne({
    _id: existingSubtask.task,
    project: new mongoose.Types.ObjectId(projectId),
  });
  if (!task) {
    throw new ApiError(404, "Subtask not found");
  }

  const subtask = await Subtask.findOneAndDelete({
    _id: existingSubtask._id,
    task: task._id,
  });

  if (!subtask) {
    throw new ApiError(404, "Subtask not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Subtask deleted successfully"));
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
