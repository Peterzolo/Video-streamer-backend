import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { findUserByEmail, saveUserPayload } from "./user.dao.js";
import ApiError from "../../error/ApiError.js";

export const createUser = async ({
  name,
  email,
  password,
  img,
  subscribers,
  subscribedUsers,
  fromGoogle,
  status,
}) => {
  const findUser = await findUserByEmail({ email });
  if (findUser) {
    // throw ApiError.userExist({ message: "User already exists" });
    throw ApiError.userExists({ message: "User already exists" });
  }
  const userObject = {
    name,
    email,
    password,
    img,
    subscribers,
    subscribedUsers,
    fromGoogle,
    status,
  };

  const savedUser = await saveUserPayload(userObject);

  const payload = {
    _id: savedUser._id,
    // email: savedUser.email,
  };

   const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return {
    name: savedUser.name,
    email: savedUser.email,
    img: savedUser.img,
    subscribers: savedUser.subscribers,
    subscribedUsers: savedUser.subscribedUsers,
    fromGoogle: savedUser.fromGoogle,
    _id: savedUser._id,
    token,
    status : savedUser.status
  };
};

export const signIn = async (email, password) => {
  const user = await findUserByEmail({ email });

  if (!user) {
    throw ApiError.notFound({ message: "User does not exist" });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw ApiError.wrongCredential({ message: "Wrong credential" });
  }
  if (user.status !== "active") {
    throw ApiError.notFound({ message: "User does not exist" });
  }

  const payload = {
    _id: user._id,
    // email: user.email,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return {
    name: user.name,
    lastName: user.lastName,
    email: user.email,
    _id: user._id,
    token,
  };
};
