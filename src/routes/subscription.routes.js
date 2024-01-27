import { Router } from "express";

import {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/toggle-subscription/c/:channelId")
  .post(verifyJWT, toggleSubscription);
router
  .route("/channel-subscribers/c/:channelId")
  .get(verifyJWT, getUserChannelSubscribers);
router
  .route("/subscribed-channels/c/:subscriberId")
  .get(verifyJWT, getSubscribedChannels);

export default router;
