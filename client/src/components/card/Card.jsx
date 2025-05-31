import "./Card.scss";
import pin from "../../assets/pin.png";
import save from "../../assets/save.png";
import chat from "../../assets/chat.png";
import { Link, useNavigate } from "react-router";
import {
  FaWifi,
  FaBath,
  FaTv,
  FaParking,
  FaSnowflake,
  FaUtensils,
  FaBed,
} from "react-icons/fa";
import { MdPets, MdLocalLaundryService } from "react-icons/md";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../api/axios";

const featureIcons = {
  wifi: { icon: <FaWifi />, label: "Wi-Fi" },
  tv: { icon: <FaTv />, label: "TV" },
  parking: { icon: <FaParking />, label: "Parking" },
  ac: { icon: <FaSnowflake />, label: "AC" },
  kitchen: { icon: <FaUtensils />, label: "Kitchen" },
  pets: { icon: <MdPets />, label: "Pets" },
  laundry: { icon: <MdLocalLaundryService />, label: "Laundry" },
};

const statsIcons = {
  bedroom: { icon: <FaBed />, label: "Bedroom" },
  bathroom: { icon: <FaBath />, label: "Bathroom" },
};

const Card = ({ post, onRemove, handleOpenChat }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [error, setError] = useState("");

  const handleSavePlace = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setError("");
      setIsSaved((prev) => !prev);
      await apiRequest.post("/user/save", { postId: post.id });

      if (isSaved && onRemove) {
        onRemove();
      }
    } catch (err) {
      setIsSaved((prev) => !prev);
      setError(err.message || "Failed to save");
    }
  };

  const handleChat = (userId) => {
    if (!user) {
      navigate("/login");
      return;
    }
    handleOpenChat(userId);
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="card">
      <Link to={`/room/${post.id}`} className="imageContainer">
        <img src={post.images[0]} alt="room" />
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${post.id}`}>{post.title}</Link>
        </h2>
        <p className="address">
          <img src={pin} alt="pin" />
          <span>{post.address.split(",").slice(0, 3).join(", ")}</span>
        </p>
        <div className="info-wrapper">
          <p className="price">$ {post.price}</p>
          <div className="icons">
            {error && <div className="icon-error">{error}</div>}
            <button
              className={`icon ${isSaved ? "saved-btn" : ""}`}
              onClick={handleSavePlace}
            >
              <img src={save} alt="save" />
            </button>
            <button className="icon" onClick={() => handleChat(post.userId)}>
              <img src={chat} alt="chat" />
            </button>
          </div>
        </div>
        <div className="features">
          {post.features.map((feature) => {
            return (
              <div key={feature} className="feature">
                {featureIcons[feature].icon}
                <span>{featureIcons[feature].label}</span>
              </div>
            );
          })}
          {Object.entries(post.stats).map(([key, value]) => (
            <div key={key} className="feature">
              {statsIcons[key].icon}
              <span>
                {value} {statsIcons[key].label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Card;
