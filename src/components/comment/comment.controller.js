import {
  fetchAllComments,
  findCommentById,
  removeComment,
} from "./comment.dao.js";
import { createComment } from "./comment.service.js";
import ApiError from "../../error/ApiError.js";
import { findVideoById } from "../video/video.dao.js";

export const addComment = async (req, res) => {
  const userId = req.user;
  try {
    const commentObject = { ...req.body, userId };

    const comment = await createComment(commentObject);
    res.status(200).json({
      Success: true,
      Message: "comment successfully added",
      result: comment,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const getAllComments = async (req, res) => {
  try {
    const allComments = await fetchAllComments();
    if (!allComments.length) {
      throw ApiError.notFound({ message: "No comment found" });
    }
    res.status(200).json({
      dataCount: allComments.length,
      success: true,
      message: "comments successfully fetched",
      result: allComments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOneComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await findCommentById(id);
    if (!comment) {
      throw ApiError.notFound({ message: "Could't find the comment" });
    }
    res.status(200).json({
      success: true,
      message: "Successfully fetched comment",
      result: comment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user;

    const findComment = await findCommentById(id);
    const vId = findComment.videoId;
    const findVideo = await findVideoById(vId);
    const commentOwner = findComment.userId;
    const videoOwner = findVideo.userId;

    if (userId === commentOwner || userId === videoOwner) {
      if (findComment.status === "inactive") {
        throw ApiError.notFound({ message: "comment not found" });
      }
      const query = id;
      // const user = userId;

      let deletedComment = await removeComment(query);

      if (!deletedComment) {
        throw ApiError.notFound({ message: "comment could not be deleted" });
      }
      return res.status(200).send({
        message: "comment deleted successfully",
        success: true,
      });
    } else {
      throw ApiError.forbidden({ message: "Sorry you are not allowed" });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};
