import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoginPage from "./Components/Pages/User/Login.jsx";
import Register from "./Components/Pages/User/Register.jsx";
import UserHome from "./Components/Pages/User/UserHome.jsx";
import AddQuestion from "./Components/Pages/Admin/AddQuestion.jsx";
import ViewQuestionsBYTopicAdmin from "./Components/Pages/Admin/ViewQuestionsBYTopicAdmin.jsx";
import ViewAllQuestions from "./Components/Pages/Admin/ViewAllQuestions.jsx";
import TopicsPage from "./Components/Pages/Admin/TopicsPage.jsx";
import AdminHome from "./Components/Pages/Admin/AdminHome.jsx";
import SelectTopics from "./Components/Pages/User/SelectTopic.jsx";
import UserTopics from "./Components/Pages/User/UserTopics.jsx";
import ViewQuestionsBYTopic from "./Components/Pages/User/ViewQuestionbyTopic.jsx";
import ScorePage from "./Components/Pages/User/ScorePage.jsx";
import AdminLoginPage from "./Components/Pages/Admin/AdminLogin.jsx";

// Define routes using createBrowserRouter
const router = createBrowserRouter([
  { path: "/", element: <UserHome /> },
  { path: "/user/login", element: <LoginPage /> },
  { path: "/user/register", element: <Register /> },
  { path: "/user/select-topics", element: <SelectTopics /> },
  { path: "/user/topics", element: <UserTopics /> },
  { path: "/user/questions/:topic", element: <ViewQuestionsBYTopic /> },
  { path: "/user/score", element: <ScorePage /> },


  // Admin Routes
  { path: "/admin", element: <AdminLoginPage /> },
  // { path: "/admin/home", element: <AdminHome /> },
  { path: "/admin/questions/:topic", element: <ViewQuestionsBYTopicAdmin /> },
  { path: "/admin/topics", element: <TopicsPage /> },
  { path: "/admin/question/add", element: <AddQuestion /> },
  { path: "/admin/question/viewALL", element: <ViewAllQuestions /> },
]);

createRoot(document.getElementById("root")).render(
  <>
    <RouterProvider router={router} />
    <ToastContainer />
  </>
);
