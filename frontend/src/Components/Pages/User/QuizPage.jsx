import React, { useEffect, useState } from "react";
import axios from "axios";

const QuizPage = () => {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [submittedAnswers, setSubmittedAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch the user's selected topics
    const fetchSelectedTopics = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/users/topics/selected",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.success) {
          console.log("Selected Topics:", response.data.selectedTopics); // Debugging
          setSelectedTopics(response.data.selectedTopics);
          // Now fetch questions for these topics
          fetchQuestions(response.data.selectedTopics);
        }
      } catch (error) {
        console.error("Error fetching selected topics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSelectedTopics();
  }, [token]);

  const fetchQuestions = async (topics) => {
    if (topics.length === 0) {
      console.warn("No topics selected.");
      return; // Prevent API call if no topics
    }

    try {
      const response = await axios.get(
        `http://localhost:8000/api/questions/${topics.join(",")}`
      );
      if (response.data.success) {
        setQuestions(response.data.questions);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setSubmittedAnswers({
      ...submittedAnswers,
      [questionId]: answer,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/users",
        { submittedAnswers },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        setScore(response.data.score);
      }
    } catch (error) {
      console.error("Error submitting answers:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Quiz Page</h1>
      {score !== null && <h2>Your Score: {score}</h2>}
      <form onSubmit={handleSubmit}>
        {questions.map((question) => (
          <div key={question._id}>
            <h3>{question.questionText}</h3>
            {question.options.map((option, index) => (
              <div key={index}>
                <input
                  type="radio"
                  name={question._id}
                  value={option}
                  onChange={() => handleAnswerChange(question._id, option)}
                  checked={submittedAnswers[question._id] === option}
                />
                <label>{option}</label>
              </div>
            ))}
          </div>
        ))}
        <button type="submit" className="login-btn
        ">Submit Answers</button>
      </form>
    </div>
  );
};

export default QuizPage;
