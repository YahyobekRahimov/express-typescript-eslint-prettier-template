import { IUser } from "./modules/users/user.types.ts";

declare global {
  namespace Express {
    interface Request {
      user: IUser | null;
    }
  }
}
