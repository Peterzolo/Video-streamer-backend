import Comment from "./comment.model.js";

export const findCommentById = async (id) => {
  const comment = await Comment.findById(id);
  return comment;
};

export const fetchAllComments = async () => {
  const comments = await Comment.find({ status: "active" });
  return comments;
};



export const fetchSingleComment = async (id) => {
  const comment = await Comment.findById({ _id: id, status: "active" });
  return comment;
};

export const findCommentByEmail = async (email) => {
  const comment = await Comment.findOne(email);
  return comment;
};

export const saveCommentPayload = async (args) => {
  const payload = await Comment.create(args);
  return payload;
};

export const updateComment = async (id, userId, CommentObj) => {
  const comment = await Comment.findByIdAndUpdate(
    { _id: id, user: userId },
    { $set: commentObj },
    { new: true }
  );
  return comment;
};
export const removeComment = async (id) => {
  const comment = await Comment.findByIdAndUpdate(
    { _id: id },
    { $set: { status: "inactive" } },
    { new: true }
  );
  return comment;
};

export const updateSubscriber = async (id, query) => {
  const subscriber = await Comment.findByIdAndUpdate(id, query);
  return subscriber;
};

export const addSubscriber = async (id, query) => {
  const subscriber = await Comment.findByIdAndUpdate(id, query);
  return subscriber;
};

export const newUpdate = async (id, query) => {
  const item = await Comment.findByIdAndUpdate(id, query);
  return item;
};

export const getAggregate = async ([query]) => {
  const comments = await Comment.aggregate([query]);
  return comments;
};

export const findAndSort = async (query) => {
  const comments = await Comment.find({ status: "active" }).sort(query);
  return comments;
};

export const allComments = async (query) => {
  const comments = await Comment.find(query).limit(20);
  return comments;
};
