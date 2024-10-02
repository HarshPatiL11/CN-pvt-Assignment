import React from "react";
import { useLocation } from "react-router-dom";
import { Card, List, Typography } from "antd";

const ScorePage = () => {
  const location = useLocation();
  const { score, submittedAnswers, questions } = location.state || {};

  if (!location.state) {
    return <div>No score data available.</div>; // Handle case where no data is available
  }

  return (
    <div className="score-container">
      <h1>Your Score: {score}</h1>
      <List
        bordered
        dataSource={submittedAnswers}
        renderItem={({ questionId, answer }) => {
          const question = questions.find((q) => q._id === questionId);
          return (
            <List.Item>
              <Card style={{ width: "100%" }}>
                <Typography.Title level={5}>
                  {question.questionText}
                </Typography.Title>
                <p>Your Answer: {answer}</p>
                <p>Correct Answer: {question.correctAnswer}</p>
              </Card>
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default ScorePage;
