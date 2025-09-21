import User from "./user.model.js";
import { createUser, findOneUser, getAllUsers } from "./user.service.js";
import { checkMissingFields } from "../../utils/missing-fields-check.js";
import { generateToken } from "../../utils/token.js";
import type { NextFunction, Request, Response } from "express";
import type { CreateUserDto } from "./user.types.js";
import {
  GOOGLE_CLIENT_ID,
  // GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
} from "../../config/config.js";

export const getMe = (req: Request, res: Response) => {
  const user = req.user;

  res.status(200).json({ id: user._id, username: user.username });
};

export const getUsersRoute = async (req: Request, res: Response) => {
  const users = await getAllUsers();

  res.status(200).json(users);
};

export const register = async (req: Request, res: Response) => {
  const missingFields = checkMissingFields(["username", "password"], req.body);

  if (missingFields.length) {
    return res.status(400).json({
      message: "",
    });
  }

  const { username, password }: CreateUserDto = req.body;

  try {
    // Check if user already exists
    const user = await findOneUser({ username });
    if (user) {
      return res
        .status(400)
        .json({ message: "User with this username already exists" });
    }

    // Create a new user instance (password will be hashed by middleware)
    const newUser = await createUser({
      username: username.toLowerCase(),
      password,
    });
    // For now, just send a success message. Later you would send a JWT.
    res.status(201).json({
      message: "User registered successfully",
      userData: { id: newUser._id, username: newUser.username },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const missingFields = checkMissingFields(["username", "password"], req.body);

  if (missingFields.length) {
    return res.status(400).json({
      message: `Fields ${missingFields.join(", ")} are required`,
    });
  }

  const { username, password }: CreateUserDto = req.body;

  try {
    const user = await User.findOne({
      username: username.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const { token, expiresIn } = generateToken({
      _id: user._id,
      username: user.username,
    });

    res.status(200).json({
      message: "Login successful",
      userData: {
        id: user._id,
        username: user.username,
        token,
        expiresIn,
      },
    });
  } catch (error) {
    next(error);
    res.status(500).send(error);
  }
};

export const authenticateWithGoogle = (req: Request, res: Response) => {
  const params = {
    client_id: GOOGLE_CLIENT_ID ?? "",
    redirect_uri: GOOGLE_REDIRECT_URI ?? "",
    scope: "profile email",
    response_type: "code",
  };

  const searchParams = new URLSearchParams(params);
  const authUrl = `https://accounts.google.com/oauth/authorize?${searchParams}`;

  res.redirect(authUrl);
};

// export const handleCallback = async (req: Request) => {
//   const { code } = req.query;

//   const tokenResponse = await fetch(
//     "https://oauth2.googleapis.com/token",
//     {
//       method: "POST",
//       body: JSON.stringify({
//         client_id: GOOGLE_CLIENT_ID,
//         client_secret: GOOGLE_CLIENT_SECRET,
//         grant_type: "authorization_code",
//         redirect_uri: GOOGLE_REDIRECT_URI,
//         code,
//       }),
//     }
//   );

//   const tokenData = await tokenResponse.json();

//   const userResponse = await fetch(
//     "https://www.googleapis.com/oauth2/v2/userinfo",
//     {
//       headers: { Authorization: `Bearer ${tokenData?.access_token}` },
//     }
//   );

//   const userData = await userResponse.json();
// };
