
import { saveCommentPayload } from "./comment.dao.js";

export const createComment = async (args) => {
  const savedCommentPayload = await saveCommentPayload(args);
  return savedCommentPayload;
};
