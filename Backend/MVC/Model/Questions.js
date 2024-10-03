import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true,
    },
    options: [String],
    correctAnswer: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      enum: [
        "Physics",
        "Chemistry",
        "Biology",
        "I.T",
        "Maths",
        "English",
        "Marathi",
      ],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);
