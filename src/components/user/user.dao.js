import User from "./user.model.js";

export const findUserById = async (id) => {
  const user = await User.findById(id);
  return user;
};

export const fetchAllUsers = async () => {
  const users = await User.find({ status: "active" });
  return users;
};

export const fetchSingleUser = async (id) => {
  const user = await User.findById({ _id: id, status: "active" });
  return user;
};

export const findUserByEmail = async (email) => {
  const user = await User.findOne(email);
  return user;
};

export const saveUserPayload = async (args) => {
  const payload = await User.create(args);
  return payload;
};

export const updateUser = async (id, userId, userObj) => {
  const user = await User.findByIdAndUpdate(
    { _id: id, user: userId },
    { $set: userObj },
    { new: true }
  );
  return user;
};
export const removeUser = async (id, userId) => {
  const user = await User.findByIdAndUpdate(
    { _id: id, user: userId },
    { $set: { status: "inactive" } },
    { new: true }
  );
  return user;
};

export const updateSubscriber = async (id, query) => {
  const subscriber = await User.findByIdAndUpdate(id, query);
  return subscriber;
};

export const addSubscriber = async (id, query) => {
  const subscriber = await User.findByIdAndUpdate(id, query);
  return subscriber;
};
