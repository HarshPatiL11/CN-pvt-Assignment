import React, { useState, useEffect } from "react";
import axios from "axios";
import { Checkbox, Button, message } from "antd";
import "../../Css/AntdTable.css";
import "../../Css/selectedTopics.css";
import UserNav from "../../Layouts/UserNav";
import { useNavigate } from "react-router-dom";
import Footer from "../../Layouts/Footer";

const validTopics = [
  "Physics",
  "Chemistry",
  "Biology",
  "I.T",
  "Maths",
  "English",
  "Marathi",
];

const SelectTopics = () => {
  const navigate = useNavigate();
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [checkLogin, setCheckLogin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      message.error("Unauthorized access. Please log in.");
      navigate("/user/login");
    } else {
      setCheckLogin(true);
    }
  }, [navigate]);

  const handleCheckboxChange = (topic) => {
    if (!checkLogin) return;
    setSelectedTopics((prevSelected) => {
      if (prevSelected.includes(topic)) {
        return prevSelected.filter((t) => t !== topic);
      } else {
        return [...prevSelected, topic];
      }
    });
  };

  const handleSubmit = async () => {
    if (!checkLogin) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:8000/api/users/topic/select",
        { topics: selectedTopics },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        message.success(response.data.message);
        setSelectedTopics([]);
        navigate("/user/topics");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error(
        error.response ? error.response.data.message : "An error occurred"
      );
    }
  };

  return (
    <>
      <UserNav />
      <div className="main-SelectTopicsContainer">
        <div className="SelectTopicsContainer">
          <div className="SelectTopicsBody">
            <h1>Select Topics</h1>
            {checkLogin ? (
              <>
                <div className="checkbox-container">
                  {validTopics.map((topic) => (
                    <Checkbox
                      key={topic}
                      checked={selectedTopics.includes(topic)}
                      onChange={() => handleCheckboxChange(topic)}
                    >
                      {topic}
                    </Checkbox>
                  ))}
                </div>
                <Button
                  className="select-topics-btn"
                  type="primary"
                  onClick={handleSubmit}
                  disabled={selectedTopics.length === 0}
                >
                  Submit
                </Button>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SelectTopics;
