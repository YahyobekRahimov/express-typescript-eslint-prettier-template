import cors from "cors";

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

// Configure allowed origins
export const allowedOrigins = [
  "http://localhost:5173", // Example: Your local frontend
  "http://localhost:5174", // Example: Your local frontend
  "http://localhost:3000", // Example: Your local development
  "http://localhost:3001", // Example: Your local development
  // Add more origins as needed
  "https://yahyobek.com",
  "https://blog.yahyobek.com",
];
