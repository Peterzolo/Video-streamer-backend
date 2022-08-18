import express from "express";

const commentRouter = express.Router();

import {
  addComment,
  deleteComment,
  getAllComments,
  getOneComment,
} from "./comment.controller.js";
import { protect } from "../../middleware/auth2.js";

commentRouter.post("/create", protect, addComment);
commentRouter.get("/fetch-all", getAllComments);
commentRouter.get("/fetch-one/:id", getOneComment);
commentRouter.delete("/remove/:id", protect, deleteComment);


export default commentRouter;
