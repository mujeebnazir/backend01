import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video
  if ([title, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Title or description is required");
  }

  //uploading video
  const videoLocalPath = req.files?.videoFile[0]?.path;
  if (!videoLocalPath) {
    throw new ApiError(400, "videopath is required");
  }

  const videoFile = await uploadOnCloudinary(videoLocalPath);

  if (!videoFile) {
    throw new ApiError(400, "video is required");
  }

  const video = await Video.create({
    title,
    thumbnail: videoFile?.secure_url,
    description,
    videoFile: videoFile?.url,
    duration: videoFile?.duration,
    isPublished: true,
    owner: req.user?._id,
  });

  const publishedVideo = await Video.findById(video._id).select(
    "-thumbnail -duration -views"
  );

  if (!publishedVideo) {
    throw new ApiError(500, "Something went wrong while publishing a video");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, publishedVideo, "video uploaded successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id

  if (!videoId?.trim()) {
    throw new ApiError(404, "No Video ID available");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "No Video found on the given id");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully by its Id"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId?.trim()) {
    throw new ApiError(404, "No Video ID available");
  }
  const videoById = await Video.findById(videoId);
  const ownerId = videoById?.owner?.toString();

  if (!ownerId) {
    throw new ApiError(404, "owner not found");
  }
  if (req.user?._id?.toString() === ownerId) {
    const { title, description, thumbnail } = req.body;
    //TODO: update video details like title, description, thumbnail

    if (!(title || description || thumbnail)) {
      throw new ApiError(404, "Title or description or thumbnail is required");
    }

    const video = await Video.findByIdAndUpdate(
      videoId,
      {
        $set: {
          title: title,
          description: description,
          thumbnail: thumbnail,
        },
      },
      { new: true }
    ).select("-views -duration ");

    if (!video) {
      throw new ApiError(404, "No Video found on the given id");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, video, "Video updated successfully"));
  } else {
    return res
      .status(400)
      .json(new ApiResponse(400, "User dosn't have the permissions"));
  }
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  if (!videoId?.trim()) {
    throw new ApiError(404, "No Video ID available");
  }
  const videoById = await Video.findById(videoId);
  const ownerId = videoById?.owner?.toString();

  if (!ownerId) {
    throw new ApiError(404, "Owner not found");
  }
  if (req.user?._id?.toString() === ownerId) {
    await Video.deleteOne({ _id: videoId });

    return res
      .status(200)
      .json(new ApiResponse(200, "Video deleted successfully"));
  } else {
    return res
      .status(400)
      .json(new ApiResponse(400, "User dosn't have the permissions"));
  }
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId?.trim()) {
    throw new ApiError(404, "No Video ID available");
  }

  const videoById = await Video.findById(videoId);
  const ownerId = videoById?.owner?.toString();

  if (!ownerId) {
    throw new ApiError(404, "Owner not found");
  }
  if (req.user?._id?.toString() === ownerId) {
    const statusChanged = await Video.findByIdAndUpdate(
      videoId,
      {
        $set: {
          isPublished: !videoById.isPublished,
        },
      },
      { new: true }
    ).select("-views -duration ");

    if (!statusChanged) {
      throw new ApiError(400, "!status not changed");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, statusChanged, "Video status toggled successfully")
      );
  } else {
    return res
      .status(400)
      .json(new ApiResponse(400, "User dosn't have the permissions"));
  }
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
