import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../Css/Login.css";

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    setError({ emailError: null, passwordError: null, generalError: null });

    // Frontend validation
    if (!email && !password) {
      setError({
        emailError: "Email is required",
        passwordError: "Password is required",
      });
      // toast.error("Email & Password not Entered");
      setValid({ isEmailValid: false, isPasswordValid: false });
      return;
    } else if (!email) {
      setError({
        emailError: "Email is required",
        passwordError: "No Email to Validate Password",
      });
      toast.error("Email is Not Entered");

      setValid({ isEmailValid: false });
      return;
    } else if (email && !password) {
      setError({ passwordError: "Password is required" });
      toast.error("Password not Entered");

      setValid({ isEmailValid: true, isPasswordValid: false });
      return;
    } else if (!password) {
      setError({ passwordError: "Password is required" });
      toast.error("Password not Entered");

      setValid({ isPasswordValid: false });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/login",
        {
          email,
          password: password,
        }
      );

      const { token, user } = response.data;
      localStorage.setItem("token", token);

      setValid({
        isEmailValid: true,
        isPasswordValid: true,
      });

      // Success toast
      toast.success("Login successful!");

      if (user.isAdmin) {
        navigate("/");
      } else {
        navigate("/");
      }
    } catch (error) {
      if (error.response) {
        const errorMsg = error.response.data.message;

        if (errorMsg === "User not found") {
          toast.error("Login Falied : Incorrect Email");
          setError({
            emailError: "Email is Incorect",
            passwordError: " ",
            generalError: "Invalid email. Please check your email address.",
          });
          setValid({
            isEmailValid: false,
            isPasswordValid: false,
          });
        } else if (errorMsg === "Incorrect password. Please try again.") {
          setError({
            generalError: " ",
            passwordError: "Password is Incorect",
          });
          setValid({
            isEmailValid: true,
            isPasswordValid: false,
          });
          toast.error("Login failed : Incorect Password");
        } else {
          setError({
            generalError:
              errorMsg || "Login failed. Please check your credentials.",
            passwordError: " ",
            emailError: " ",
          });
          setValid({
            isEmailValid: false,
            isPasswordValid: false,
          });
          toast.error("Login failed. Please check your credentials. ");
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
          {/* <div className="signup-link">
            <p>
              Don't have an account? <Link to="/register">Sign up</Link>
            </p>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default LoginPage;
