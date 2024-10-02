import Questions from "../Model/Questions.js";
import User from "../Model/UserModel.js";

// Enum for topics
const VALID_TOPICS = [
  "Physics",
  "Chemistry",
  "Biology",
  "I.T",
  "Maths",
  "English",
  "Marathi",
];



// Add Questions
export const addQuizQuestions = async (req, res) => {
  const { questionText, options, correctAnswer, topic } = req.body;

  try {
    // Validate questionText
    if (!questionText || typeof questionText !== "string") {
      return res
        .status(400)
        .send({ success: false, message: "Enter the Question" });
    }

    // Validate options
    if (!options || !Array.isArray(options) || options.length === 0) {
      return res
        .status(400)
        .send({
          success: false,
          message: "Enter The Options for The Question",
        });
    }

    // Validate correctAnswer
    if (!correctAnswer || typeof correctAnswer !== "string") {
      return res
        .status(400)
        .send({ success: false, message: "Enter the Correct Option" });
    }

    // Validate topic
    if (!topic || !VALID_TOPICS.includes(topic)) {
      return res
        .status(400)
        .send({
          success: false,
          message: `Enter a valid Subject. Valid subjects are: ${VALID_TOPICS.join(
            ", "
          )}`,
        });
    }

    // Create new question
    const newQuestion = await Questions.create({
      questionText,
      options,
      correctAnswer,
      topic,
    });

    return res.status(201).send({
      success: true,
      message: `Successfully added question "${questionText}" for Topic "${topic}"`,
      newQuestion,
    });
  } catch (error) {
    console.error("Error in addQuizQuestions API:", error);
    return res.status(500).send({
      success: false,
      message: "Error in addQuizQuestions API",
      error: error.message,
    });
  }
};

//Get All Questions
export const getAllQuestions = async (req, res) => {
const isAdmin = req.isAdmin;

  try {

    if(!isAdmin){
      res.status(401).send({
        message:"Admin only",
        success:false
      })
    }
    const questions = await Questions.find();

    if (!questions || questions.length === 0) {
      return res.status(404).send({
        success: false,
        message: `No questions found for the Topic "${topic}"`,
      });
    }
    return res.status(200).send({
      success: true,
      questions,
      message: "Questions fetched successfully",
    });
  } catch (error) {
    console.error("Error in getAllQuestions API:", error);
    return res.status(500).send({
      success: false,
      message: "Error in getAllQuestions API",
      error: error.message,
    });
  }
};

// Get questions by topic
// // Get questions by topic
export const getQuizQuestionsByTopic = async (req, res) => {
  const { topic } = req.params;

  try {
    // Validate topic
    if (!topic) {
      return res
        .status(404)
        .send({ success: false, message: "No Topic provided" });
    }

    // Split the topics string into an array
    const topicsArray = topic.split(',');

    // Find questions for all topics
    const questions = await Questions.find({ topic: { $in: topicsArray } }).limit(10);

    if (!questions || questions.length === 0) {
      return res
        .status(404)
        .send({
          success: false,
          message: `No questions found for the provided topics`,
        });
    }

    return res.status(200).send({
      success: true,
      questions,
      message: "Questions fetched successfully",
    });
  } catch (error) {
    console.error("Error in getQuizQuestionsByTopic API:", error);
    return res.status(500).send({
      success: false,
      message: "Error in getQuizQuestionsByTopic API",
      error: error.message,
    });
  }
};
//getQuestionsByTokenAdmin


  export const getQuestionsByTokenAdmin = async (req, res) => {
    const { topic } = req.params;
    const isAdmin = req.isAdmin;
    
    try {
      if(!isAdmin){
      return res.status(401).send({success:false,message:"UnAuthorised Token"})
      }
      // Validate topic
      if (!topic || !VALID_TOPICS.includes(topic)) {
        return res
          .status(404)
          .send({ success: false, message: "Invalid or No Topic provided" });
      }

      const questions = await Questions.find({topic});

      if (!questions || questions.length === 0) {
        return res.status(404).send({
          success: false,
          message: `No questions found for the Topic "${topic}"`,
        });
      }

      return res.status(200).send({
        success: true,
        questions,
        message: "Questions fetched successfully",
      });
    } catch (error) {
      console.error("Error in getQuizQuestionsByTopic API:", error);
      return res.status(500).send({
        success: false,
        message: "Error in getQuizQuestionsByTopic API",
        error: error.message,
      });
    }
  };

// Calculate score
export const calculateScore = async (req, res) => {
  const { submittedAnswers } = req.body;
  const userId = req.userId;

  let score = 0;

  try {
    if (
      !submittedAnswers ||
      !Array.isArray(submittedAnswers) ||
      submittedAnswers.length === 0
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "submittedAnswers is required and should be a non-empty array",
        });
    }

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "userId is required" });
    }

    for (const { questionId, answer } of submittedAnswers) {
      const question = await Questions.findById(questionId);

      if (!question) {
        return res
          .status(404)
          .json({
            success: false,
            message: `Question not found for id: ${questionId}`,
          });
      }

      if (question.correctAnswer === answer) {
        score++;
      }
    }

    await User.findByIdAndUpdate(userId, { $inc: { score } });

    return res.json({
      success: true,
      message: "Score calculated successfully",
      score,
    });
  } catch (error) {
    console.error("Error in calculateScore API:", error);
    return res
      .status(500)
      .send({
        success: false,
        message: "Error in calculateScore API",
        error: error.message,
      });
  }
};
