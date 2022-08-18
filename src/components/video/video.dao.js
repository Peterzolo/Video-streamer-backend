import Video from "./video.model.js";

export const findVideoById = async (id) => {
  const video = await Video.findById(id);
  return video;
};

export const fetchAllVideos = async () => {
  const videos = await Video.find({ status: "active" });
  return videos;
};



export const fetchSingleVideo = async (id) => {
  const video = await Video.findById({ _id: id, status: "active" });
  return video;
};

export const findVideoByEmail = async (email) => {
  const video = await Video.findOne(email);
  return video;
};

export const saveVideoPayload = async (args) => {
  const payload = await Video.create(args);
  return payload;
};

export const updateVideo = async (id, userId, videoObj) => {
  const video = await Video.findByIdAndUpdate(
    { _id: id, user: userId },
    { $set: videoObj },
    { new: true }
  );
  return video;
};
export const removeVideo = async (id, userId) => {
  const video = await Video.findByIdAndUpdate(
    { _id: id, user: userId },
    { $set: { status: "inactive" } },
    { new: true }
  );
  return video;
};

export const updateSubscriber = async (id, query) => {
  const subscriber = await Video.findByIdAndUpdate(id, query);
  return subscriber;
};

export const addSubscriber = async (id, query) => {
  const subscriber = await Video.findByIdAndUpdate(id, query);
  return subscriber;
};

export const newUpdate = async (id, query) => {
  const item = await Video.findByIdAndUpdate(id, query);
  return item;
};

export const getAggregate = async ([query]) => {
  const videos = await Video.aggregate([query]);
  return videos;
};

export const findAndSort = async (query) => {
  const videos = await Video.find({ status: "active" }).sort(query);
  return videos;
};

export const allVideos = async (query) => {
  const videos = await Video.find(query).limit(20);
  return videos;
};
