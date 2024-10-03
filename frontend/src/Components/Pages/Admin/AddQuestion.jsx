import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

import { FaTrashAlt } from "react-icons/fa";
import "../../Css/AddQuestion.css";
import { GrPowerReset } from "react-icons/gr";
import AdmNav from "../../Layouts/AdminNav";
import Footer from "../../Layouts/Footer";

const AddQuestion = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      if (!token) {
        toast.error("Unauthorized access. Please log in.");
        navigate("/admin");
        return;
      }
      try {
        const { data } = await axios.get(
          " https://quizinator-4whc.onrender.com/api/users/isadmin",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!data.isAdmin) {
          toast.error("Unauthorized access.");
          localStorage.removeItem("token");
          navigate("/admin");
        }
      } catch (error) {
        toast.error("Error verifying admin status. Please log in.");
        navigate("/admin");
      }
    };

    checkAdmin();
  }, [navigate, token]);

  const [formData, setFormData] = useState({
    question: "",
    options: ["", ""],
    correctAnswer: "",
    topic: "",
  });

  const [error, setError] = useState({
    questionError: null,
    optionsError: null,
    correctAnswerError: null,
    generalError: null,
  });

  const [valid, setValid] = useState({
    isQuestionValid: false,
    areOptionsValid: false,
    isCorrectAnswerValid: false,
  });

  const validateFields = () => {
    let isValid = true;

    // Validate Question
    if (!formData.question) {
      setError((prev) => ({
        ...prev,
        questionError: "Question is required.",
      }));
      setValid((prev) => ({ ...prev, isQuestionValid: false }));
      isValid = false;
    } else {
      setError((prev) => ({ ...prev, questionError: null }));
      setValid((prev) => ({ ...prev, isQuestionValid: true }));
    }

    // Validate Options
    if (
      formData.options.length < 2 ||
      formData.options.length > 6 ||
      formData.options.some((opt) => opt === "")
    ) {
      setError((prev) => ({
        ...prev,
        optionsError: "Please provide between 2 and 6 valid options.",
      }));
      setValid((prev) => ({ ...prev, areOptionsValid: false }));
      isValid = false;
    } else {
      setError((prev) => ({ ...prev, optionsError: null }));
      setValid((prev) => ({ ...prev, areOptionsValid: true }));
    }

    // Validate Correct Answer
    if (!formData.correctAnswer) {
      setError((prev) => ({
        ...prev,
        correctAnswerError: "Correct answer is required.",
      }));
      setValid((prev) => ({ ...prev, isCorrectAnswerValid: false }));
      isValid = false;
    } else {
      setError((prev) => ({ ...prev, correctAnswerError: null }));
      setValid((prev) => ({ ...prev, isCorrectAnswerValid: true }));
    }

    // Validate Topic
    if (!formData.topic) {
      setError((prev) => ({
        ...prev,
        generalError: "Topic is required.",
      }));
      isValid = false;
    } else {
      setError((prev) => ({ ...prev, generalError: null }));
    }

    return isValid;
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;

    if (name === "options") {
      const updatedOptions = [...formData.options];
      updatedOptions[index] = value;
      setFormData({
        ...formData,
        options: updatedOptions,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    setError((prev) => ({
      ...prev,
      [`${name}Error`]: null,
    }));
  };

  const addOption = () => {
    if (formData.options.length < 6) {
      setFormData((prev) => ({
        ...prev,
        options: [...prev.options, ""],
      }));
    }
  };

  const removeOption = (index) => {
    const updatedOptions = [...formData.options];
    updatedOptions.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      options: updatedOptions,
    }));
  };

  const clearTopic = () => {
    setFormData((prev) => ({ ...prev, topic: "" }));
  };

  const clearForm = () => {
    setFormData({
      question: "",
      options: ["", ""],
      correctAnswer: "",
      topic: "",
    });
    setError({
      questionError: null,
      optionsError: null,
      correctAnswerError: null,
      generalError: null,
    });
    setValid({
      isQuestionValid: false,
      areOptionsValid: false,
      isCorrectAnswerValid: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    // Change to match the server expectations
    const dataToSend = {
      questionText: formData.question, // Updated key
      options: formData.options,
      correctAnswer: formData.correctAnswer, // Updated key
      topic: formData.topic,
    };

    try {
      await axios.post(
        " https://quizinator-4whc.onrender.com/api/questions/add",
        dataToSend,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Question added successfully");

      // Clear the form but keep the topic
      setFormData((prev) => ({
        ...prev,
        question: "",
        options: ["", ""],
        correctAnswer: "",
      }));
    } catch (err) {
      setError((prev) => ({
        ...prev,
        generalError: "Failed to add question. Please try again.",
      }));
    }
  };

  return (
    <>
    <AdmNav/>
      <div className="add-question-container">
        <div className="add-question-body">
          <h3>Add New Question</h3>

          {error.generalError && (
            <div className="error-message">{error.generalError}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group add-question-input-group">
              <input
                type="text"
                placeholder="Question"
                name="question"
                value={formData.question}
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

            <div className="input-group add-question-input-group">
              <label>Options:</label>
              {formData.options.map((option, index) => (
                <div key={index} className="option-input-group">
                  <input
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
                  {formData.options.length > 2 && (
                    <FaTrashAlt
                      className="trash-icon"
                      onClick={() => removeOption(index)}
                    />
                  )}
                </div>
              ))}
              {error.optionsError && (
                <div className="error-message">{error.optionsError}</div>
              )}
              <button
                type="button"
                className="add-question-btn"
                onClick={addOption}
              >
                Add Option
              </button>
            </div>

            <div className="input-group add-question-input-group">
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

            <div className="input-group add-question-input-group">
              <select
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                className={`topic-select ${
                  formData.topic ? "input-valid" : ""
                }`}
              >
                <option value="">Select a Topic</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="I.T">I.T</option>
                <option value="Maths">Maths</option>
                <option value="English">English</option>
                <option value="Marathi">Marathi</option>
              </select>
              <button
                type="button"
                className="clear-topic-btn"
                onClick={clearTopic}
              >
                Clear Topic
              </button>
            </div>

            <button type="submit" className="add-question-submit-btn">
              Add Question
            </button>
            <button
              type="button"
              className="add-question-submit-btn"
              onClick={clearForm}
            >
              <GrPowerReset />
            </button>
          </form>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default AddQuestion;
