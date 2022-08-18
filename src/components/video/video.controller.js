import {
  addSubscriber,
  allVideos,
  fetchAllVideos,
  findAndSort,
  findVideoByEmail,
  findVideoById,
  getAggregate,
  newUpdate,
  removeVideo,
  updateSubscriber,
  updateVideo,
} from "./video.dao.js";
import { createVideo } from "./video.service.js";
import ApiError from "../../error/ApiError.js";
import pkg from "mongoose";
import { findUserById } from "../user/user.dao.js";
import Video from "./video.model.js";
const { isValidObjectId } = pkg;

export const addVideo = async (req, res) => {
  const userId = req.user;
  try {
    const videoObject = { ...req.body, userId };

    const video = await createVideo(videoObject);
    res.status(200).json({
      Success: true,
      Message: "video successfully added",
      result: video,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const getAllVideos = async (req, res) => {
  try {
    const allVideos = await fetchAllVideos();
    if (!allVideos.length) {
      throw ApiError.notFound({ message: "No video found" });
    }
    res.status(200).json({
      dataCount: allVideos.length,
      success: true,
      message: "videos successfully fetched",
      result: allVideos,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOneVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await findVideoById(id);
    if (!video) {
      throw ApiError.notFound({ message: "Could't find the video" });
    }
    res.status(200).json({
      success: true,
      message: "Successfully fetched video",
      result: video,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user;
    const updateData = req.body;

    const findVideo = await findVideoById(id);

    if (userId !== findVideo.userId) {
      throw ApiError.forbidden({ message: "Sorry but you are not allowed" });
    }

    if (findVideo.status === "inactive") {
      throw ApiError.notFound({ message: "Video not found" });
    }
    const query = id;
    const user = userId;
    const update = updateData;

    let editedVideo = await updateVideo(query, user, update);

    if (!editedVideo) {
      throw ApiError.notFound({ message: "Video could not be edited" });
    }
    return res.status(200).send({
      message: "video updated successfully",
      content: editedVideo,
      success: true,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user;
    console.log("USER ID", userId);

    const findVideo = await findVideoById(id);
    console.log("FIND VIDEO", findVideo);

    if (userId !== findVideo.userId) {
      throw ApiError.forbidden({ message: "Sorry but you are not allowed" });
    }

    if (findVideo.status === "inactive") {
      throw ApiError.notFound({ message: "Video not found" });
    }
    const query = id;
    const user = userId;

    let deletedVideo = await removeVideo(query, user);

    if (!deletedVideo) {
      throw ApiError.notFound({ message: "Video could not be deleted" });
    }
    return res.status(200).send({
      message: "video deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const addView = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedView = await newUpdate(id, {
      $inc: { views: 1 },
    });
    res.status(200).json({
      message: "View has been increased",
    });
  } catch (err) {
    res.status(400).json(error.message);
  }
};

export const randomVideos = async (req, res) => {
  try {
    const videos = await getAggregate([{ $sample: { size: 10 } }]);
    res.status(200).json({
      success: true,
      message: "Successfully fetched random videos",
      videoCount: videos.length,
      result: videos,
    });
  } catch (err) {
    res.status(400).json(error.message);
  }
};

export const trendingVideos = async (req, res) => {
  try {
    const videos = await findAndSort({ views: -1 });
    res.status(200).json({
      success: true,
      message: "Videos fetched",
      videoCount: videos.length,
      videos,
    });
  } catch (err) {
    res.status(400).json(error.message);
  }
};

export const videosBySubscriber = async (req, res) => {
  const userId = req.user;
  try {
    const user = await findUserById(userId);
    const subscribedChannels = user.subscribedUsers;
    const list = await Promise.all(
      subscribedChannels.map(async (channelId) => {
        return await allVideos({ userId: channelId, status: "active" });
      })
    );

    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (err) {
    res.status(400).json(error.message);
  }
};


export const getByTag = async (req, res, next) => {
  const tags = req.query.tags.split(",");
  try {
    const videos = await allVideos({ tags: { $in: tags } });
    res.status(200).json(videos);
  } catch (err) {
    res.status(400).json(error.message);
  }
};

export const searchVideos = async (req, res) => {
  const query = req.query.q;
  try {
    const videos = await allVideos({
      title: { $regex: query, $options: "i" },
    });
    res.status(200).json(videos);
  } catch (err) {
    res.status(400).json(error.message);
  }
};