import "./NewPost.scss";
import { useState } from "react";
import PostForm from "../../components/postForm/PostForm";
import { useNavigate } from "react-router";
import apiRequest from "../../api/axios";

const NewPost = () => {
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const onSubmit = async (formData, valid) => {
    if (!valid) return;

    setError("");

    try {
      const res = await apiRequest.post("/posts", {
        postData: {
          title: formData.title,
          price: +formData.price,
          images: formData.images,
          features: formData.features,
          stats: {
            bedroom: +formData.bedroom,
            bathroom: +formData.bathroom,
          },
          address: formData.address,
          city: formData.city,
          latitude: formData.latitude,
          longitude: formData.longitude,
          property: formData.property,
          type: formData.type,
        },
        postDetails: {
          description: formData.description,
          size: +formData.size,
          nearby_places: formData.nearby_places,
          fee: formData.fee,
          utility: formData.utility,
          pet_policy: formData.pet_policy,
        },
      });

      navigate("/room/" + res.data.id);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <>
      <PostForm onSubmit={onSubmit} apiPostError={error} />
    </>
  );
};

export default NewPost;
