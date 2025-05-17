import { useEffect, useState } from "react";
import "./Register.scss";
import { Link, useNavigate } from "react-router";
import bg from "../../assets/bg.png";
import apiRequest from "../../api/axios";
import ImageUploader from "../../components/imageUploader/ImageUploader";
import noavatar from "../../assets/noavatar.png";

const Register = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState({ username: "", password: "", email: "" });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await apiRequest.post("/auth/register", {
        username: query.username,
        email: query.email,
        password: query.password,
      });

      navigate("/login");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [error]);

  return (
    <div className="register">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Creating a new account</h1>
          <input
            name="username"
            required
            minLength={3}
            maxLength={20}
            type="text"
            placeholder="Username"
            value={query.username}
            onChange={(e) =>
              setQuery((prev) => {
                return { ...prev, username: e.target.value };
              })
            }
          />
          <input
            name="email"
            type="text"
            placeholder="Email"
            value={query.email}
            onChange={(e) =>
              setQuery((prev) => {
                return { ...prev, email: e.target.value };
              })
            }
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            value={query.password}
            onChange={(e) =>
              setQuery((prev) => {
                return { ...prev, password: e.target.value };
              })
            }
          />
          <div className="upload-avatar">
            <img
              src={query.avatar || noavatar}
              alt="noavatar"
              className="avatar"
            ></img>
            <ImageUploader uploadImage={setQuery} text={"Upload Avatar"} />
          </div>
          <button className="register-button" disabled={isLoading}>
            Register
          </button>
          {error && (
            <div className="error">
              <span className="icon">❗</span>
              <span>{error}</span>
              <button className="close-btn" onClick={() => setError("")}>
                ✖
              </button>
            </div>
          )}
          <Link to="/login">Already have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src={bg} alt="bg" />
      </div>
    </div>
  );
};

export default Register;
