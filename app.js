import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.use(cookieParser());

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173"; // set to your Vite origin

// CORS options
const corsOptions = {
  origin: FRONTEND_ORIGIN,       // must be the exact origin when using credentials
  credentials: true,             // allow cookies (HttpOnly) to be sent
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  // preflightContinue: false,
};



// middlewares
app.use(cors(corsOptions));


import { userRouter } from "./src/routes/user.route.js";


app.use("/api/v1/users",userRouter);

// after routes
app.use((err, req, res, next) => {
  console.log("error middleware is called;")
  console.error(err); // server logs

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Consistent JSON shape for APIs
  if (req.originalUrl?.startsWith("/api")) {
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      // you can include stack in non-production if you want:
      // ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
    });
  }

  // fallback for non-API routes
  res.status(statusCode).send(message);
});

export {app}