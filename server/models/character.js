import mongoose from "mongoose";

const characterSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: { type: String, required: true, trim: true, index: true },
    race: { type: String, required: true },
    class: { type: String, required: true },

    stats: {
      str: Number,
      dex: Number,
      con: Number,
      int: Number,
      wis: Number,
      cha: Number,
    },

    backgroundText: { type: String },

    // Optional: store the raw AI prompt or seed data
    seedData: { type: Object },
  },
  { timestamps: true }
);

export default mongoose.model("Character", characterSchema);
