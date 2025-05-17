import { useContext, useState } from "react";
import noavatar from "../../assets/noavatar.png";
import "./UpdateUser.scss";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import ImageUploader from "../../components/imageUploader/ImageUploader";
import apiRequest from "../../api/axios";

const UpdateUser = () => {
  const [showModal, setShowModal] = useState(false);
  const { user, updateUser } = useContext(AuthContext);
  const [updatedUser, setUpdatedUser] = useState({
    email: user.email,
    password: "",
    avatar: null,
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFields = {};
    if (updatedUser.email) updatedFields.email = updatedUser.email;
    if (updatedUser.password.trim())
      updatedFields.password = updatedUser.password;
    if (updatedUser.avatar) updatedFields.avatar = updatedUser.avatar;

    try {
      const res = await apiRequest.patch(`/user/me`, updatedFields);
      updateUser(res.data);
      navigate("/profile");
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await apiRequest.delete(`/user/me`);
      updateUser(null);
      navigate("/");
    } catch (err) {
      setError(err.response.data.message);
    }
  };
  return (
    <div className="profileUpdate">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Update Profile</h1>
          <div className="item">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={updatedUser.email}
              onChange={(e) => {
                setUpdatedUser((prev) => {
                  return { ...prev, email: e.target.value };
                });
              }}
            />
          </div>
          <div className="item">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={updateUser.password}
              onChange={(e) => {
                setUpdatedUser((prev) => {
                  return { ...prev, password: e.target.value };
                });
              }}
            />
          </div>
          <div className="avatar-box">
            <img
              src={updatedUser.avatar || user.avatar || noavatar}
              alt="avatar"
              className="avatar"
            />
            <ImageUploader
              uploadImage={setUpdatedUser}
              text={"Upload Avatar"}
            />
          </div>
          <button className="update-button">Update</button>
          {error && <span>error</span>}
        </form>
        <button
          className="delete-button"
          onClick={() => setShowModal((prev) => !prev)}
        >
          🗑️ Delete Account
        </button>
        {showModal && (
          <div className="modal-backdrop">
            <div className="modal">
              <button
                className="close-button"
                onClick={() => setShowModal((prev) => !prev)}
              >
                ×
              </button>
              <h2>Are you sure you want to delete your account?</h2>
              <p>This action cannot be undone.</p>
              <div className="modal-buttons">
                <button className="confirm" onClick={handleDeleteUser}>
                  Yes, delete
                </button>
                <button
                  className="cancel"
                  onClick={() => setShowModal((prev) => !prev)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="decor"></div>
    </div>
  );
};

export default UpdateUser;
