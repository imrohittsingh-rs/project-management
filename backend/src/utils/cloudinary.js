import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./api-error.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) throw new ApiError(400, "File is required");

    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      folder: "Projectub/avatars",
      resource_type: "image",
    });

    // Delete temporary file after successful upload
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return uploadResult;
  } catch (error) {
    // Delete temporary files if uploads fails
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    throw new ApiError(500, "Failed to upload on cloudinary");
  }
};

export default uploadOnCloudinary;
