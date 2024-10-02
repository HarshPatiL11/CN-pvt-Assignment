import React, { useState, useEffect } from "react";
import axios from "axios";
import { Checkbox, Button, message } from "antd";
import "../../Css/AntdTable.css";

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
  const [selectedTopics, setSelectedTopics] = useState([]);

  // Handle checkbox change
  const handleCheckboxChange = (topic) => {
    setSelectedTopics((prevSelected) => {
      if (prevSelected.includes(topic)) {
        return prevSelected.filter((t) => t !== topic);
      } else {
        return [...prevSelected, topic];
      }
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
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
    <div className="table-container">
      <h1>Select Topics</h1>
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
        type="primary"
        onClick={handleSubmit}
        disabled={selectedTopics.length === 0}
      >
        Submit
      </Button>
    </div>
  );
};

export default SelectTopics;
