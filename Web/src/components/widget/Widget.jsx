import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SmokingRoomsIcon from "@mui/icons-material/SmokingRooms";
import Co2Icon from "@mui/icons-material/Co2";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import WaterDamageIcon from "@mui/icons-material/WaterDamage";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import "./widget.scss";

const Widget = ({ type, onClick, channelID, apiKey }) => {
  const [amount, setAmount] = useState(null);
  const [diff, setDiff] = useState(null);
  const [statusIcon, setStatusIcon] = useState(null);
  const [statusColor, setStatusColor] = useState(null);
  let data;
  switch (type) {
    case "co":
      data = {
        title: "CO",
        unit: "ppm",
        link: "See details",
        query: "users",
        threshold: 50, // Set your threshold value
        icon: (
          <SmokingRoomsIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "co2":
      data = {
        title: "CO2",
        unit: "ppm",
        link: "See details",
        threshold: 500, // Set your threshold value
        icon: (
          <Co2Icon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      break;
    case "pm25":
      data = {
        title: "PM2.5",
        unit: "mg/m³",
        link: "See details",
        threshold: 10, // Set your threshold value
        icon: (
          <CleaningServicesIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
      };
      break;
    case "temperature":
      data = {
        title: "TEMPERATURE",
        unit: "°C",
        query: "products",
        threshold: 25, // Set your threshold value
        link: "See details",
        icon: (
          <ThermostatIcon
            className="icon"
            style={{
              backgroundColor: "rgba(255, 165, 0, 0.2)",
              color: "orange",
            }}
          />
        ),
      };
      break;
    case "humidity":
      data = {
        title: "HUMIDITY",
        unit: "%",
        query: "products",
        threshold: 50, // Set your threshold value
        link: "See details",
        icon: (
          <WaterDamageIcon
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        let field;
        switch (type) {
          case "temperature":
            field = 'field1';
            break;
          case "humidity":
            field = 'field2';
            break;
          case "co":
            field = 'field4';
            break;
          case "co2":
            field = 'field3';
            break;
          case "pm25":
            field = 'field5';
            break;
          default:
            field = 'field1'; // Default to field1
        }

        const requestURL = `https://api.thingspeak.com/channels/2108417/feeds/last.json?api_key=J85BB1DHX3P9RW9Y`;
        const response = await fetch(requestURL);
        const responseData = await response.json();

        const latestValue = parseFloat(responseData[field]);
        setAmount(parseFloat(latestValue.toFixed(2)));

        if (latestValue < data.threshold) {
          setStatusIcon(<CheckCircleIcon style={{ color: "green", fontSize: "2rem" }} />);
          setStatusColor("green");
        } else if (latestValue >= data.threshold && latestValue <= 2 * data.threshold) {
          setStatusIcon(<ErrorIcon style={{ color: "orange", fontSize: "2rem" }} />);
          setStatusColor("orange");
          sendNotification(data.title + " has exceeded the threshold!");
          createNotificationEntry(data.title, "warning");
        } else {
          setStatusIcon(<WarningIcon style={{ color: "red", fontSize: "2rem" }} />);
          setStatusColor("red");
          sendNotification(data.title + " has exceeded the critical threshold!");
          createNotificationEntry(data.title, "error");
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [type, channelID, apiKey]);

  const sendNotification = (message) => {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification(message);
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification(message);
          }
        });
      }
    }
  };

  const createNotificationEntry = async (sensor, status) => {
    try {
      const notificationData = {
        timestamp: serverTimestamp(),
        [`${sensor}_status`]: status,
      };
      await addDoc(collection(db, "notifications"), notificationData);
    } catch (error) {
      console.error("Error creating notification entry:", error);
    }
  };

  return (
    <div className={`widget ${statusColor}`} onClick={onClick}>
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter"> {amount} {data.unit}</span>
        <span></span>
      </div>
      <div className="right">
        <div className="link">
          <div className="statusIcon">{statusIcon}</div>
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
