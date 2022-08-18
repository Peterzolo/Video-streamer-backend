import express from "express";
const userRouter = express.Router();

import {
  deleteUser,
  editUser,
  getAllUsers,
  getOneUser,
  register,
  subscribe,
  unSubscribe,
  userLogin,
} from "./user.controller.js";
import { protect } from "../../middleware/auth2.js";

userRouter.post("/register", register);
userRouter.post("/login", userLogin);
userRouter.get("/fetch-all", getAllUsers);
userRouter.get("/fetch-one/:id", getOneUser);
userRouter.put("/edit/:id", protect, editUser);
userRouter.delete("/remove/:id", protect, deleteUser);
userRouter.put("/sub/:id", protect, subscribe);
userRouter.put("/unsub/:id", protect, unSubscribe);

export default userRouter;
