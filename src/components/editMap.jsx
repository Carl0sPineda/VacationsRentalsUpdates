import { useEffect } from "react";
import L from "leaflet";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";
import "leaflet-fullscreen";
import houseIcon from "../assets/map-pointer.svg";

export default function MapEdit({
  geolocation,
  setGeolocation,
  localizacionGuardada,
}) {
  const icon = L.icon({
    iconUrl: houseIcon,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  useEffect(() => {
    const map = L.map("mapid").setView([geolocation.lat, geolocation.lng], 10);
    const osmLayer = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "OpenStreetMap contributors",
      }
    );
    const esriLayer = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "Esri",
      }
    );

    osmLayer.addTo(map);
    const baseLayers = {
      "Por defecto": osmLayer,
      Satelite: esriLayer,
    };

    const marker = L.marker([geolocation.lat, geolocation.lng], {
      draggable: true,
      icon: icon,
    }).addTo(map);

    marker.on("dragend", async function (e) {
      const { lat, lng } = e.target.getLatLng();
      setGeolocation({ lat, lng });
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      const address = data?.display_name ?? "";
    });

    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: false,
    })
      .on("markgeocode", function (e) {
        const { center } = e.geocode;
        marker.setLatLng(center);
        map.setView(center, 16);
      })
      .addTo(map);
    L.control
      .scale({
        position: "bottomright",
      })
      .addTo(map);
    L.control
      .fullscreen({
        position: "topleft",
      })
      .addTo(map);
    L.control.layers(baseLayers).addTo(map);

    // Clean up function to remove the map and marker when the component unmounts
    return () => {
      map.remove();
    };
  }, [localizacionGuardada]);

  return (
    <div>
      <p className="text-lg font-semibold mb-2">
        Seleccione una ubicación específica
      </p>
      <div id="mapid" style={{ height: "400px" }}></div>
    </div>
  );
}
