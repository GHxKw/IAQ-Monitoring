import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.scss";
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon} from 'leaflet'



const Map = ({ channelId, apiKey }) => {
  const [channelData, setChannelData] = useState(null);

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        // Fetch channel data from Thingspeak
        const response = await fetch(
          `https://api.thingspeak.com/channels/${channelId}/status.json?api_key=${apiKey}`
        );
        const data = await response.json();
        setChannelData(data.channel);
      } catch (error) {
        console.error("Error fetching channel data:", error);
      }
    };

    fetchChannelData();
    // console.log(channelData.latitude);
    // console.log(channelData.longitude);
  }, [channelId, apiKey]);

  return (
    <div id="map" className="map-container">
      {channelData && (
        <MapContainer center={[channelData.latitude, channelData.longitude]} zoom={13} style={{ height: "400px" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[channelData.latitude, channelData.longitude]} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
            <Popup>
              Indoor Air Quality Device
            </Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
};

export default Map;
