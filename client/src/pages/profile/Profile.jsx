import "./Profile.scss";
import UserPosts from "../../components/userPosts/UserPosts";
import Chat from "../../components/chat/Chat";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router";
import apiRequest from "../../api/axios";
import { useContext } from "react";
import noavatar from "../../assets/noavatar.png";
import SavedPosts from "../../components/savedPosts/SavedPosts";

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="user-info">
            <div className="title user-title">
              <h1>My profile</h1>
            </div>
            <div className="info">
              <span>
                <img src={user.avatar || noavatar} alt="avatar" />
              </span>
              <span>
                Username: <b>{user.username}</b>
              </span>
              <span>
                E-mail: <b>{user.email}</b>
              </span>
              <div className="user-buttons">
                <Link to="/profile/update">
                  <button>Update Profile</button>
                </Link>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
          <div className="title">
            <h1>My Posts</h1>
            <Link to="/add">
              <button>Create New Post</button>
            </Link>
          </div>
          <UserPosts />
          <div className="title">
            <h1>Saved Posts</h1>
          </div>
          <SavedPosts />
        </div>
      </div>
      <div className="chatContainer">
        <div className="wrapper">
          <Chat />
        </div>
      </div>
    </div>
  );
};

export default Profile;
