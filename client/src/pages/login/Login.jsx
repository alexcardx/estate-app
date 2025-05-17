import { useContext, useState } from "react";
import "./Login.scss";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import bg from "../../assets/bg.png";
import apiRequest from "../../api/axios";

const Login = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState({ username: "", password: "" });

  const { updateUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await apiRequest.post("/auth/login", {
        username: query.username,
        password: query.password,
      });

      updateUser(res.data);
      navigate("/");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
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
          <button disabled={isLoading}>Login</button>
          {error && (
            <div className="error">
              <span className="icon">❗</span>
              <span>{error}</span>
              <button className="close-btn" onClick={() => setError("")}>
                ✖
              </button>
            </div>
          )}
          <Link to="/register">{"Don't"} you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src={bg} alt="bg" />
      </div>
    </div>
  );
};

export default Login;
