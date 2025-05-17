import "./PostForm.scss";
import { useState } from "react";
import ImageUploader from "../imageUploader/ImageUploader";
import MapSelector from "../mapSelector/MapSelector";
import size from "../../assets/size.png";
import { placesOptions } from "../../constants/index";
import { utilityOptions } from "../../constants/index";
import { petPolicyOptions } from "../../constants/index";
import { propertyOptions } from "../../constants/index";
import { featureOptions } from "../../constants/index";
import { placeIcons } from "../../constants/index";
import { FaBed, FaBath } from "react-icons/fa";
import { typeOptions } from "../../constants/index";
import { cities } from "../../constants/index";
import { useFormValidation } from "../../hooks/useFormValidation";

const PostForm = ({ initialValues = {}, onSubmit, isEdited, apiPostError }) => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    images: [],
    features: [],
    bedroom: "",
    bathroom: "",
    size: "",
    latitude: "",
    longitude: "",
    city: "",
    address: "",
    nearby_places: [],
    description: "",
    fee: "",
    utility: "",
    pet_policy: "",
    type: "",
    property: "",
    ...initialValues,
  });
  const [geoError, setGeoError] = useState("");
  const [loading, setLoading] = useState(false);
  const { validationErrors, validate } = useFormValidation(formData);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = async (e) => {
    const newAddress = e.target.value;
    updateField("address", newAddress);

    try {
      setLoading(true);
      setGeoError("");
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          newAddress
        )}`
      );

      const data = await res.json();
      if (data && data[0]) {
        updateField("latitude", parseFloat(data[0].lat));
        updateField("longitude", parseFloat(data[0].lon));
      }
    } catch (err) {
      setGeoError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlace = (e) => {
    const selected = e.target.value;
    if (selected && !formData.nearby_places.some((p) => p.name === selected)) {
      updateField("nearby_places", [
        ...formData.nearby_places,
        { name: selected, distance: "" },
      ]);
    }
    e.target.value = "";
  };
  const handleDistanceChange = (e, idx) => {
    const updated = [...formData.nearby_places];
    updated[idx] = { ...updated[idx], distance: +e.target.value };
    updateField("nearby_places", updated);
  };

  const handleRemovePlace = (idx) => {
    const updated = formData.nearby_places.filter((_, i) => i !== idx);
    updateField("nearby_places", updated);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const isValid = validate();
    onSubmit(formData, isValid);
  };

  return (
    <form className="post-form" onSubmit={handleFormSubmit}>
      <h2>Create a New Post</h2>

      <div className="form-item">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => updateField("title", e.target.value)}
        />
        {validationErrors.title && (
          <p className="validation-error">{validationErrors.title}</p>
        )}
      </div>

      <div className="form-item">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          rows={5}
          value={formData.description}
          onChange={(e) => updateField("description", e.target.value)}
        />
        {validationErrors.description && (
          <p className="validation-error">{validationErrors.description}</p>
        )}
      </div>

      <div className="form-item">
        <label htmlFor="price">Price ($)</label>
        <input
          id="price"
          type="number"
          value={formData.price}
          onChange={(e) => updateField("price", e.target.value)}
        />
        {validationErrors.price && (
          <p className="validation-error">{validationErrors.price}</p>
        )}
      </div>

      <label>Images (up to 4)</label>
      <ImageUploader
        multiple
        currentImages={formData.images}
        uploadImage={(newImages) => updateField("images", newImages)}
        text="Upload Images"
        preview={false}
      />
      {formData.images.length > 0 && (
        <div className="image-preview">
          {formData.images.map((img, idx) => (
            <div className="image-thumb" key={idx}>
              <img src={img} alt={`Preview ${idx}`} />
              <button
                type="button"
                className="remove-btn"
                onClick={() => {
                  const updatedImages = formData.images.filter(
                    (_, i) => i !== idx
                  );
                  updateField("images", updatedImages);
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <label>Features</label>
      <div className="multi-select">
        {featureOptions.map(({ label, icon }) => (
          <label key={label} className="feature-option">
            <input
              type="checkbox"
              checked={formData.features.includes(label)}
              onChange={(e) => {
                const features = e.target.checked
                  ? [...formData.features, label]
                  : formData.features.filter((f) => f !== label);
                updateField("features", features);
              }}
            />
            <div className="icon">{icon}</div>
            <span className="text">{label}</span>
          </label>
        ))}
      </div>

      <div className="form-item">
        <div className="grid sizes">
          <div>
            <div className="sizes-box">
              <FaBed />
              <label className="stats" htmlFor="bedroom">
                Bedrooms
              </label>
            </div>
            <input
              id="bedroom"
              type="number"
              min={1}
              value={formData.bedroom}
              onChange={(e) => updateField("bedroom", e.target.value)}
            />
            {validationErrors.bedroom && (
              <p className="validation-error">{validationErrors.bedroom}</p>
            )}
          </div>
          <div>
            <div className="sizes-box">
              <FaBath />
              <label htmlFor="bathroom">Bathrooms</label>
            </div>
            <input
              id="bathroom"
              type="number"
              min={1}
              value={formData.bathroom}
              onChange={(e) => updateField("bathroom", e.target.value)}
            />
            {validationErrors.bathroom && (
              <p className="validation-error">{validationErrors.bathroom}</p>
            )}
          </div>
          <div>
            <div className="sizes-box">
              <img src={size} alt="size" height="16px" width="16px" />
              <label htmlFor="size">Size (m²)</label>
            </div>
            <input
              id="size"
              type="number"
              min={10}
              value={formData.size}
              onChange={(e) => updateField("size", e.target.value)}
            />
            {validationErrors.size && (
              <p className="validation-error">{validationErrors.size}</p>
            )}
          </div>
        </div>
      </div>

      <div className="form-item">
        <label htmlFor="city">City</label>
        <select
          id="city"
          value={formData.city}
          onChange={(e) => updateField("city", e.target.value)}
        >
          <option value="">Select a city</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        {validationErrors.city && (
          <p className="validation-error">{validationErrors.city}</p>
        )}
      </div>

      <div className="form-item">
        <label htmlFor="address">Address</label>
        {loading && (
          <p className="geolocation-info">Geolocating your address ...</p>
        )}
        <input
          id="address"
          type="text"
          value={formData.address}
          onChange={handleAddressChange}
          placeholder="pin your address on map below"
        />
        {validationErrors.address && (
          <p className="validation-error">{validationErrors.address}</p>
        )}
        {geoError && (
          <p className="geolocate-error">
            Failed to geolocate your address. Please try again
          </p>
        )}
      </div>
      <MapSelector
        coordinates={{
          latitude: formData.latitude,
          longitude: formData.longitude,
        }}
        setCoordinates={({ latitude, longitude }) => {
          updateField("latitude", latitude);
          updateField("longitude", longitude);
        }}
        setAddress={(address) => updateField("address", address)}
        setLoading={setLoading}
        setGeoError={setGeoError}
      />

      <label htmlFor="nearby_places">Nearby Places</label>
      <select id="nearby_places" onChange={handleSelectPlace} defaultValue="">
        <option value="" disabled>
          Select a place
        </option>
        {placesOptions
          .filter(
            (place) => !formData.nearby_places.some((p) => p.name === place)
          )
          .map((place) => {
            return (
              <option key={place} value={place}>
                {place}
              </option>
            );
          })}
      </select>

      <div className="nearby-list">
        {formData.nearby_places.map((place, i) => (
          <div key={place.name} className="nearby-item">
            <div className="icon">{placeIcons[place.name]}</div>
            <span>{place.name}</span>
            <input
              type="number"
              required
              min={1}
              placeholder="distance"
              value={place.distance}
              onChange={(e) => handleDistanceChange(e, i)}
            />
            <button
              type="button"
              className="remove-btn"
              onClick={() => handleRemovePlace(i)}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="form-item">
        <label htmlFor="fee">Fee</label>
        <input
          id="fee"
          type="text"
          value={formData.fee}
          onChange={(e) => updateField("fee", e.target.value)}
        />
        {validationErrors.fee && (
          <p className="validation-error">{validationErrors.fee}</p>
        )}
      </div>

      <div className="form-item">
        <label htmlFor="utility">Utility</label>
        <select
          id="utility"
          value={formData.utility}
          onChange={(e) => updateField("utility", e.target.value)}
        >
          <option value="">Select...</option>
          {utilityOptions.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        {validationErrors.utility && (
          <p className="validation-error">{validationErrors.utility}</p>
        )}
      </div>

      <div className="form-item">
        <label htmlFor="pet_policy">Pet Policy</label>
        <select
          id="pet_policy"
          value={formData.pet_policy}
          onChange={(e) => updateField("pet_policy", e.target.value)}
        >
          <option value="">Select...</option>
          {petPolicyOptions.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        {validationErrors.pet_policy && (
          <p className="validation-error">{validationErrors.pet_policy}</p>
        )}
      </div>

      <div className="form-item">
        <label htmlFor="type">Type</label>
        <select
          id="type"
          value={formData.type}
          onChange={(e) => updateField("type", e.target.value)}
          className="typeOptions"
        >
          <option value="">Select...</option>
          {typeOptions.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        {validationErrors.type && (
          <p className="validation-error">{validationErrors.type}</p>
        )}
      </div>

      <div className="form-item">
        <label htmlFor="property">Property</label>
        <select
          id="property"
          value={formData.property}
          onChange={(e) => updateField("property", e.target.value)}
        >
          <option value="">Select...</option>
          {propertyOptions.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        {validationErrors.property && (
          <p className="validation-error">{validationErrors.property}</p>
        )}
      </div>

      <button type="submit" className="submit-btn">
        {isEdited ? "Update" : "Submit"}
      </button>
      {apiPostError && (
        <div className="new-post-error">
          <p>Failed to create post. Try again</p>
        </div>
      )}
    </form>
  );
};

export default PostForm;
