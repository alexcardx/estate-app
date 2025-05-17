import "./SearchPosts.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { useContext, useEffect, useState } from "react";
import { useNavigation, useSearchParams } from "react-router";
import apiRequest from "../../api/axios";
import Loader from "../../components/loader/Loader";
import NoResults from "../../components/noResults/NoResults";
import Pagination from "../../components/pagination/Pagination";
import { AuthContext } from "../../context/AuthContext";
import ChatModal from "../../components/chatModal/ChatModal";

const SearchPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(null);
  const [showMap, setShowMap] = useState(true);
  const [receiverId, setReceiverId] = useState(null);

  const navigate = useNavigation();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const { user } = useContext(AuthContext);

  const handleOpenModalChat = (userId) => {
    if (!user) {
      navigate("/login");
      return;
    }
    setIsChatOpen((prev) => !prev);
    setReceiverId(userId);
  };

  useEffect(() => {
    setLoading(true);
    setError("");
    const fetchPosts = async () => {
      try {
        const res = await apiRequest.get(
          `/posts?page=${page}&${searchParams.toString()}`
        );
        setPosts(res.data.posts);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [searchParams, page]);

  return (
    <div className="listPage">
      <div className="listContainer">
        <div className="wrapper">
          <Filter showMap={showMap} setShowMap={setShowMap} />
          {loading && <Loader />}
          {!loading && error && (
            <p className="posts-error">
              Something went wrong. Please try again
            </p>
          )}
          {!loading && !error && (
            <>
              <div>
                {showMap && (
                  <div className="map-mobile">
                    <Map items={posts} center={[52.4797, -1.90269]} />
                  </div>
                )}
              </div>

              {posts.map((post) => (
                <Card
                  key={post.id}
                  post={post}
                  handleChat={handleOpenModalChat}
                />
              ))}
            </>
          )}
          {!loading && !error && posts.length === 0 && <NoResults />}
          {!loading &&
            !error &&
            (posts.length > 9 ? true : page === totalPages && page > 1) && (
              <Pagination totalPages={totalPages} />
            )}
        </div>
      </div>
      <div className="mapContainer">
        <Map items={posts} center={[52.4797, -1.90269]} />
      </div>
      {isChatOpen && (
        <ChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          receiverId={receiverId}
        />
      )}
    </div>
  );
};

export default SearchPosts;
