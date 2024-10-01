import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    selectedTopics: {
      type: [String],
      default: [],
    },
    // Track score per topic
    scores: {
      type: Map, // This stores scores as key-value pairs (topic -> score)
      of: Number, // The value will be the score for the topic
      default: {},
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
