import { Router } from "express";
import {
  createTask,
  createSubTask,
  updateTask,
  updateSubTask,
  deleteTask,
  deleteSubTask,
  getTasks,
  getTaskById,
} from "../controllers/task.contollers.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  createTaskValidator,
} from "../validators/index.js";
import {
  verifyJWT,
  validateProjectPermission,
} from "../middlewares/auth.middleware.js";
import { AvailableUserRole, UserRoleEnum } from "../utils/constants.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/:projectId")
  .get(getTasks)
  .post(
    validateProjectPermission([UserRoleEnum.ADMIN, UserRoleEnum.MEMBER]),
    createTaskValidator(),
    validate,
    createTask,
  );

router.route("/:projectId/t/:taskId")
  .get(getTaskById)
  .put(
    validateProjectPermission([UserRoleEnum.ADMIN, UserRoleEnum.MEMBER]),
    createTaskValidator(),
    validate,
    updateTask,
  )
  .delete(
    validateProjectPermission([UserRoleEnum.ADMIN, UserRoleEnum.MEMBER]),
    deleteTask,
  );

router
  .route("/:projectId/t/:taskId/subtasks")

export default router;