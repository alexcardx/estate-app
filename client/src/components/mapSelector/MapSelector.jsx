import { useState } from "react";
import "./MapSelector.scss";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const LocationMarker = ({
  setCoordinates,
  setAddress,
  setLoading,
  setGeoError,
}) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition(e.latlng);
      setCoordinates({ latitude: lat, longitude: lng });

      try {
        setLoading(true);
        setGeoError("");
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await res.json();
        setAddress(data.display_name || "");
      } catch (err) {
        setGeoError(err.message);
      } finally {
        setLoading(false);
      }
    },
  });

  return position ? <Marker position={position} /> : null;
};

const MapSelector = ({
  setCoordinates,
  setAddress,
  setLoading,
  setGeoError,
}) => {
  return (
    <MapContainer center={[51.505, -0.09]} zoom={10} className="map-selector">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <LocationMarker
        setLoading={setLoading}
        setGeoError={setGeoError}
        setCoordinates={setCoordinates}
        setAddress={setAddress}
      />
    </MapContainer>
  );
};

export default MapSelector;
