import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "antd";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import axios from "axios";
import "../../Css/AntdTable.css";

const UserTopics = () => {
  const navigate = useNavigate();
  const [selectedTopics, setSelectedTopics] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSelectedTopicsWithScores = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/users/topics/selectedWithScores",
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

    fetchSelectedTopicsWithScores();
  }, [token]);

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
    <div className="table-container">
      <h1>User Quiz Topics and Scores</h1>
      <Table columns={columns} dataSource={dataSource} pagination={false} />
    </div>
  );
};

export default UserTopics;
