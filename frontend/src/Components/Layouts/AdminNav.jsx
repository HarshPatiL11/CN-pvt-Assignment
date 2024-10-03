import React, { useState, useRef } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { GrClose } from "react-icons/gr";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../Css/Navbar.css";
import { FaUser } from "react-icons/fa";
import axios from "axios";

const AdmNav = () => {
  const navbar = useRef();
  const [hamburger, setHamburger] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  function onMenuClick() {
    navbar.current.classList.toggle("responsive");
    setHamburger(!hamburger);
  }

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const handleLogout = async () => {
    try {
      await axios.post(
        "/api/v1/users/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use the correct token here
          },
        }
      );
      console.log("User logged out successfully.");
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem("token"); // Ensure you remove the token
      navigate("/admin"); // Redirect to login
    }
  };

  return (
    <div className="page-header">
      <div className="logo">
        <Link to="/admin/topics">
          <p className="LogoP">ADMIN</p>
        </Link>
      </div>
      <a id="menu-icon" className="menu-icon" onClick={onMenuClick}>
        {hamburger ? <GrClose size={30} /> : <GiHamburgerMenu size={30} />}
      </a>

      <div id="navigation-bar" className="nav-bar" ref={navbar}>
        <Link to="/admin/topics">Topics</Link>
        <Link to="/admin/question/add">Add Questions</Link>
        <Link to="/admin/question/viewALL">All Questions</Link>
        {isLoggedIn ? (
          <>
            <Link onClick={handleLogout}>Logout</Link>
          </>
        ) : (
          <Link to="/admin">
            <FaUser style={{ marginRight: "5px" }} />
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default AdmNav;
