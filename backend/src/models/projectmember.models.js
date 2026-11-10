import mongoose, { Schema } from "mongoose";
import { UserRoleEnum, AvailableUserRole } from "../utils/constants.js";

const projectMemberSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    role: {
      type: String,
      enum: AvailableUserRole,
      default: UserRoleEnum.MEMBER,
    },
  },
  { timestamps: true },
);

projectMemberSchema.index({ user: 1, project: 1 });

export const ProjectMember = mongoose.model(
  "ProjectMember",
  projectMemberSchema,
);
