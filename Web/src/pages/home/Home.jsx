import React, { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import Chart from "../../components/chart/Chart";
import Table from "../../components/table/Table";
import Featured from '../../components/featured/Featured';
import Map from "../../components/map/Map";

const Home = () => {
  const [selectedParameter, setSelectedParameter] = useState("field1");
  const [selectedType, setSelectedType] = useState("co"); // Default type for Featured

  const handleWidgetClick = (parameter, type) => {
    setSelectedParameter(parameter);
    setSelectedType(type);
  };

  // Helper function to get a more descriptive title for the selected parameter
  const getChartTitle = (parameter) => {
    switch (parameter) {
      case "field1":
        return "Temperature Data";
      case "field2":
        return "Humidity Data";
      case "field4":
        return "CO Data";
      case "field3":
        return "CO2 Data";
      case "field5":
        return "PM2.5 Data";
      default:
        return "Unknown Data";
    }
  };

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">
          {/* Pass a click handler to each widget */}
          <Widget channelID="2108417" apiKey="J85BB1DHX3P9RW9Y" type="co" onClick={() => handleWidgetClick("field4", "co")} />
          <Widget channelID="2108417" apiKey="J85BB1DHX3P9RW9Y" type="co2" onClick={() => handleWidgetClick("field3", "co2")} />
          <Widget channelID="2108417" apiKey="J85BB1DHX3P9RW9Y" type="pm25" onClick={() => handleWidgetClick("field5", "pm25")} />
          <Widget channelID="2108417" apiKey="J85BB1DHX3P9RW9Y" type="temperature" onClick={() => handleWidgetClick("field1", "temperature")} />
          <Widget channelID="2108417" apiKey="J85BB1DHX3P9RW9Y" type="humidity" onClick={() => handleWidgetClick("field2", "humidity")} />
        </div>
        <div className="charts">
          {/* Use the Featured component with the selected parameter */}
          <Featured type={selectedType} channelID="2108417" apiKey="J85BB1DHX3P9RW9Y" />
          {/* Use the Chart component here with the selected parameter */}
          <Chart
            channelID="2108417"
            apiKey="J85BB1DHX3P9RW9Y"
            title={getChartTitle(selectedParameter)}
            aspect={3 / 1}
            dataDays="40"
            dataAvg="0"
            field={selectedParameter}
          />
        </div>
        <div className="listContainer">
          <div className="listTitle">Device Location</div>
          <Map channelId="2108417" apiKey="J85BB1DHX3P9RW9Y" />
        </div>
      </div>
    </div>
  );
};

export default Home;
