import { Router } from "express";

import {
  getVideoById,
  publishAVideo,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
} from "../controllers/video.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/publish-video")
  .post(
    verifyJWT,
    upload.fields([{ name: "videoFile", maxCount: 1 }]),
    publishAVideo
  );

router.route("/c/:videoId").get(getVideoById);
router.route("/update/c/:videoId").post(verifyJWT, updateVideo);
router.route("/delete/c/:videoId").delete(verifyJWT, deleteVideo);
router
  .route("/toggle-publish-status/c/:videoId")
  .post(verifyJWT, togglePublishStatus);
export default router;
