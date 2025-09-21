import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  username: string;
  password: string;
  refreshToken?: string;
  matchPassword(password: string): Promise<boolean>;
}

export interface CreateUserDto {
  username: string;
  password: string;
}
