import { useContext, useEffect, useState } from "react";
import "./Navbar.scss";
import { NavLink, Link } from "react-router";
import logo from "../../assets/logo.png";
import noavatar from "../../assets/noavatar.png";
import { HiMenu } from "react-icons/hi";
import { HiX } from "react-icons/hi";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../hooks/useNotificationStore";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const { user } = useContext(AuthContext);

  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);

  useEffect(() => {
    if (user) {
      fetch();
    }
  }, [user, fetch]);

  return (
    <nav>
      <div className="left">
        <ul className="menu-left">
          <li className="logo-item">
            <Link to="/" className="logo">
              <img src={logo} alt="logo" />
              <span>Horizons Estate</span>
            </Link>
          </li>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/about">About</NavLink>
          </li>
          <li>
            <NavLink to="/contact">Contact</NavLink>
          </li>
          <li>
            <NavLink to="/agents">Agents</NavLink>
          </li>
        </ul>
      </div>
      <div className="right">
        {user ? (
          <div className="user">
            <Link to="/profile" className="profile">
              <img src={user.avatar || noavatar} alt="user" />
              <span>{user.username}</span>
              <div className={`notification ${!number ? "plain" : ""}`}>
                {number}
              </div>
            </Link>
          </div>
        ) : (
          <>
            <NavLink to="/login" className="login-btn">
              Sign in
            </NavLink>
            <NavLink to="/register" className="register-btn">
              Sign up
            </NavLink>
          </>
        )}
        <button
          className={`menu-button ${menuOpen ? "bg-white" : "bg-black"}`}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? (
            <HiX size={30} className="menu-close" />
          ) : (
            <HiMenu size={24} className="menu-open" />
          )}
        </button>
        <ul className={menuOpen ? "menu mobile" : "menu"}>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/about">About</NavLink>
          </li>
          <li>
            <NavLink to="/contact">Contact</NavLink>
          </li>
          <li>
            <NavLink to="/agents">Agents</NavLink>
          </li>
          {user ? (
            <li>
              <NavLink to="/profile">My Profile</NavLink>
            </li>
          ) : (
            <>
              <li>
                <NavLink to="/login">Sign in</NavLink>
              </li>
              <li>
                <NavLink to="/register">Sign up</NavLink>
              </li>{" "}
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
