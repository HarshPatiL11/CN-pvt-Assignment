import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "antd";
import "../../Css/AntdTable.css";

const ViewAllQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/questions/all",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data && Array.isArray(response.data.questions)) {
          setQuestions(response.data.questions);
        } else {
          throw new Error("Questions data is not available");
        }
      } catch (err) {
        console.error(err);
        setError(
          err.response ? err.response.data.message : "Error fetching questions"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
    {
      title: "Topic",
      dataIndex: "topic",
      key: "topic",
    },
  ];

  const dataSource = questions.map((question) => ({
    key: question._id,
    questionText: question.questionText,
    options: question.options,
    correctAnswer: question.correctAnswer,
    topic: question.topic,
  }));

  return (
    <div className="table-container">
      <h1>All Questions</h1>
      {questions.length === 0 ? (
        <p>No questions available</p>
      ) : (
        <Table columns={columns} dataSource={dataSource} pagination={false} />
      )}
    </div>
  );
};

export default ViewAllQuestions;
