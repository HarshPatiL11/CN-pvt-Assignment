import express from "express";
import {
  registerUser,
  loginUser,
  selectTopics,
  validateEmail,
  getUserSelectedTopics,
  getUserSelectedTopicsWithScores,
} from "../Controller/UserController.js";
import { authMiddle } from "../Middlewares/authMiddleware.js";
const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/validate-email", validateEmail);
userRouter.post("/login", loginUser);
userRouter.put("/topic/select",authMiddle, selectTopics);
userRouter.get("/topics/selected", authMiddle, getUserSelectedTopics);
userRouter.get("/topics/selectedWithScores", authMiddle, getUserSelectedTopicsWithScores);
export default userRouter;
