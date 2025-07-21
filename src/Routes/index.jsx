import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import CreatePost from "../pages/CreatePost";
import Profile from "../pages/Profile";
export const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/register", element: <Signup /> },
  { path: "/home", element: <Home /> },
  { path: "/my-profile", element: <Profile /> },
  { path: "/profile/:uid", element: <Profile /> },
]);
