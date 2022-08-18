import {
  addSubscriber,
  fetchAllUsers,
  findUserByEmail,
  findUserById,
  removeUser,
  updateSubscriber,
  updateUser,
} from "./user.dao.js";
import { createUser, signIn } from "./user.service.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import ApiError from "../../error/ApiError.js";

export const register = async (req, res, next) => {
  const body = req.body;
  const { token } = body;
  try {
    const userObject = {
      name: body.name,
      email: body.email,
      password: body.password,
      subscribers: body.subscribers,
      img: body.img,
      fromGoogle: body.fromGoogle,
      subscribedUsers: body.subscribedUsers,
      token: body.token,
      status: body.status,
    };
    const user = await createUser(userObject);
    const { token, ...others } = user;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({
        Success: true,
        Message: "User successfully registered",
        result: others,
      });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await signIn(email, password);
    const { token, ...others } = user;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({
        Success: true,
        Message: "User successfully registered",
        result: others,
      });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const googleAuth = async (req, res, next) => {
  const { email } = req.body;
  try {
    // const user = await User.findOne({ email: req.body.email });
    const user = await findUserByEmail({ email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT, {
        expiresIn: "1d",
      });
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(user._doc);
    } else {
      // const newUser = new User({
      //   ...req.body,
      //   fromGoogle: true,
      // });
      const newUser = await createUser({ ...req.body, fromGoogle: true });
      // const savedUser = await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT, {
        expiresIn: "1d",
      });
      res
        .cookie("accessToken", token, {
          httpOnly: true,
        })
        .status(200)
        .json({
          Success: true,
          Message: "User successfully registered",
          result: others,
        });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user;
    const updateData = req.body;

    if (userId === id) {
      const findUser = await findUserById(id);
      const hashedPassword = await bcrypt.hashSync(req.body.password, 12);

      if (req.body.password) {
        req.body.password = hashedPassword;
      }

      if (findUser.status === "inactive") {
        throw ApiError.notFound({ message: "Usaer not found" });
      }
      const query = id;
      const user = userId;
      const update = updateData;

      let editedUser = await updateUser(query, user, update);

      if (!editedUser) {
        throw ApiError.notFound({ message: "User could not be edited" });
      }
      return res.status(200).send({
        message: "event updated successfully",
        content: editedUser,
        success: true,
      });
    } else {
      throw ApiError.forbidden({ message: "Sorry you are not allowed" });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user;

    if (userId === id) {
      const findUser = await findUserById(id);
      if (findUser.status === "inactive") {
        throw ApiError.notFound({ message: "User not found" });
      }

      const query = id;
      const user = userId;

      let deletedUser = await removeUser(query, user);

      if (!deletedUser) {
        throw ApiError.notFound({ message: "User could not be deleted" });
      }
      return res.status(200).send({
        message: "user deleted successfully",
      });
    } else {
      throw ApiError.forbidden({ message: "Sorry you are not allowed" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await fetchAllUsers();
    if (!allUsers.length) {
      throw ApiError.notFound({ message: "No user found" });
    }
    res.status(200).json({
      dataCount: allUsers.length,
      success: true,
      message: "Users successfully fetched",
      result: allUsers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOneUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await findUserById(id);
    if (!user) {
      throw ApiError.notFound({ message: "Could't find the user" });
    }
    res.status(200).json({
      success: true,
      message: "Successfully fetched local event",
      result: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const subscribe = async (req, res) => {
  const { id } = req.params;
  const userId = req.user;
  try {
    await updateSubscriber(userId, {
      $push: { subscribedUsers: id },
    });
    await addSubscriber(id, {
      $inc: { subscribers: 1 },
    });
    res.status(200).json({ message: "Subscriber successfully added" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unSubscribe = async (req, res) => {
  const { id } = req.params;
  const userId = req.user;
  try {
    await updateSubscriber(userId, {
      $pull: { subscribedUsers: id },
    });
    await addSubscriber(id, {
      $inc: { subscribers: -1 },
    });
    res.status(200).json({ message: "Unsubscribe successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
