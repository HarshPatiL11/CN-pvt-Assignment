import React from "react";
import { Link } from "react-router-dom";
import "../Css/Footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="links-div">
          <div className="footer-links">
            <Link to="#">About Us</Link>
            <Link to="#">Contact</Link>
            <Link to="#">Privacy Policy</Link>
          </div>
          <div className="footer-socials">
            <Link to="#">Facebook</Link>
            <Link to="#">Twitter</Link>
            <Link to="#">Instagram</Link>
          </div>
        </div>
        <div className="footer-copy">
          &copy; {new Date().getFullYear()} Quizinator. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
