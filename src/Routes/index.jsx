import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
export const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/register", element: <Signup /> },
  { path: "/home", element: <Home /> },
]);
