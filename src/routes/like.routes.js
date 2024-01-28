import { Router } from "express";
import {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getLikedVideos,
} from "../controllers/like.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/like-video/c/:videoId").post(verifyJWT, toggleVideoLike);
router.route("/like-comment/c/:commentId").post(verifyJWT, toggleCommentLike);
router.route("/like-tweet/c/:tweetId").post(verifyJWT, toggleTweetLike);
router.route("/liked-videos").get(verifyJWT, getLikedVideos);

export default router;
