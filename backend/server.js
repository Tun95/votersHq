import { createClient } from "redis";
import mongoose from "mongoose";
import cors from "cors";
import express from "express";
import path from "path";
import dotenv from "dotenv";
import morgan from "morgan";
import { Server } from "socket.io";
import { createServer } from "http";
import { fileURLToPath } from "url";

import userRouter from "./routes/userRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";
import politicalNewsRouter from "./routes/politicalNewsRoutes.js";
import electionRouter from "./routes/electionRoutes.js";
import Election from "./models/electionModels.js";
import billsRouter from "./routes/billsRoutes.js";
import generalRouter from "./routes/generalRoutes.js";

import sendEmailSmsRouter from "./routes/emailMsgRoutes.js";

// Get the equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "10mb" }));

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE",
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"
  );
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the /models directory
app.use("/api/models", express.static(path.join(__dirname, "facemodels")));

app.use("/api/upload", uploadRouter);
app.use("/api/generals", generalRouter);

app.use("/api/message", sendEmailSmsRouter);
app.use("/api/users", userRouter);
app.use("/api/political-news", politicalNewsRouter);
app.use("/api/elections", electionRouter);
app.use("/api/bills", billsRouter);

const _dirname = path.resolve();
app.use(express.static(path.join(_dirname, "/frontend/build")));
app.get("*", (req, res) =>
  res.sendFile(path.join(_dirname, "/frontend/build/index.html"))
);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

// Initialize Redis client
const redisClient = createClient({
  url: "redis://127.0.0.1:6379", // Use explicit IPv4 address
});

// Handle connection events
redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

// Connect to Redis
try {
  await redisClient.connect();
} catch (err) {
  console.error("Failed to connect to Redis:", err);
}

export { redisClient };

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Namespace for elections
const electionsNamespace = io.of("/elections");
electionsNamespace.on("connection", (socket) => {
  console.log("A user connected to elections namespace");

  // Handle events and initial data loading if necessary
});

// Handle Expiration Date in Real-time
const handleExpiredElections = async () => {
  try {
    const now = new Date();

    // Find and update elections that have expired
    const expiredElections = await Election.find({
      expirationDate: { $lte: now },
      status: "ongoing",
    });

    for (const election of expiredElections) {
      try {
        election.status = "concluded";
        await election.save();

        electionsNamespace.emit("electionUpdate", { election });
      } catch (saveError) {
        console.error("Error saving election:", saveError);
        // Optionally, implement a retry mechanism here
      }
    }
  } catch (error) {
    console.error("Error handling expired elections:", error);
    // Optionally, implement a retry mechanism here
  }
};

// Handle Start Date in Real-time
const handleUpcomingElections = async () => {
  try {
    const now = new Date();

    // Find and update elections that should start now
    const upcomingElections = await Election.find({
      startDate: { $lte: now },
      status: "upcoming",
    });

    for (const election of upcomingElections) {
      try {
        election.status = "ongoing";
        await election.save();

        electionsNamespace.emit("electionUpdate", { election });
      } catch (saveError) {
        console.error("Error saving election:", saveError);
        // Optionally, implement a retry mechanism here
      }
    }
  } catch (error) {
    console.error("Error handling upcoming elections:", error);
    // Optionally, implement a retry mechanism here
  }
};

// Check for expired elections and upcoming elections every minute
setInterval(() => {
  handleExpiredElections();
  handleUpcomingElections();
}, 60000);

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
