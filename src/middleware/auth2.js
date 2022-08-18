import jwt from "jsonwebtoken";
import ApiError from "../error/ApiError.js";
import { createError } from "../error/error.js";
// import { createError } from "./error.js";

// export const protect = async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     try {
//       token = req.headers.authorization.split(" ")[1];

//       if (!token) {
//         // throw ApiError.forbidden({ message: "Token not provided" });
//        res.json({message : "You are not authenticated"})
//       } else {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded?._id;
//         next();
//       }
//     } catch (error) {
//       res.status(401).json(error.message);
//     }
//   }else{
//     res.json({message : "No header provided"})
//   }
// };
export const protect = async (req, res, next) => {
  let token = req.cookies.access_token;
  try {
    if (!token) {
      res.json({ message: "No token provided" });
    } else {
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.json({ message: "Invalid token" });
        req.user = user?._id;
        console.log("USER", user._id);
        next();
      });
    }
  } catch (error) {
    res.json(error);
  }
};
