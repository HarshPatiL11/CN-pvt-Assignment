import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { message, Table } from "antd"; // Import Table from antd
import "../../Css/UserHome.css";
import "../../Css/AntdTable.css";
import UserNav from "../../Layouts/UserNav";
import Footer from "../../Layouts/Footer";

const UserHome = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the token exists; if not, navigate to login
    if (!token) {
      message.error("Unauthorized access. Please log in.");
      navigate("/user/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          " https://quizinator-4whc.onrender.com/api/users/get",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Fetch user data only if the token exists
    if (token) {
      fetchUserData();
    }
  }, [token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Check if user is defined before accessing its properties
  if (!user) {
    return <div>No user data found.</div>;
  }

  // Ensure scores is a Map to avoid errors
  const scores = user.scores instanceof Map ? user.scores : new Map();

  const { name, email, selectedTopics } = user;

  // Prepare data for Ant Design table
  const tableData = selectedTopics.map((topic) => ({
    key: topic,
    topic,
    score: scores.get(topic) || 0,
  }));

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
  ];

  return (
    <>
      <UserNav />
      <div className="home-container">
        <div className="profile-container glass-card">
          <h1 className="profile-title">Hello, {name}</h1>
          <h2 className="welcome-message">Welcome to Quizinator!</h2>

          <div className="profile-details">
            <p>
              <strong>Email:</strong> {email}
            </p>
            <h3 className="topics-title">Selected Topics:</h3>
            {selectedTopics && selectedTopics.length > 0 ? (
              <div className="topics-table">
                <Table
                  dataSource={tableData}
                  columns={columns}
                  pagination={false} 
                />
              </div>
            ) : (
              <p>No selected topics. Please select topics to begin!</p>
            )}
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default UserHome;
