import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "antd";
import "../../Css/QuestionTable.css";
import AdmNav from "../../Layouts/AdminNav";
import { useNavigate } from "react-router-dom";
import Footer from "../../Layouts/Footer";
import { toast } from "react-toastify"; // Ensure toast is imported

const ViewAllQuestions = () => {
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
          "http://localhost:8000/api/users/isadmin",
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

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        <ol className="options-list">
          {options.map((option, index) => (
            <li key={index} className="option-item">
              {String.fromCharCode(65 + index)}) {option} {/* A, B, C, D... */}
            </li>
          ))}
        </ol>
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
    <>
      <AdmNav />
      <div className="main-container">
        <div className="table-container">
          <h1>All Questions</h1>
          {questions.length === 0 ? (
            <p>No questions available</p>
          ) : (
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={{ pageSize: 3 }} // Show 3 questions per page
              scroll={{ y: 400 }} // Make the table scrollable with 400px height
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ViewAllQuestions;
