import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    img: {
      type: String,
      default : ""
    },
    subscribers: {
      type: Number,
      default: 0,
    },
    subscribedUsers: {
      type: [String],
    },
    fromGoogle: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

// UserSchema.methods.generateAuthToken = function () {
//   const token = jwt.sign(
//     {
//       _id: this._id,
//       email: this.email,
//       firstName: this.firstName,
//       lastName: this.lastName,
//     },
//     process.env.JWTPRIVATEKEY
//   );
//   return token;
// };

UserSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }

    const hash = await bcrypt.hashSync(this.password);
    this.password = hash;

    return next();
  } catch (e) {
    return next(e);
  }
});

const User = mongoose.model("user", UserSchema);
export default User;
