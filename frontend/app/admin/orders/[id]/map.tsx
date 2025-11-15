"use client";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const defaultIcon = L.icon({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// set globally
L.Marker.prototype.options.icon = defaultIcon;

export default function MapComponent({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) {
  useEffect(() => {
    const map = L.map("order-map").setView([lat, lng], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    L.marker([lat, lng]).addTo(map);

    return () => {
      map.remove();
    };
  }, [lat, lng]);

  return <div id="order-map" className="h-full w-full" />;
}
