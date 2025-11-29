import cors from "cors";

// Configure allowed origins
const allowedOrigins = [
  "http://localhost:5173", // Example: Your local frontend
  "http://localhost:5174", // Example: Your local frontend
  "http://localhost:3000", // Example: Your local development
  "http://localhost:3001", // Example: Your local development
];

// Enable CORS
const corsOptions = {
  credentials: true, // Allow credentials (cookies, authorization headers, etc)
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      callback(null, true);
      return;
    }

    console.log("CORS Origin:", origin);

    // In development, allow all origins
    if (process.env.IS_DEVELOPMENT === "true") {
      callback(null, true);
      return;
    }

    // In production, check against allowed origins
    if (!allowedOrigins.includes(origin)) {
      const msg =
        "The CORS policy for this site does not allow access from the specified Origin.";
      callback(new Error(msg), false);
      return;
    }

    callback(null, true);
  },
};

export const corsConfig = cors(corsOptions);
export { allowedOrigins };
