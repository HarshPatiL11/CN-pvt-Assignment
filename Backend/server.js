import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import colors from "colors";
import quizRoutes from "./MVC/routes/QuizRouter.js";
import userRoutes from "./MVC/routes/UserRouter.js";
import connectDb from "./config/DB.js";
import { selectTopics } from "./MVC/Controller/UserController.js";

dotenv.config();

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 
app.use(morgan("dev"));

// Database connection
connectDb();
// Routes
const router = express.Router();

// test server
app.get("/", (req, res) => {
  res.send(`<h1>hello port ${PORT}</h1>`);
});

router.use("/questions", quizRoutes);
router.use("/users", userRoutes);
app.use('/api',router)

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.green.bold.italic.bgBlack);
});
