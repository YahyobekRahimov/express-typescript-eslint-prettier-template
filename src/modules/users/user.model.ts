import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "./user.types.js";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please, provide a username"],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minLength: [8, "Password must be at least 8 characters long"],
  },
  refreshToken: {
    type: String,
  },
});

userSchema.pre("save", async function (this: IUser, next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
