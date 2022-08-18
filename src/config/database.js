import mongoose from "mongoose";

export const databaseConnection = async () => {
  try {
    const mongoDBCon = await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("Could not connect to database");
  }
};

// import mongoose from "mongoose"

// export const databaseConn = () => {
//  const mongoDB =   mongoose
//       .connect(process.env.MONGO_URI)
//       .then(() => {
//         console.log("Database connected");
//       })
//       .catch((err) => {
//         throw err.message;
//       });
//   };
