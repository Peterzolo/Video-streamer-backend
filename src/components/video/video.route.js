import express from "express";
const videoRouter = express.Router();

import {
  addVideo,
  addView,
  deleteVideo,
  editVideo,
  getAllVideos,
  getByTag,
  getOneVideo,
  randomVideos,
  searchVideos,
  trendingVideos,
  videosBySubscriber,
} from "./video.controller.js";
import { protect } from "../../middleware/auth2.js";

videoRouter.post("/create", protect, addVideo);
videoRouter.get("/fetch-all", getAllVideos);
videoRouter.get("/fetch-one/:id", getOneVideo);
videoRouter.put("/edit/:id", protect, editVideo);
videoRouter.delete("/remove/:id", protect, deleteVideo);
videoRouter.put("/view/:id", addView);
videoRouter.get("/random", randomVideos);
videoRouter.get("/trend", trendingVideos);
videoRouter.get("/sub", protect, videosBySubscriber);
videoRouter.get("/tags", getByTag);
videoRouter.get("/search", searchVideos);

export default videoRouter;
