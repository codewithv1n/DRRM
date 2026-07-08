import { MapContainer, TileLayer, } from "react-leaflet";
import "leaflet/dist/leaflet.css";


export default function HazardMap() {
  
  return (
    <div style={{ width: "100%", height: "300px", position: "relative", zIndex: 0 }}>
      <MapContainer
        center={[14.6515, 121.0493]}
        zoom={13}
        minZoom={12}
        maxZoom={18}
        maxBoundsViscosity={1.0}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

      </MapContainer>
    </div>
  );
}
