// server/server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";

import authRoutes from "./routes/auth.js";
import characterRoutes from "./routes/characters.js";
import worldRoutes from "./routes/worlds.js";

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "character_background_generator",
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/auth", authRoutes);
app.use("/characters", characterRoutes);
app.use("/worlds", worldRoutes);

app.get("/", (req, res) => {
  res.send("Character Background Generator API is running");
});

app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
