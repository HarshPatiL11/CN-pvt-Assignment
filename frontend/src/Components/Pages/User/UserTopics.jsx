import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, message } from "antd";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import axios from "axios";
import "../../Css/AntdTable.css";
import UserNav from "../../Layouts/UserNav";
import Footer from "../../Layouts/Footer";

const UserTopics = () => {
  const navigate = useNavigate();
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [checkLogin, setCheckLogin] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      message.error("Unauthorized access. Please log in.");
      navigate("/user/login");
    } else {
      setCheckLogin(true);
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchSelectedTopicsWithScores = async () => {
      try {
        const response = await axios.get(
          " https://quizinator-4whc.onrender.com/api/users/topics/selectedWithScores",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.success) {
          setSelectedTopics(response.data.selectedTopics);
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching selected topics:", error);
      }
    };

    if (checkLogin) {
      fetchSelectedTopicsWithScores();
    }
  }, [token, checkLogin]);

  const handleViewQuestions = (topic) => {
    navigate(`/user/questions/${topic}`);
  };

  const columns = [
    {
      title: "Topic",
      dataIndex: "topic",
      key: "topic",
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <MdOutlineRemoveRedEye
          size={24}
          className="icon"
          onClick={() => handleViewQuestions(record.topic)}
        />
      ),
    },
  ];

  const dataSource = selectedTopics.map((item, index) => ({
    key: index,
    topic: item.topic,
    score: item.score,
  }));

  return (
    <>
      <UserNav />
      <div className="main-container">
        <div className="table-container">
          <h1>User Quiz Topics and Scores</h1>
          {checkLogin ? (
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={false}
            />
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserTopics;
