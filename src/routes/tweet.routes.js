import { Router } from "express";
import {
  getUserTweets,
  updateTweet,
  createTweet,
  deleteTweet,
} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-tweet").post(verifyJWT, createTweet);
router.route("/user/c/:userId").get(getUserTweets);
router.route("/update/c/:tweetId").post(verifyJWT, updateTweet);
router.route("/delete/c/:tweetId").delete(verifyJWT, deleteTweet);

export default router;
