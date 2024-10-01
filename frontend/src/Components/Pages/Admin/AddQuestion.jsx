import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
// import "../../Css/AddQuestion.css"; // Import your CSS file

const AddQuestion = () => {
  const [formData, setFormData] = useState({
    questionText: "",
    options: [""], // Start with one empty input for options
    correctAnswer: "",
    topic: "",
  });
  const [error, setError] = useState({
    questionError: null,
    optionsError: null,
    correctAnswerError: null,
    topicError: null,
    generalError: null,
  });
  const [valid, setValid] = useState({
    isQuestionValid: false,
    areOptionsValid: false,
    isCorrectAnswerValid: false,
    isTopicValid: false,
  });

  const handleChange = (e, index) => {
    const { name, value } = e.target;

    // Update the options array if changing an option
    if (name === "options") {
      const newOptions = [...formData.options];
      newOptions[index] = value;
      setFormData((prev) => ({
        ...prev,
        options: newOptions,
      }));

      // Clear specific error on input change
      setError((prev) => ({
        ...prev,
        optionsError: null,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear specific error on input change
      setError((prev) => ({
        ...prev,
        [`${name}Error`]: null,
      }));
    }
  };

  const addOptionField = () => {
    // Only add a new option if there are fewer than 6 options
    if (formData.options.length < 6) {
      setFormData((prev) => ({
        ...prev,
        options: [...prev.options, ""], // Add a new empty option field
      }));
    } else {
      toast.error("You can only add up to 6 options.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { questionText, options, correctAnswer, topic } = formData;

    setError({
      questionError: null,
      optionsError: null,
      correctAnswerError: null,
      topicError: null,
      generalError: null,
    });

    // Frontend validation
    if (!questionText) {
      setError((prev) => ({
        ...prev,
        questionError: "Question text is required",
      }));
      toast.error("Question text is required");
      setValid((prev) => ({ ...prev, isQuestionValid: false }));
      return;
    }

    // Validate options
    const filteredOptions = options.filter((option) => option.trim() !== ""); // Remove empty options
    if (filteredOptions.length < 2) {
      setError((prev) => ({
        ...prev,
        optionsError: "At least two options are required",
      }));
      toast.error("At least two options are required");
      setValid((prev) => ({ ...prev, areOptionsValid: false }));
      return;
    }

    if (filteredOptions.length > 6) {
      setError((prev) => ({
        ...prev,
        optionsError: "You can have a maximum of six options",
      }));
      toast.error("You can have a maximum of six options");
      setValid((prev) => ({ ...prev, areOptionsValid: false }));
      return;
    }

    if (!correctAnswer) {
      setError((prev) => ({
        ...prev,
        correctAnswerError: "Correct answer is required",
      }));
      toast.error("Correct answer is required");
      setValid((prev) => ({ ...prev, isCorrectAnswerValid: false }));
      return;
    }

    if (!topic) {
      setError((prev) => ({ ...prev, topicError: "Topic is required" }));
      toast.error("Topic is required");
      setValid((prev) => ({ ...prev, isTopicValid: false }));
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/questions/add",
        {
          questionText,
          options: filteredOptions, // Use filtered options
          correctAnswer,
          topic,
        }
      );

      toast.success("Question added successfully!");
      // Reset form after successful submission
      setFormData({
        questionText: "",
        options: [""], // Reset to one empty input
        correctAnswer: "",
        topic: "",
      });
    } catch (error) {
      const errorMsg = error.response
        ? error.response.data.message
        : "Error adding question. Please try again.";
      setError((prev) => ({ ...prev, generalError: errorMsg }));
      toast.error(errorMsg);
    }
  };

  return (
    <div className="AddQuestionContainer">
      <h3>Add Question</h3>
      {error.generalError && (
        <div className="error-message">{error.generalError}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Question Text"
            name="questionText"
            value={formData.questionText}
            onChange={handleChange}
            className={
              valid.isQuestionValid
                ? "input-valid"
                : error.questionError
                ? "input-invalid"
                : ""
            }
          />
          {error.questionError && (
            <div className="error-message">{error.questionError}</div>
          )}
        </div>

        <div className="input-group">
          <label>Options:</label>
          {formData.options.map((option, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Option ${index + 1}`}
              name="options"
              value={option}
              onChange={(e) => handleChange(e, index)}
              className={
                valid.areOptionsValid
                  ? "input-valid"
                  : error.optionsError
                  ? "input-invalid"
                  : ""
              }
            />
          ))}
          {error.optionsError && (
            <div className="error-message">{error.optionsError}</div>
          )}
          <button
            type="button"
            onClick={addOptionField}
            className="add-option-btn"
          >
            Add Option
          </button>
        </div>

        <div className="input-group">
          <input
            type="text"
            placeholder="Correct Answer"
            name="correctAnswer"
            value={formData.correctAnswer}
            onChange={handleChange}
            className={
              valid.isCorrectAnswerValid
                ? "input-valid"
                : error.correctAnswerError
                ? "input-invalid"
                : ""
            }
          />
          {error.correctAnswerError && (
            <div className="error-message">{error.correctAnswerError}</div>
          )}
        </div>

        <div className="input-group">
          <select
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            className={
              valid.isTopicValid
                ? "input-valid"
                : error.topicError
                ? "input-invalid"
                : ""
            }
          >
            <option value="">Select Topic</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
            <option value="I.T">I.T</option>
            <option value="Maths">Maths</option>
            <option value="English">English</option>
            <option value="Marathi">Marathi</option>
          </select>
          {error.topicError && (
            <div className="error-message">{error.topicError}</div>
          )}
        </div>

        <button type="submit" className="add-question-btn">
          Add Question
        </button>
      </form>
    </div>
  );
};

export default AddQuestion;
