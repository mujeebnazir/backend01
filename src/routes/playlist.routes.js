import { Router } from "express";
import {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/create-playlist").post(verifyJWT, createPlaylist);
router.route("/user-playlist/c/:userId").get(getUserPlaylists);
router.route("/playlist/c/:playlistId").get(getPlaylistById);
router
  .route("/add/c/:videoId/playlist/c/:playlistId")
  .post(verifyJWT, addVideoToPlaylist);
router
  .route("/remove/c/:videoId/playlist/c/:playlistId")
  .post(verifyJWT, removeVideoFromPlaylist);
router
  .route("/delete-playlist/c/:playlistId")
  .delete(verifyJWT, deletePlaylist);
router.route("/update-playlist/c/:playlistId").post(verifyJWT, updatePlaylist);

export default router;
