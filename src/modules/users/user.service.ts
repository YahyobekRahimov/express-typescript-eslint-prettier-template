import User from "../../modules/users/user.model.js";
import type { CreateUserDto, IUser } from "../../modules/users/user.types.js";

export const getAllUsers = async () => {
  const users = await User.find({}, { password: 0 });
  return users;
};

export const createUser = async (userData: CreateUserDto): Promise<IUser> => {
  const newUser = new User(userData);
  await newUser.save();
  return newUser;
};

export const findOneUser = async ({
  username,
  id,
}: {
  username?: string;
  id?: string;
}): Promise<IUser | null> => {
  const user = await User.findOne({ username, id });
  return user;
};
