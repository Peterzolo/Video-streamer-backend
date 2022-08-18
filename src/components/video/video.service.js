

import { saveVideoPayload } from "./video.dao.js";

export const createVideo = async (args) => {
  const savedVideoPayload = await saveVideoPayload(args);
  return savedVideoPayload;
};
