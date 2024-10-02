import express from "express";
import {
  addQuizQuestions,
  getQuizQuestionsByTopic,
  calculateScore,
  getAllQuestions,
  getQuestionsByTokenAdmin,
} from "../Controller/QuizController.js";
import { adminMiddleware, authMiddle } from "../Middlewares/authMiddleware.js";
const QuizRouter = express.Router();

QuizRouter.post("/add", authMiddle, adminMiddleware, addQuizQuestions);
QuizRouter.get("/all", authMiddle, adminMiddleware, getAllQuestions);
QuizRouter.get(
  "/:topic/Admin",
  authMiddle,
  adminMiddleware,
  getQuestionsByTokenAdmin
);
QuizRouter.get("/:topic", getQuizQuestionsByTopic);
// QuizRouter.get("/:topic", getQuizQuestionsByTopic);
QuizRouter.post("/score",authMiddle, calculateScore);
export default QuizRouter;
