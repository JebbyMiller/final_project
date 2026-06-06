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
    charClass: { type: String, required: true },

    stats: {
      str: Number,
      dex: Number,
      con: Number,
      int: Number,
      wis: Number,
      cha: Number,
    },

    backgroundText: { type: String },
    seedData: { type: Object },
  },
  { timestamps: true }
);

characterSchema.index({ name: "text", backgroundText: "text" });

export default mongoose.model("Character", characterSchema);
