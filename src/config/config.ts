export const PORT = process.env.PORT ?? "3000";
export const JWT_SECRET = process.env.JWT_SECRET;
export const DB_HOST = process.env.DB_HOST ?? "localhost";
export const DB_PORT = process.env.DB_PORT ?? "5432";
export const DB_USER = process.env.DB_USER ?? "postgres";
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_NAME = process.env.DB_NAME ?? "postgres";
export const IS_DEVELOPMENT = process.env.IS_DEVELOPMENT
  ? process.env.IS_DEVELOPMENT === "true"
  : false;

// // Google OAuth
// export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// export const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
