import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify"; // Ensure toast is imported
import { Table } from "antd";
import "../../Css/QuestionTable.css";
import AdmNav from "../../Layouts/AdminNav";
import Footer from "../../Layouts/Footer";

const ViewQuestionsBYTopicAdmin = () => {
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

  const { topic } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          ` https://quizinator-4whc.onrender.com/api/questions/${topic}/Admin`,
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
  }, [topic, token]);

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
  ];

  const dataSource = questions.map((question) => ({
    key: question._id,
    questionText: question.questionText,
    options: question.options,
    correctAnswer: question.correctAnswer,
  }));

  return (
    <>
      <AdmNav />
      <div className="main-container">
        <div className="table-container">
          <h1>Questions for {topic}</h1>
          {questions.length > 0 ? (
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={{ pageSize: 4 }} // Show 4 questions per page
              scroll={{ y: 400 }} // Make the table scrollable with 400px height
            />
          ) : (
            <p>No questions available for this topic.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ViewQuestionsBYTopicAdmin;
