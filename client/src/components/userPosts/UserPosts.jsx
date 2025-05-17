import "./UserPosts.scss";
import Card from "../card/Card";
import { useEffect, useState } from "react";
import apiRequest from "../../api/axios";
import Loader from "../../components/loader/Loader";

const UserPosts = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await apiRequest.get("/user/posts");
        setUserPosts(res.data);
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
          {userPosts.map((post) => (
            <Card key={post.id} post={post} />
          ))}
        </div>
      )}
      {!loading && !error && userPosts.length === 0 && (
        <p className="list-empty">You haven't published any post so far</p>
      )}
    </>
  );
};

export default UserPosts;
