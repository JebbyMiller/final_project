import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import characterRoutes from "./routes/characters.js";
import worldRoutes from "./routes/worlds.js";

const app = express();

app.use(cors());
app.use(express.json());

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

export default app;
