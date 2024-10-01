import express from "express";
import {
  registerUser,
  loginUser,
  selectTopics,
  validateEmail,
} from "../Controller/UserController.js";
import { authMiddle } from "../Middlewares/authMiddleware.js";
const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/validate-email", validateEmail);
userRouter.post("/login", loginUser);
userRouter.use("/topic/select",authMiddle, selectTopics);

export default userRouter;
