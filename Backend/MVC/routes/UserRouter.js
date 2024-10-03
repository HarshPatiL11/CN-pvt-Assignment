import express from "express";
import {
  registerUser,
  loginUser,
  loginAdmin,
  selectTopics,
  validateEmail,
  getUserSelectedTopics,
  getUserSelectedTopicsWithScores,
  getUserTypeBytoken,
  getUserBytoken,
  logout,
  submitAnswers,
} from "../Controller/UserController.js";
import { authMiddle } from "../Middlewares/authMiddleware.js";
const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/validate-email", validateEmail);
userRouter.post("/login", loginUser);
userRouter.post("/admin/login", loginAdmin);
userRouter.post('/logout',authMiddle,logout)
userRouter.put("/topic/select", authMiddle, selectTopics);
userRouter.get("/topics/selected", authMiddle, getUserSelectedTopics);
userRouter.get(
  "/topics/selectedWithScores",
  authMiddle,
  getUserSelectedTopicsWithScores
);
userRouter.post('/submit',authMiddle,submitAnswers)
userRouter.get("/isadmin", authMiddle, getUserTypeBytoken);
userRouter.get("/get", authMiddle, getUserBytoken);

export default userRouter;
