"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

interface UserProfileMapProps {
  markerPos: [number, number] | null;
  setMarkerPos: (pos: [number, number] | null) => void;
  setCoordinates: (coords: string) => void;
}

interface IconPrototype {
  _iconPatched?: boolean;
  _getIconUrl?: () => string;
}

if (!(L.Icon.Default.prototype as unknown as IconPrototype)._iconPatched) {
  delete (L.Icon.Default.prototype as unknown as IconPrototype)._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "/leaflet/marker-icon-2x.webp",
    iconUrl: "/leaflet/marker-icon.webp",
    shadowUrl: "/leaflet/marker-shadow.webp",
  });

  (L.Icon.Default.prototype as unknown as IconPrototype)._iconPatched = true;
}

export default function UserProfileMap({
  markerPos,
  setMarkerPos,
  setCoordinates,
}: UserProfileMapProps) {
  const defaultCenter: [number, number] = [33.8938, 35.5018];

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const pos: [number, number] = [e.latlng.lat, e.latlng.lng];
        setMarkerPos(pos);
        setCoordinates(`${pos[0]},${pos[1]}`);
      },
    });

    return markerPos ? <Marker position={markerPos} /> : null;
  }

  function UpdateView({ pos }: { pos: [number, number] | null }) {
    const map = useMap();
    if (pos) map.setView(pos);
    return null;
  }

  return (
    <MapContainer
      center={markerPos || defaultCenter}
      zoom={13}
      className="h-full w-full rounded-md overflow-hidden"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.webp"
        attribution="&copy; OpenStreetMap"
      />

      <UpdateView pos={markerPos} />
      <LocationMarker />
    </MapContainer>
  );
}
