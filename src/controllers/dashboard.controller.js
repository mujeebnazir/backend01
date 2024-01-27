import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  const { channelId } = req.user?._id;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(404, "ChannelId not valid");
  }
  const totalViewsAndVideos = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $group: {
        _id: null,
        totalViews: { $sum: "$views" },
        totalVideos: { $sum: 1 },
      },
    },
  ]);

  if (totalViewsAndVideos.length === 0) {
    throw new ApiError(
      400,
      "No views or Error found while calulating total views"
    );
  }

  const totalSubscribers = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $group: { _id: null, total: { $sum: 1 } },
    },
  ]);

  if (totalSubscribers.length === 0) {
    throw new ApiError(
      400,
      "No subscribers or Error found while calulating total subscribers"
    );
  }
  const totalLikes = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "videoLikes",
      },
    },
    {
      $group: {
        _id: null,
        totalLikes: { $sum: 1 },
      },
    },
  ]);

  if (totalLikes.length == 0) {
    throw new ApiError(
      400,
      "Error while aggregating pipeline for total likes on videos!!"
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        total_likes: totalLikes[0],
        total_subscribers: totalSubscribers[0],
        total_views_and_videos: totalViewsAndVideos,
      },
      "The dashboard information is fetched sucessfully!"
    )
  );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(404, "ChannelId not valid");
  }

  const allChannelVideos = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(channelId),
      },
    },
  ]);
  if (allChannelVideos.length === 0) {
    throw new ApiError(
      404,
      "Error while fetching all videos of the specified channel"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        allChannelVideos,
        "All videos of this channel fetched successfully"
      )
    );
});

export { getChannelStats, getChannelVideos };
