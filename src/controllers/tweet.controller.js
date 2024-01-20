import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { tweet } = req.body;
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  const createdTweet = await Tweet.create({
    owner: req.user?._id,
    content: tweet,
  });
  if (!createTweet) {
    throw new ApiError(404, "Tweet not created");
  }

  res
    .status(200)
    .json(new ApiResponse(200, createTweet, "Tweet posted successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(404, "User not found");
  }
  const tweets = await Tweet.aggregate({
    $match: {
      owner: userId,
    },
  });

  if (!tweets) {
    throw new ApiError(404, "Tweets not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const { updatedTweet } = req.body;
  const { tweetId } = req.params;
  if (!updateTweet) {
    throw new ApiError(404, "updatedTweet not found");
  }

  const updateTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      $set: {
        content: updatedTweet,
      },
    },
    {
      new: true,
    }
  );

  if (!updateTweet) {
    throw new ApiError(404, "Tweet not updated!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updateTweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.params;

  if (!tweetId) {
    throw new ApiError(404, "TweetId missing");
  }

  await Tweet.findByIdAndDelete(tweetId);

  return res
    .status(200)
    .json(new ApiResponse(200, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
