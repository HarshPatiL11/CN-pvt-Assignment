import React from "react";
import { useLocation } from "react-router-dom";
import { Table, Card, Typography } from "antd";
import UserNav from "../../Layouts/UserNav";
import "../../Css/ScorePage.css"; // New CSS file for the ScorePage component
import Footer from "../../Layouts/Footer";

const ScorePage = () => {
  const location = useLocation();
  const { score, submittedAnswers, questions, topic } = location.state || {};

  if (!location.state) {
    return <div>No score data available.</div>;
  }

  // Prepare data for the table
  const dataSource = submittedAnswers.map(({ questionId, answer }) => {
    const question = questions.find((q) => q._id === questionId);
    return {
      key: questionId,
      questionText: question.questionText,
      userAnswer: answer,
      correctAnswer: question.correctAnswer,
      isCorrect: question.correctAnswer === answer,
    };
  });

  // Define columns for the Ant Design Table
  const columns = [
    {
      title: "Question",
      dataIndex: "questionText",
      key: "questionText",
      render: (text) => <Typography.Text>{text}</Typography.Text>,
    },
    {
      title: "Correct Answer",
      dataIndex: "correctAnswer",
      key: "correctAnswer",
      render: (text) => <Typography.Text>{text}</Typography.Text>,
    },
    {
      title: "Your Answer",
      dataIndex: "userAnswer",
      key: "userAnswer",
      render: (text, record) => (
        <Typography.Text
          style={{
            backgroundColor: record.isCorrect ? "#d4edda" : "#f8d7da", // Light green for correct, light red for wrong
            display: "block",
            padding: "5px",
            borderRadius: "4px",
          }}
        >
          {text}
        </Typography.Text>
      ),
    },
  ];

  return (
    <>
      <UserNav />
      <div className="score-container">
        <Card className="glass-card">
          <Typography.Title level={2} style={{ color: 'red' }}>Topic: {topic}</Typography.Title>
          <Typography.Title level={3}  style={{ color: 'red' }}> Your Score: {score}</Typography.Title>
        </Card>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          style={{ marginTop: "20px" }}
        />
      </div>
      <Footer/>
    </>
  );
};

export default ScorePage;
