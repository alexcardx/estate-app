import { useContext } from "react";
import "./ProtectedRoute.scss";
import { AuthContext } from "../../context/AuthContext";
import { Navigate, useLocation } from "react-router";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  return (
    <>
      {user ? (
        children
      ) : (
        <Navigate to="/login" state={{ from: location }} replace />
      )}
    </>
  );
};

export default ProtectedRoute;
