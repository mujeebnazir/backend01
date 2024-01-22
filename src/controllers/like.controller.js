import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "invalid video id");
  }

  const liked = await Like.findOne({
    video: new mongoose.Types.ObjectId(videoId),
    likedBy: new mongoose.Types.ObjectId(req.user?._id),
  });
  let videoLiked = false;

  if (!liked) {
    await Like.create({
      video: videoId,
      likedBy: req.user?._id,
    });
    videoLiked = true;
  } else {
    await Like.findByIdAndUpdate(liked?._id, {
      $unset: {
        video: 1,
      },
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, videoLiked, "VideoLike toggled"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "invalid comment id");
  }

  const liked = await Like.findOne({
    comment: new mongoose.Types.ObjectId(commentId),
    likedBy: new mongoose.Types.ObjectId(req.user?._id),
  });
  let commentLiked = false;

  if (!liked) {
    await Like.create({
      comment: commentId,
      likedBy: req.user?._id,
    });
    commentLiked = true;
  } else {
    await Like.findByIdAndUpdate(liked?._id, {
      $unset: {
        comment: 1,
      },
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, commentLiked, "CommentLike toggled"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "invalid tweet id");
  }

  const liked = await Like.findOne({
    tweet: new mongoose.Types.ObjectId(tweetId),
    likedBy: new mongoose.Types.ObjectId(req.user?._id),
  });

  let tweetLiked = false;

  if (!liked) {
    await Like.create({
      tweet: tweetId,
      likedBy: req.user?._id,
    });
    tweetLiked = true;
  } else {
    await Like.findByIdAndUpdate(liked?._id, {
      $unset: {
        tweet: 1,
      },
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tweetLiked, "tweetLike toggled"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: req.user?._id,
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "videos",
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        videoFile: 1,
        thumbnail: 1,
        owner: 1,
      },
    },
  ]);

  if (likedVideos.length == 0) {
    throw new ApiError(
      404,
      "You dont have any videos liked by yourself or their is some issue!!"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
    );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
