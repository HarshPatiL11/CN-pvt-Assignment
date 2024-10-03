import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "antd";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import "../../Css/AntdTable.css";
import AdmNav from "../../Layouts/AdminNav";
import Footer from "../../Layouts/Footer";
import { toast } from "react-toastify"; // Ensure toast is imported
import axios from "axios"; 
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
    <>
      <AdmNav />
      <div className="main-container">
        <div className="table-container">
          <h1>Quiz Topics</h1>
          <Table columns={columns} dataSource={dataSource} pagination={false} />
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default TopicsPage;
