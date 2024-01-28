import { Router } from "express";
import {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/video/c/:videoId").get(getVideoComments);
router.route("/add-comment/video/c/:videoId").post(verifyJWT, addComment);
router.route("/update-comment/c/:commentId").post(verifyJWT, updateComment);
router.route("/delete-comment/c/:commentId").delete(verifyJWT, deleteComment);

export default router;
