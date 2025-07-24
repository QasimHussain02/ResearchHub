// Update your src/Routes/index.jsx with this content

import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import CreatePost from "../pages/CreatePost";
import Profile from "../pages/Profile";
import People from "../pages/People";
import Messages from "../pages/Messages";
import SearchResults from "../pages/SearchResults";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Signup />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/create-post",
    element: <CreatePost />,
  },
  {
    path: "/my-profile",
    element: <Profile />,
  },
  {
    path: "/profile/:uid",
    element: <Profile />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/people",
    element: <People />,
  },
  {
    path: "/messages",
    element: <Messages />,
  },
  // New search route
  {
    path: "/search",
    element: <SearchResults />,
  },
]);
