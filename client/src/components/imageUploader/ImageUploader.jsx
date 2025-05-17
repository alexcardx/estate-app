import { useEffect, useRef, useState } from "react";
import "./ImageUploader.scss";

const MAX_FILE_SIZE_MB = 2;
const MAX_IMAGES = 4;

const ImageUploader = ({
  uploadImage,
  multiple = false,
  text,
  currentImages = [],
}) => {
  const [widgetLoaded, setWidgetLoaded] = useState(false);
  const [error, setError] = useState("");
  const uploadedImagesRef = useRef([...currentImages]);

  const openWidget = () => {
    if (!widgetLoaded || !window.cloudinary) return;

    if (multiple && currentImages.length >= MAX_IMAGES) {
      setError(`You can upload up to ${MAX_IMAGES} images.`);
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "daa6qjjjf",
        uploadPreset: "upload",
        multiple: multiple,
        sources: ["local", "url", "camera"],
        maxFileSize: MAX_FILE_SIZE_MB * 1024 * 1024,
        clientAllowedFormats: ["png", "jpeg", "jpg", "webp"],
      },
      (error, result) => {
        if (!error && result.event === "success") {
          const file = result.info;
          if (multiple) {
            if (uploadedImagesRef.current.length < MAX_IMAGES) {
              uploadedImagesRef.current = [
                ...uploadedImagesRef.current,
                file.secure_url,
              ].slice(0, MAX_IMAGES);

              uploadImage([...uploadedImagesRef.current]);
              setError("");
            }
            if (uploadedImagesRef.current.length >= MAX_IMAGES) {
              setError(`Maximum of ${MAX_IMAGES} images reached.`);
            }
          } else {
            uploadImage((prev) => {
              setError("");
              return { ...prev, avatar: file.secure_url };
            });
          }
        }
      }
    );

    widget.open();
  };

  const handleRemove = (urlToRemove) => {
    uploadImage((prev) => prev.filter((url) => url !== urlToRemove));
  };

  useEffect(() => {
    if (!widgetLoaded) {
      const script = document.getElementById("cloudinary");
      if (!script) {
        const newScript = document.createElement("script");
        newScript.src = "https://upload-widget.cloudinary.com/global/all.js";
        newScript.id = "cloudinary";
        newScript.async = true;
        newScript.onload = () => setWidgetLoaded(true);
        document.body.appendChild(newScript);
      } else {
        setWidgetLoaded(true);
      }
    }
  }, [widgetLoaded]);

  useEffect(() => {
    uploadedImagesRef.current = [...currentImages];
    if (currentImages.length < MAX_IMAGES) setError("");
  }, [currentImages]);

  return (
    <div className="image-uploader">
      <button type="button" onClick={openWidget} disabled={!widgetLoaded}>
        {text}
      </button>

      {error && <p className="error">{error}</p>}

      {!multiple && currentImages.length > 0 && (
        <div className="preview">
          {currentImages.map((url) => (
            <div key={url} className="image-box">
              <img src={url} alt="Uploaded" />
              <button
                type="button"
                className="remove"
                onClick={() => handleRemove(url)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
