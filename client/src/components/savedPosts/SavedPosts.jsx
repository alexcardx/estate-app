import "./SavedPosts.scss";
import Card from "../card/Card";
import { useEffect, useState } from "react";
import apiRequest from "../../api/axios";
import Loader from "../../components/loader/Loader";

const SavedPosts = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savedPosts, setSavedPosts] = useState([]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await apiRequest.get("/user/saved/posts");
        setSavedPosts(res.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserPosts();
  }, []);

  return (
    <>
      {loading && <Loader />}
      {!loading && error && (
        <p className="user-posts error">
          Something went wrong. Please try again
        </p>
      )}
      {!loading && !error && (
        <div className="list">
          {savedPosts.length === 0 ? (
            <p className="list-empty">The list is empty</p>
          ) : (
            savedPosts.map((savedPost) => (
              <Card
                key={savedPost.id}
                post={savedPost}
                onRemove={() => {
                  setSavedPosts((prev) =>
                    prev.filter((post) => post.id !== savedPost.id)
                  );
                }}
              />
            ))
          )}
        </div>
      )}
    </>
  );
};

export default SavedPosts;
