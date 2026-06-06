import mongoose from "mongoose";
import "dotenv/config";
import app from "./app.js";

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "character_background_generator",
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
