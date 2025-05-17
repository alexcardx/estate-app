import { createRoot } from "react-dom/client";
import router from "./router.jsx";
import { RouterProvider } from "react-router";
import AuthProvider from "./context/AuthProvider.jsx";
import SocketContextProvider from "./context/SocketProvider.jsx";
import "./index.scss";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <SocketContextProvider>
      <RouterProvider router={router} />
    </SocketContextProvider>
  </AuthProvider>
);
