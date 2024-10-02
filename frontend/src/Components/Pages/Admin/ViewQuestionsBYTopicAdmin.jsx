import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Table } from "antd";
import "../../Css/AntdTable.css";

const ViewQuestionsBYTopicAdmin = () => {
  const { topic } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/questions/${topic}/Admin`,
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const columns = [
    {
      title: "Question",
      dataIndex: "questionText",
      key: "questionText",
    },
    {
      title: "Options",
      dataIndex: "options",
      key: "options",
      render: (options) => (
        <ul>
          {options.map((option, index) => (
            <li key={index}>{option}</li>
          ))}
        </ul>
      ),
    },
    {
      title: "Correct Answer",
      dataIndex: "correctAnswer",
      key: "correctAnswer",
    },
  ];

  const dataSource = questions.map((question) => ({
    key: question._id,
    questionText: question.questionText,
    options: question.options,
    correctAnswer: question.correctAnswer,
  }));

  return (
    <div className="table-container">
      <h1>Questions for {topic}</h1>
      {questions.length > 0 ? (
        <Table columns={columns} dataSource={dataSource} pagination={false} />
      ) : (
        <p>No questions available for this topic.</p>
      )}
    </div>
  );
};

export default ViewQuestionsBYTopicAdmin;
