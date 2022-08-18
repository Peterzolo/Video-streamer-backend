const app = express();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser"

import { componentModule } from "../src/components/index.js";

app.use(express.static("public"));

app.use(morgan("dev"));
app.use(express.json({ limit: "32mb", extended: true }));
app.use(express.urlencoded({ limit: "32mb", extended: true }));
app.use(cors());

app.use(cookieParser())

//error handler
// app.use((err, req, res, next) => {
//   const status = err.status || 500;
//   const message = err.message || "Error occured!";
//   return res.status(status).json({
//     success: false,
//     status,
//     message,
//   });
// });

app.use("/api/user", componentModule.userModule.routes);
app.use("/api/video", componentModule.videoModule.routes);
app.use("/api/comment", componentModule.commentModule.routes);

export default app;
