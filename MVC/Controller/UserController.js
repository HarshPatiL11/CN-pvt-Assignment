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

// Select Topics for User
export const selectTopics = async (req, res) => {
  const { topics } = req.body;
  const userId = req.userId;

  try {
    // Validate inputs
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "No userId provided" });
    }
    if (!topics || !Array.isArray(topics)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid topics array provided" });
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
    const invalidTopics = topics.filter(
      (topic) => !validTopics.includes(topic)
    );

    if (invalidTopics.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid topics selected: ${invalidTopics.join(", ")}`,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await User.findByIdAndUpdate(userId, { selectedTopics: topics });
    res
      .status(200)
      .json({ success: true, message: "Topics selected successfully" });
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
