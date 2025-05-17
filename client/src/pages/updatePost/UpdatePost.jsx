import { useState } from "react";
import PostForm from "../../components/postForm/PostForm";
import "./UpdatePost.scss";
import apiRequest from "../../api/axios";

const UpdatePost = ({ postData }) => {
  const [error, setError] = useState("");

  const onSubmit = async (formData, valid) => {
    if (!valid) return;
    setError("");

    const changedFields = {};
    for (const key in formData) {
      if (formData[key] !== postData[key]) {
        changedFields[key] = formData[key];
      }
    }

    try {
      await apiRequest.patch(`/posts/${postData.id}`, changedFields);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <PostForm
      initialValues={postData}
      onSubmit={onSubmit}
      error={error}
      isEdited
    />
  );
};

export default UpdatePost;
