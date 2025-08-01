import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import CreatePost from "../pages/CreatePost";
import Profile from "../pages/Profile";
import People from "../pages/People";
import Messages from "../pages/Messages";
import SearchResults from "../pages/SearchResults";
import PublicFeed from "../pages/PublicFeed"; // Import the new component

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicFeed />, // New public landing page
  },
  {
    path: "/login",
    element: <Login />, // Moved from root to /login
  },
  {
    path: "/register",
    element: <Signup />,
  },
  {
    path: "/home",
    element: <Home />, // Authenticated users home page
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
  {
    path: "/search",
    element: <SearchResults />,
  },
]);
