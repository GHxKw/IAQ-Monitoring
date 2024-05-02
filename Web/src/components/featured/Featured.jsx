import React, { useEffect, useState } from "react";
import "./featured.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TagFacesIcon from '@mui/icons-material/TagFaces';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import MoodBadIcon from '@mui/icons-material/MoodBad';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const Featured = ({ type, onClick, channelID, apiKey }) => {
  const [amount, setAmount] = useState(null);
  const [statusIcon, setStatusIcon] = useState(null);
  const [diff, setDiff] = useState(null);
  const [unit, setUnit] = useState(null);
  const [median, setMedian] = useState(null);
  const [mode, setMode] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let field;
        switch (type) {
          case "temperature":
            field = 'field1';
            setUnit("°C");
            break;
          case "humidity":
            field = 'field2';
            setUnit("%");
            break;
          case "co":
            field = 'field4';
            setUnit("ppm");
            break;
          case "co2":
            field = 'field3';
            setUnit("ppm");
            break;
          case "pm25":
            field = 'field5';
            setUnit("mg/m³");
            break;
          default:
            field = 'field1'; // Default to field1
            setUnit(""); // You can set a default unit or leave it empty
        }

        // Fetch data from Thingspeak for the last 10 days
        const requestURL = `https://api.thingspeak.com/channels/${channelID}/feeds.json?days=40&average=0&api_key=${apiKey}`;
        const response = await fetch(requestURL);
        const data = await response.json();

        // Extract the relevant statistics
        const mean = calculateMean(data.feeds, field);
        const medianValue = calculateMedian(data.feeds, field);
        const modeValue = calculateMode(data.feeds, field);

        // Set the values in the state
        setAmount(parseFloat(mean.toFixed(2)));
        setMedian(parseFloat(medianValue.toFixed(2)));
        setMode(parseFloat(modeValue.toFixed(2)));

        // Determine the status based on your thresholds
        const goodThreshold = 20;
        const badThreshold = 80;

        if (mean < goodThreshold) {
          setStatusIcon(<TagFacesIcon style={{ color: "green", fontSize: "2rem" }} />);
        } else if (mean >= goodThreshold && mean <= badThreshold) {
          setStatusIcon(<SentimentSatisfiedIcon style={{ color: "orange", fontSize: "2rem" }} />);
        } else {
          setStatusIcon(<MoodBadIcon style={{ color: "red", fontSize: "2rem" }} />);
        }

        // Calculate and set the difference (commented out for now)
        // const today = new Date();
        // const lastMonth = new Date(new Date().setMonth(today.getMonth() - 1));
        // const prevMonth = new Date(new Date().setMonth(today.getMonth() - 2));
        // const lastMonthQuery = query(
        //   collection(db, "yourCollection"), // Replace with your actual collection name
        //   where("timeStamp", "<=", today),
        //   where("timeStamp", ">", lastMonth)
        // );
        // const prevMonthQuery = query(
        //   collection(db, "yourCollection"), // Replace with your actual collection name
        //   where("timeStamp", "<=", lastMonth),
        //   where("timeStamp", ">", prevMonth)
        // );
        // const lastMonthData = await getDocs(lastMonthQuery);
        // const prevMonthData = await getDocs(prevMonthQuery);
        // setDiff(
        //   ((lastMonthData.docs.length - prevMonthData.docs.length) / prevMonthData.docs.length) * 100
        // );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Initial fetch
    fetchData();

    // Fetch data at regular intervals (e.g., every 5 minutes)
    const intervalId = setInterval(fetchData, 5 * 60 * 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [type]);

  // Helper function to calculate the mean
  const calculateMean = (feeds, field) => {
    const sum = feeds.reduce((acc, feed) => acc + parseFloat(feed[field]), 0);
    const mean = sum / feeds.length;
    return mean;
  };

  // Helper function to calculate the median
  const calculateMedian = (feeds, field) => {
    const sortedValues = feeds.map((feed) => parseFloat(feed[field])).sort((a, b) => a - b);
    const middleIndex = Math.floor(sortedValues.length / 2);
    const median = sortedValues.length % 2 === 0
      ? (sortedValues[middleIndex - 1] + sortedValues[middleIndex]) / 2
      : sortedValues[middleIndex];
    return median;
  };

  // Helper function to calculate the mode
  const calculateMode = (feeds, field) => {
    const valueCounts = {};
    feeds.forEach((feed) => {
      const value = parseFloat(feed[field]);
      valueCounts[value] = (valueCounts[value] || 0) + 1;
    });

    let mode;
    let maxCount = 0;

    for (const [value, count] of Object.entries(valueCounts)) {
      if (count > maxCount) {
        maxCount = count;
        mode = parseFloat(value);
      }
    }

    return mode;
  };

  const classifyParameter = (value) => {
    if (value === null) {
      return { text: "Loading...", color: "gray" };
    }

    if (value < 20) {
      return { text: "Good", color: "green" };
    } else if (value >= 20 && value <= 80) {
      return { text: "Average", color: "orange" };
    } else {
      return { text: "Bad", color: "red" };
    }
  };

  return (
    <div className="featured" onClick={onClick}>
      <div className="top">
        <h1 className="title" style={{ fontSize: "1.5rem" }}>{type.toUpperCase()} Details</h1>
        <MoreVertIcon fontSize="small" />
      </div>
      <div className="bottom">
        <div className="featuredIcon">
          {statusIcon}
        </div>
        <p className="title" style={{ fontSize: "1.8rem" }}>Classification:</p>
        <p className="desc" style={{ fontSize: "2rem", color: classifyParameter(amount).color }}>
          {classifyParameter(amount).text}
        </p>
        <p className="amount" style={{ fontSize: "1.5rem" }}>Over 10 data points</p>

        <div className="summary">
          <div className="item">
            <div className="itemTitle" style={{ fontSize: "1rem" }}>Mean:</div>
            <div className={`itemResult ${diff < 0 ? "negative" : "positive"}`} style={{ fontSize: "1.2rem", color: classifyParameter(amount).color }}>
              <div className="resultAmount">{amount} {unit}</div>
            </div>
          </div>
          <div className="item">
            <div className="itemTitle" style={{ fontSize: "1rem" }}>Median:</div>
            <div className={`itemResult ${diff < 0 ? "negative" : "positive"}`} style={{ fontSize: "1.2rem", color: classifyParameter(median).color }}>
              <div className="resultAmount">{median} {unit}</div>
            </div>
          </div>
          <div className="item">
            <div className="itemTitle" style={{ fontSize: "1rem" }}>Mode:</div>
            <div className={`itemResult ${diff < 0 ? "negative" : "positive"}`} style={{ fontSize: "1.2rem", color: classifyParameter(mode).color }}>
              <div className="resultAmount">{mode} {unit}</div>
            </div>
          </div>
          {/* Additional items can be added as needed */}
        </div>
      </div>
    </div>
  );
};

export default Featured;
