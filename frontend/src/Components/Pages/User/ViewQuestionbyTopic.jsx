import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Radio, Button, message, Pagination } from "antd";
import "../../Css/AntdTable.css"; // Assuming you have base CSS here
import "../../Css/ViewQuestionsBYTopic.css"; // New CSS file for this component
import UserNav from "../../Layouts/UserNav";
import Footer from "../../Layouts/Footer";

const ViewQuestionsBYTopic = () => {
  const { topic } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(1);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/questions/${topic}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data && Array.isArray(response.data.questions)) {
          setQuestions(response.data.questions);
        } else {
          setQuestions([]);
        }
      } catch (err) {
        setError("Failed to fetch questions for the selected topic.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [topic]);

  const handleAnswerChange = (questionId, answer) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    // Validation Check if all questions have been answered
    if (Object.keys(selectedAnswers).length !== questions.length) {
      message.error("Please answer all questions before submitting.");
      return;
    }

    const submittedAnswers = Object.entries(selectedAnswers).map(
      ([questionId, answer]) => ({
        questionId,
        answer,
      })
    );

    try {
      const response = await axios.post(
        `http://localhost:8000/api/questions/score`,
        { submittedAnswers, topic },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        navigate("/user/score", {
          state: { score: response.data.score, submittedAnswers, questions,topic },
        });
      } else {
        message.error("Failed to calculate score.");
      }
    } catch (err) {
      message.error("Error submitting answers. Please try again.");
    }
  };

  const handlePaginationChange = (page) => {
    setCurrentIndex(page);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const currentQuestion = questions[currentIndex - 1];

  return (
    <>
      <UserNav />

      <div className="main-view-container">
        <div className="view-questions-container">
          <h1 className="view-questions-title">Questions for {topic}</h1>
          {currentQuestion ? (
            <div className="question-card">
              <p className="question-text">
                {currentIndex}) {currentQuestion.questionText} (1 mark)
              </p>
              <Radio.Group
                onChange={(e) =>
                  handleAnswerChange(currentQuestion._id, e.target.value)
                }
                value={selectedAnswers[currentQuestion._id]}
              >
                {currentQuestion.options.map((option, index) => (
                  <Radio key={index} value={option} className="question-option">
                    {option}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
          ) : (
            <p>No questions available for this topic.</p>
          )}
          <Pagination
            current={currentIndex}
            total={questions.length}
            pageSize={1}
            onChange={handlePaginationChange}
            style={{ marginTop: "20px", textAlign: "center" }}
          />
          {questions.length > 0 && (
            <Button
              type="primary"
              onClick={handleSubmit}
              style={{ marginTop: "20px" }}
            >
              Submit Answers
            </Button>
          )}
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default ViewQuestionsBYTopic;
