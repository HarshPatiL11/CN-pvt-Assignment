import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../Css/Login.css";
import UserNav from "../../Layouts/UserNav";
import Footer from "../../Layouts/Footer";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({
    emailError: null,
    passwordError: null,
    generalError: null,
  });

  const [valid, setValid] = useState({
    isEmailValid: false,
    isPasswordValid: false,
  });

  const navigate = useNavigate();

  const validateEmailFormat = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError((prev) => ({
      ...prev,
      [`${name}Error`]: null,
    }));

    // Validation for email and password
    if (name === "email") {
      if (!validateEmailFormat(value)) {
        setError((prev) => ({
          ...prev,
          emailError: "Please enter a valid email.",
        }));
        setValid((prev) => ({ ...prev, isEmailValid: false }));
      } else {
        setValid((prev) => ({ ...prev, isEmailValid: true }));
      }
    } else if (name === "password") {
      if (value.length < 8) {
        setError((prev) => ({
          ...prev,
          passwordError: "Password must be at least 8 characters long.",
        }));
        setValid((prev) => ({ ...prev, isPasswordValid: false }));
      } else {
        setValid((prev) => ({ ...prev, isPasswordValid: true }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    setError({ emailError: null, passwordError: null, generalError: null });

    // Frontend validation for both email and password
    let isValid = true;

    // Check email validation
    if (!email) {
      setError((prev) => ({ ...prev, emailError: "Email is required." }));
      setValid((prev) => ({ ...prev, isEmailValid: false }));
      isValid = false;
    } else if (!validateEmailFormat(email)) {
      setError((prev) => ({
        ...prev,
        emailError: "Please enter a valid email.",
      }));
      setValid((prev) => ({ ...prev, isEmailValid: false }));
      isValid = false;
    }

    // Check password validation
    if (!password) {
      setError((prev) => ({ ...prev, passwordError: "Password is required." }));
      setValid((prev) => ({ ...prev, isPasswordValid: false }));
      isValid = false;
    } else if (password.length < 8) {
      setError((prev) => ({
        ...prev,
        passwordError: "Password must be at least 8 characters long.",
      }));
      setValid((prev) => ({ ...prev, isPasswordValid: false }));
      isValid = false;
    }

    // If any field is invalid, do not proceed
    if (!isValid) return;

    try {
      const response = await axios.post(
        " https://quizinator-4whc.onrender.com/api/users/login",
        { email, password }
      );

      const { token, user } = response.data;
      localStorage.setItem("token", token);

      if (user.isAdmin) {
        navigate("/admin");
        localStorage.removeItem("token");
        toast.warning("User login only");
      } else {
        toast.success("Login successful!");
        navigate("/");
      }
    } catch (error) {
      if (error.response) {
        const errorMsg = error.response.data.message;

        if (errorMsg === "User not found") {
          toast.error("Login failed: Incorrect email");
          setError({
            emailError: "Email is incorrect.",
            passwordError: "",
            generalError: "Invalid email. Please check your email address.",
          });
          setValid({
            isEmailValid: false,
            isPasswordValid: false,
          });
        } else if (errorMsg === "Incorrect password. Please try again.") {
          setError({
            generalError: "",
            passwordError: "Password is incorrect.",
          });
          setValid({
            isEmailValid: true,
            isPasswordValid: false,
          });
          toast.error("Login failed: Incorrect password");
        } else {
          setError({
            generalError:
              errorMsg || "Login failed. Please check your credentials.",
            passwordError: "",
            emailError: "",
          });
          setValid({
            isEmailValid: false,
            isPasswordValid: false,
          });
          toast.error("Login failed. Please check your credentials.");
        }
      } else {
        setError({
          generalError: "Login failed! Please check your connection.",
        });
      }
    }
  };

  return (
    <>
      <UserNav />
      <div className="LoginContainer">
        <div className="loginHeader"></div>
        <div className="LoginBody">
          <h3>Login</h3>

          {error.generalError && (
            <div className="error-message">{error.generalError}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={
                  valid.isEmailValid
                    ? "input-valid"
                    : error.emailError
                    ? "input-invalid"
                    : ""
                }
              />
              {error.emailError && (
                <div className="error-message">{error.emailError}</div>
              )}
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={
                  valid.isPasswordValid
                    ? "input-valid"
                    : error.passwordError
                    ? "input-invalid"
                    : ""
                }
              />
              {error.passwordError && (
                <div className="error-message">{error.passwordError}</div>
              )}
            </div>
            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;
