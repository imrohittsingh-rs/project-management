import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const requestHandler = async (req, res) => {
  res.status(200).json(new ApiResponse(200, { message: "Server is running" }));
};
const healthCheck = asyncHandler(requestHandler);

export { healthCheck };
