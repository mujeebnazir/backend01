import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const { subscriberId } = req.user?._id;

  if (!channelId && !subscriberId) {
    throw new ApiError(404, "Channelid and subscriberid both required");
  }
  // TODO: toggle subscription
  // Check if subscription already exists
  let subscription = await Subscription.findOne({
    subscriber: subscriberId,
    channel: channelId,
  });

  let subscribed = false;

  if (!subscription) {
    // Subscription doesn't exist, create a new one
    subscription = await Subscription.create({
      subscriber: subscriberId,
      channel: channelId,
    });

    subscribed = true;
  } else {
    // Subscription exists, delete it
    await Subscription.findByIdAndDelete(subscription._id);
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscribed,
        "Subscription has been toggled successfully"
      )
    );
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  const channel = await User.findById(channelId);
  if (!channel) {
    return new ApiError(404, "Channel not found!");
  }

  const subscriberList = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriber",
      },
    },
    {
      $project: {
        username: 1,
        email: 1,
        avatar: 1,
        coverImage: 1,
      },
    },
  ]);
  if (subscriberList.length == 0) {
    throw new ApiError(404, "No subscribers found!!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscriberList,
        " Subscribers list fetched successfully"
      )
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  const user = await User.findById(subscriberId);
  if (!user) {
    return new ApiError(404, "user not found!");
  }

  const channelList = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channel",
      },
    },
    {
      $unwind: "$channel", // Unwind the array if there are multiple channels
    },
    {
      $project: {
        username: 1,
        avatar: 1,
        coverImage: 1,
      },
    },
  ]);

  if (channelList.length === 0) {
    throw new ApiError(404, "ChannelList is empty");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, channelList, "channel list fetched successfully")
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
