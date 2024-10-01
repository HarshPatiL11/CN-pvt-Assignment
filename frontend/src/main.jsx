import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

import LoginPage from "./Components/Pages/User/Login.jsx";
import Register from "./Components/Pages/User/Register.jsx";
import UserHome from "./Components/Pages/User/UserHome.jsx";
import AddQuestion from "./Components/Pages/Admin/AddQuestion.jsx";

// Define routes using createBrowserRouter
const router = createBrowserRouter([
  { path: "/", element: <UserHome /> },
  { path: "/user/login", element: <LoginPage /> },
  { path: "/user/register", element: <Register /> },
  { path: "/admin/addQuestion", element: <AddQuestion /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Provide the router configuration */}
    <RouterProvider router={router} />
    <ToastContainer />
  </StrictMode>
);
