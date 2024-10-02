import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import axios from "axios";
import { Radio, Button, message } from "antd";
import "../../Css/AntdTable.css";

const ViewQuestionsBYTopic = () => {
  const { topic } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState({});
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
        { submittedAnswers },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        navigate("/user/score", {
          state: { score: response.data.score, submittedAnswers, questions },
        });
      } else {
        message.error("Failed to calculate score.");
      }
    } catch (err) {
      message.error("Error submitting answers. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="table-container">
      <h1>Questions for {topic}</h1>
      {questions.length > 0 ? (
        <div>
          {questions.map((question) => (
            <div key={question._id} style={{ marginBottom: "20px" }}>
              <p>{question.questionText}</p>
              <Radio.Group
                onChange={(e) =>
                  handleAnswerChange(question._id, e.target.value)
                }
                value={selectedAnswers[question._id]}
              >
                {question.options.map((option, index) => (
                  <Radio key={index} value={option}>
                    {option}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
          ))}
          <Button
            type="primary"
            onClick={handleSubmit}
            style={{ marginTop: "20px" }}
          >
            Submit Answers
          </Button>
        </div>
      ) : (
        <p>No questions available for this topic.</p>
      )}
    </div>
  );
};

export default ViewQuestionsBYTopic;
