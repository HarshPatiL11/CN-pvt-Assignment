import React, { useState, useRef } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { GrClose } from "react-icons/gr";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../Css/Navbar.css";
import { FaUser } from "react-icons/fa";
import axios from "axios";

const UserNav = () => {
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
        "/api/users/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("User logged out successfully.");
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem("token");
      navigate("/user/login");
    }
  };

  return (
    <div className="page-header">
      <div className="logo">
        <Link to="/">
          <p className="LogoP">Quizinator</p>
        </Link>
      </div>
      <a id="menu-icon" className="menu-icon" onClick={onMenuClick}>
        {hamburger ? <GrClose size={30} /> : <GiHamburgerMenu size={30} />}
      </a>

      <div id="navigation-bar" className="nav-bar" ref={navbar}>
        <Link to="/user/select-topics">Select Topics</Link>
        <Link to="/user/topics">View Topics</Link>
        {isLoggedIn ? (
          <>
            <Link onClick={handleLogout}>Logout</Link>
          </>
        ) : location.pathname === "/user/login" ? (
          <Link to="/user/register">
            <FaUser style={{ marginRight: "5px" }} />
            Sign-up
          </Link>
        ) : (
          <Link to="/user/login">
            <FaUser style={{ marginRight: "5px" }} />
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default UserNav;
