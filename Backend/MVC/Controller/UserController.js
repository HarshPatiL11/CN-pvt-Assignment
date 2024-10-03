import User from "../Model/UserModel.js";
import { comparePassword, hashPassword } from "../Helpers/AuthHelper.js";
import jwt from "jsonwebtoken";
import Question from "../Model/Questions.js"; // Import the Question model

// Register a new user
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validate inputs
    if (!name || typeof name !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Enter a valid Name" });
    }
    if (!email || typeof email !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Enter a valid Email" });
    }
    if (!password || typeof password !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Enter a valid Password" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Error in registerUser API:", error);
    return res.status(500).json({
      success: false,
      message: "Error in registerUser API",
      error: error.message,
    });
  }
};

// Email validation API
export const validateEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(409)
        .json({ success: false, message: "Email already registered" });
    }
    res.status(200).json({ success: true, message: "Email available" });
  } catch (error) {
    console.error("Error in validateEmail API:", error);
    return res.status(500).json({
      success: false,
      message: "Error in ValidateEmail API",
      error: error.message,
    });
  }
};

// User login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || typeof email !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Enter a valid Email" });
    }
    if (!password || typeof password !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Enter a valid Password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "4h" }
    );
    user.password = undefined;

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      user,
    });
  } catch (error) {
    console.error("Error in loginUser API:", error);
    return res.status(500).json({
      success: false,
      message: "Error in loginUser API",
      error: error.message,
    });
  }
};

// Admin login
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate email and password input
    if (!email || typeof email !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Enter a valid Email" });
    }
    if (!password || typeof password !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Enter a valid Password" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if the user is an admin
    if (!user.isAdmin) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Access denied. Only admins can log in.",
        });
    }

    // Compare passwords
   
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "4h" }
    );
    user.password = undefined;

    // Return success response with the token
    return res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
      token,
      user,
    });
  } catch (error) {
    console.error("Error in loginAdmin API:", error);
    return res.status(500).json({
      success: false,
      message: "Error in loginAdmin API",
      error: error.message,
    });
  }
};

// get UserByToken
export const getUserBytoken = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).send({ success: false, message: "No UserId" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).send({ success: false, message: "No user" });
    }
    user.password = undefined;
    res
      .status(200)
      .send({ succcess: true, message: "user Found", user });
  } catch (error) {
    error;
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error in get userByID API ",
      error,
    });
  }
};


// get UserTypeByToken
export const getUserTypeBytoken = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).send({ success: false, message: "No UserId" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).send({ success: false, message: "No user" });
    }
    res
      .status(200)
      .send({ succcess: true, message: "user Found", isAdmin: user.isAdmin });
  } catch (error) {
    error;
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error in get userByID API ",
      error,
    });
  }
};


// Select Topics for User
export const selectTopics = async (req, res) => {
  const { topics } = req.body;
  const userId = req.userId;

  try {
    // Validate inputs
    if (!userId) {
      return res.status(400).json({ success: false, message: "No userId provided" });
    }
    if (!topics || !Array.isArray(topics)) {
      return res.status(400).json({ success: false, message: "Invalid topics array provided" });
    }

    // Check if selected topics are valid
    const validTopics = [
      "Physics",
      "Chemistry",
      "Biology",
      "I.T",
      "Maths",
      "English",
      "Marathi",
    ];
    const invalidTopics = topics.filter((topic) => !validTopics.includes(topic));

    if (invalidTopics.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid topics selected: ${invalidTopics.join(", ")}`,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Get existing topics
    const existingTopics = user.selectedTopics || [];

    // Update selected topics by adding/removing from existing topics
    const updatedTopics = [...new Set([...existingTopics, ...topics])]; // Merge and remove duplicates

    await User.findByIdAndUpdate(userId, { selectedTopics: updatedTopics });
    res.status(200).json({ success: true, message: "Topics selected successfully", selectedTopics: updatedTopics });
  } catch (error) {
    console.error("Error in selectTopics API:", error);
    return res.status(500).json({
      success: false,
      message: "Error in selectTopics API",
      error: error.message,
    });
  }
};


// Get selected topics of a user
export const getUserSelectedTopics = async (req, res) => {
  const userId = req.userId;

  try {
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    // Find the user by ID
    const user = await User.findById(userId).select("selectedTopics");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      selectedTopics: user.selectedTopics,
      message: "Selected topics fetched successfully",
    });
  } catch (error) {
    console.error("Error in getUserSelectedTopics API:", error);
    return res.status(500).json({
      success: false,
      message: "Error in getUserSelectedTopics API",
      error: error.message,
    });
  }
};

// Get score list by topic
export const getScoreListByTopic = async (req, res) => {
  const { topic } = req.params;

  try {
    // Validate topic input
    const validTopics = [
      "Physics",
      "Chemistry",
      "Biology",
      "I.T",
      "Maths",
      "English",
      "Marathi",
    ];
    if (!topic || typeof topic !== "string" || !validTopics.includes(topic)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid topic provided" });
    }

    // Fetch users who have selected this topic and have scores
    const users = await User.find({ selectedTopics: topic }, "name score");

    // Check if users exist
    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No scores found for topic: ${topic}`,
      });
    }

    res.status(200).json({
      success: true,
      scores: users,
      message: `Score list for the topic "${topic}" fetched successfully`,
    });
  } catch (error) {
    console.error("Error in getScoreListByTopic API:", error);
    return res.status(500).json({
      success: false,
      message: "Error in getScoreListByTopic API",
      error: error.message,
    });
  }
};

// Get selected topics and scores of a user
export const getUserSelectedTopicsWithScores = async (req, res) => {
  const userId = req.userId;

  try {
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    // Find the user by ID
    const user = await User.findById(userId).select("selectedTopics scores");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const selectedTopicsWithScores = user.selectedTopics.map((topic) => ({
      topic,
      score: user.scores.get(topic) || 0,
    }));

    return res.status(200).json({
      success: true,
      selectedTopics: selectedTopicsWithScores,
      message: "Selected topics and scores fetched successfully",
    });
  } catch (error) {
    console.error("Error in getUserSelectedTopics API:", error);
    return res.status(500).json({
      success: false,
      message: "Error in getUserSelectedTopics API",
      error: error.message,
    });
  }
};


export const logout = async (req, res) => {
  try {
    // Clear the user's token from the client-side (not done here, but instruct on the client side)
    // If you store any session information, clear it here.

    res.status(200).send({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error in logout API",
      error,
    });
  }
};


export const submitAnswers = async (req, res) => {
  const { submittedAnswers, topic } = req.body; // Extract topic from request body
  const userId = req.userId; // Extract user ID from the request

  try {
    // Calculate the score based on submitted answers
    let score = 0;

    // Fetch questions based on submitted answers
    const questions = await Question.find({
      _id: { $in: submittedAnswers.map((ans) => ans.questionId) },
    });

    submittedAnswers.forEach((answer) => {
      const question = questions.find(
        (q) => q._id.toString() === answer.questionId
      );
      if (question && answer.answer === question.correctAnswer) {
        score += 1; // Increment score for correct answers
      }
    });

    // Update user's scores in the database
    await User.findByIdAndUpdate(userId, {
      $set: { [`scores.${topic}`]: score },
    }); // Update user score for the specific topic

    res
      .status(200)
      .json({ success: true, score, message: "Score updated successfully." });
  } catch (error) {
    console.error("Error in submitAnswers:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error updating score.",
        error: error.message,
      });
  }
};