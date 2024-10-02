import React from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "antd";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import "../../Css/AntdTable.css";

const topics = [
  "Physics",
  "Chemistry",
  "Biology",
  "I.T",
  "Maths",
  "English",
  "Marathi",
];

const TopicsPage = () => {
  const navigate = useNavigate();

  const handleViewQuestions = (topic) => {
    navigate(`/admin/questions/${topic}`);
  };

  const columns = [
    {
      title: "Topic",
      dataIndex: "topic",
      key: "topic",
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

  const dataSource = topics.map((topic, index) => ({
    key: index,
    topic,
  }));

  return (
    <div className="table-container">
      <h1>Quiz Topics</h1>
      <Table columns={columns} dataSource={dataSource} pagination={false} />
    </div>
  );
};

export default TopicsPage;
