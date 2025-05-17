import { FiAlertTriangle } from "react-icons/fi";
import { Link } from "react-router";
import "./NotFound.scss";

const NotFound = () => {
  return (
    <div className="not-found">
      <FiAlertTriangle className="not-found-icon" />
      <h1 className="not-found-title">Page Not Found</h1>
      <p className="not-found-subtitle">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="not-found-button">
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
