import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../Css/Login.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    userEmail: "",
    userPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState({
    nameError: null,
    emailError: null,
    passwordError: null,
    confirmPasswordError: null,
    generalError: null,
  });

  const [valid, setValid] = useState({
    isNameValid: false,
    isEmailValid: false,
    isPasswordValid: false,
    isConfirmPasswordValid: false,
  });

  const navigate = useNavigate();

  const validateEmailFormat = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const validateEmail = async (email) => {
    if (!validateEmailFormat(email)) {
      setError((prev) => ({
        ...prev,
        emailError: "Please enter a valid email.",
      }));
      setValid((prev) => ({ ...prev, isEmailValid: false }));
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/validate-email",
        { email }
      );
      if (response.status === 200) {
        setValid((prev) => ({ ...prev, isEmailValid: true }));
        setError((prev) => ({ ...prev, emailError: null }));
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setValid((prev) => ({ ...prev, isEmailValid: false }));
        setError((prev) => ({
          ...prev,
          emailError: "This email is already registered.",
        }));
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    setError((prev) => ({
      ...prev,
      [`${name}Error`]: null,
    }));

    // Validation checks for each input
    if (name === "name") {
      setValid({ ...valid, isNameValid: value.length > 0 });
    } else if (name === "userEmail") {
      if (validateEmailFormat(value)) {
        validateEmail(value);
      } else {
        setError((prev) => ({
          ...prev,
          emailError: "Please enter a valid email.",
        }));
      }
    } else if (name === "userPassword") {
      if (value.length < 8) {
        setError((prev) => ({
          ...prev,
          passwordError: "Password must be at least 8 characters long.",
        }));
        setValid({ ...valid, isPasswordValid: false });
      } else {
        setError((prev) => ({ ...prev, passwordError: null }));
        setValid({ ...valid, isPasswordValid: true });
      }
    } else if (name === "confirmPassword") {
      if (value === "") {
        setError((prev) => ({
          ...prev,
          confirmPasswordError: "Confirm Password is required.",
        }));
        setValid({ ...valid, isConfirmPasswordValid: false });
      } else if (value !== formData.userPassword) {
        setError((prev) => ({
          ...prev,
          confirmPasswordError: "Passwords do not match.",
        }));
        setValid({ ...valid, isConfirmPasswordValid: false });
      } else {
        setError((prev) => ({ ...prev, confirmPasswordError: null }));
        setValid({ ...valid, isConfirmPasswordValid: true });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({
      nameError: null,
      emailError: null,
      passwordError: null,
      confirmPasswordError: null,
      generalError: null,
    });

    const { name, userEmail, userPassword, confirmPassword } = formData;
    let isValid = true;

    // Check for required fields and validation
    if (!name) {
      setError((prev) => ({ ...prev, nameError: "Name is required." }));
      setValid((prev) => ({ ...prev, isNameValid: false }));
      isValid = false;
    }
    if (!userEmail) {
      setError((prev) => ({ ...prev, emailError: "Email is required." }));
      setValid((prev) => ({ ...prev, isEmailValid: false }));
      isValid = false;
    } else if (!validateEmailFormat(userEmail)) {
      setError((prev) => ({
        ...prev,
        emailError: "Please enter a valid email.",
      }));
      setValid((prev) => ({ ...prev, isEmailValid: false }));
      isValid = false;
    }
    if (!userPassword) {
      setError((prev) => ({
        ...prev,
        passwordError: "Password is required.",
      }));
      setValid((prev) => ({ ...prev, isPasswordValid: false }));
      isValid = false;
    } else if (userPassword.length < 8) {
      setError((prev) => ({
        ...prev,
        passwordError: "Password must be at least 8 characters long.",
      }));
      setValid((prev) => ({ ...prev, isPasswordValid: false }));
      isValid = false;
    }
    if (!confirmPassword) {
      setError((prev) => ({
        ...prev,
        confirmPasswordError: "Confirm Password is required.",
      }));
      setValid((prev) => ({ ...prev, isConfirmPasswordValid: false }));
      isValid = false;
    } else if (userPassword !== confirmPassword) {
      setError((prev) => ({
        ...prev,
        passwordError: "Passwords do not match.",
        confirmPasswordError: "Passwords do not match.",
      }));
      setValid((prev) => ({
        ...prev,
        isPasswordValid: false,
        isConfirmPasswordValid: false,
      }));
      isValid = false;
    }

    if (!isValid) return;

    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/register",
        {
          name,
          email: userEmail,
          password: userPassword,
        }
      );

      const { token } = response.data;
      localStorage.setItem("userToken", token);
      toast.success("Account Successfully Registered");
      toast.info("Please Login To Proceed Further");
      navigate("/user/login");
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError((prev) => ({
          ...prev,
          emailError: "This email is already registered.",
        }));
        setValid((prev) => ({ ...prev, isEmailValid: false }));
        toast.warning("Registered Email Detected, Please Login");
      } else {
        setError({
          generalError: "Registration failed! Please check your inputs.",
        });
      }
    }
  };

  return (
    <div className="LoginContainer">
      <div className="loginHeader"></div>
      <div className="LoginBody">
        <h3>Register</h3>

        {error.generalError && (
          <div className="error-message">{error.generalError}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={
                valid.isNameValid
                  ? "input-valid"
                  : error.nameError
                  ? "input-invalid"
                  : ""
              }
            />
            {error.nameError && (
              <div className="error-message">{error.nameError}</div>
            )}
          </div>

          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              name="userEmail"
              value={formData.userEmail}
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
              name="userPassword"
              value={formData.userPassword}
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

          <div className="input-group">
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={
                valid.isConfirmPasswordValid
                  ? "input-valid"
                  : error.confirmPasswordError
                  ? "input-invalid"
                  : ""
              }
            />
            {error.confirmPasswordError && (
              <div className="error-message">{error.confirmPasswordError}</div>
            )}
          </div>

          <button type="submit" className="login-btn">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
