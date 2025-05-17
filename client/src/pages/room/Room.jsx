import "./Room.scss";
import { useNavigate, useParams } from "react-router";
import { useContext, useEffect, useState } from "react";
import Slider from "../../components/slider/Slider";
import Loader from "../../components/loader/Loader";
import Map from "../../components/map/Map";
import chat from "../../assets/chat.png";
import save from "../../assets/save.png";
import fee from "../../assets/fee.png";
import pin from "../../assets/pin.png";
import size from "../../assets/size.png";
import pet from "../../assets/pet.png";
import utility from "../../assets/utility.png";
import { FaBath, FaBed } from "react-icons/fa";
import apiRequest from "../../api/axios";
import { nearbyPlacesImgs } from "../../constants";
import { AuthContext } from "../../context/AuthContext";
import ChatModal from "../../components/chatModal/ChatModal";

const Room = () => {
  const [postData, setPostData] = useState({});
  const [isSaved, setIsSaved] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({
    fetchPostDetailsError: "",
    handleSavePlaceError: "",
  });

  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSavePlace = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setErrors((prev) => ({
      ...prev,
      handleSavePlaceError: "",
    }));
    try {
      setIsSaved((prev) => !prev);
      await apiRequest.post("/user/save", { postId: id });
    } catch (err) {
      setIsSaved((prev) => !prev);
      setErrors((prev) => ({
        ...prev,
        handleSavePlaceError: err.message || "Failed to save",
      }));
    }
  };

  const handleOpenModalChat = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setIsChatOpen((prev) => !prev);
  };

  useEffect(() => {
    const fetchPostDetails = async () => {
      setLoading(true);
      setErrors("");
      try {
        const res = await apiRequest.get(`posts/${id}`);
        setPostData(res.data);
        setIsSaved(res.data.isSaved);
      } catch (err) {
        setErrors((prev) => ({
          ...prev,
          fetchPostDetailsError:
            err.message || "Something went wrong. Please try again",
        }));
      } finally {
        setLoading(false);
      }
    };
    fetchPostDetails();
  }, [id]);

  useEffect(() => {
    if (errors.handleSavePlaceError) {
      const timer = setTimeout(
        () =>
          setErrors((prev) => ({
            ...prev,
            handleSavePlaceError: "",
          })),
        3000
      );
      return () => clearTimeout(timer);
    }
  }, [errors.handleSavePlaceError]);

  return (
    <>
      {loading && <Loader />}
      {!loading && errors.fetchPostDetailsError && (
        <div className="singlePage-error">Something went wrong. Try again</div>
      )}
      {!loading && !errors.fetchPostDetailsError && (
        <div className="singlePage">
          <div className="details">
            <div className="wrapper">
              <Slider images={postData.images} />
              <div className="info">
                <div className="top">
                  <div className="post">
                    <h1>{postData.title}</h1>
                    <div className="address">
                      <img src={pin} alt="pin" />
                      <span>{postData.address}</span>
                    </div>
                    <div className="price">$ {postData.price}</div>
                  </div>
                  <div className="user">
                    <img src={postData.user.avatar} alt="user" />
                    <span>{postData.user.username}</span>
                  </div>
                </div>
                <div className="bottom">{postData.postDetails.description}</div>
                <div className="buttons">
                  {errors.handleSavePlaceError && (
                    <div className="icon-error">
                      {errors.handleSavePlaceError}
                    </div>
                  )}
                  <button onClick={handleOpenModalChat}>
                    <img src={chat} alt="chat" />
                    Send a Message
                  </button>
                  <button
                    onClick={handleSavePlace}
                    className={isSaved ? "saved" : ""}
                  >
                    <img src={save} alt="save" />
                    {isSaved ? "Saved" : "Save the Place"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="features">
            <div className="wrapper">
              <p className="title">General</p>
              <div className="listVertical">
                <div className="feature">
                  <img src={fee} alt="fee" />
                  <div className="featureText">
                    <span>Property Fees</span>
                    <p>{postData.postDetails.fee}</p>
                  </div>
                </div>
                <div className="feature">
                  <img src={utility} alt="utility" />
                  <div className="featureText">
                    <span>Utilities</span>
                    <p>{postData.postDetails.utility}</p>
                  </div>
                </div>
                <div className="feature">
                  <img src={pet} alt="pet" />
                  <div className="featureText">
                    <span>Pet Policy</span>
                    <div>{postData.postDetails.pet_policy}</div>
                  </div>
                </div>
              </div>
              <p className="title">Sizes</p>
              <div className="sizes">
                <div className="size">
                  <img src={size} alt="size" />
                  <span>{postData.postDetails.size} м²</span>
                </div>
                <div className="size">
                  <FaBed style={{ height: "24px", width: "24px" }} />
                  <span>{postData.stats.bedroom} bedroom</span>
                </div>
                <div className="size">
                  <FaBath style={{ height: "24px", width: "24px" }} />
                  <span>{postData.stats.bathroom} bathroom</span>
                </div>
              </div>
              <p className="title">Nearby Places</p>
              <div className="listHorizontal">
                {postData.postDetails.nearby_places.length
                  ? postData.postDetails.nearby_places.map((place) => {
                      return (
                        <div key={place.name} className="feature">
                          {
                            nearbyPlacesImgs.find(
                              (el) => el.label === place.name
                            ).icon
                          }
                          <div className="featureText">
                            <span>{place.name}</span>
                            <p className="featureDistance">
                              {place.distance}m away
                            </p>
                          </div>
                        </div>
                      );
                    })
                  : ""}
              </div>
              <p className="title">Location</p>
              <div className="mapContainer">
                <Map
                  items={[postData]}
                  center={[postData.latitude, postData.longitude]}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {isChatOpen && (
        <ChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          receiverId={postData.user.id}
        />
      )}
    </>
  );
};

export default Room;
