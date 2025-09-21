export const PORT = process.env.PORT ?? "3000";
export const JWT_SECRET = process.env.JWT_SECRET;
export const MONGO_URI = process.env.MONGO_URI;
export const IS_DEVELOPMENT = process.env.IS_DEVELOPMENT
  ? process.env.IS_DEVELOPMENT === "true"
  : false;

// Google OAuth
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
