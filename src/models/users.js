import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    hashPassword: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
    },

    city: {
      type: String,
    },

    zip: {
      type: String,
    },

    photo: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpire: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;