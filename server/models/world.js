import mongoose from "mongoose";

const worldSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: { type: String, required: true, trim: true, index: true },

    geography: { type: String },
    factions: { type: String },
    history: { type: String },
    lore: { type: String },

    seedData: { type: Object },
  },
  { timestamps: true }
);

export default mongoose.model("World", worldSchema);
