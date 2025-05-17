import { createBrowserRouter } from "react-router";
import App from "./App.jsx";
import Home from "./pages/home/Home.jsx";
import SearchPosts from "./pages/searchPosts/SearchPosts.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Login from "./pages/login/Login.jsx";
import Register from "./pages/register/Register.jsx";
import NotFound from "./pages/notFoundPage/NotFound.jsx";
import Agents from "./pages/agents/Agents.jsx";
import Contact from "./pages/contact/Contact.jsx";
import About from "./pages/about/About.jsx";
import Room from "./pages/room/Room.jsx";
import ProtectedRoute from "./pages/protectedRoute/ProtectedRoute.jsx";
import UpdateUser from "./pages/updateUser/UpdateUser.jsx";
import NewPost from "./pages/newPost/NewPost.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/posts",
        Component: SearchPosts,
      },
      {
        path: "/agents",
        Component: Agents,
      },
      {
        path: "/contact",
        Component: Contact,
      },
      {
        path: "/about",
        Component: About,
      },
      {
        path: "/room/:id",
        Component: Room,
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/register",
        Component: Register,
      },
      {
        path: "*",
        Component: NotFound,
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile/update",
        element: (
          <ProtectedRoute>
            <UpdateUser />
          </ProtectedRoute>
        ),
      },
      {
        path: "/add",
        element: (
          <ProtectedRoute>
            <NewPost />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
