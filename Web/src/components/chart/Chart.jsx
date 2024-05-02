// import React, { useEffect, useState } from 'react';
// import Highcharts from 'highcharts';
// import HighchartsReact from 'highcharts-react-official';
// import './chart.scss';

// const Chart = ({ channelID, dataDays, dataAvg, apiKey }) => {
//   const [chartOptions, setChartOptions] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const requestURL = `https://api.thingspeak.com/channels/${channelID}/feeds.json?days=${dataDays}&average=${dataAvg}&api_key=${apiKey}`;
//         const response = await fetch(requestURL);
//         const data = await response.json();

//         // Process data and create Highcharts options
//         const options = {
//           chart: {
//             type: 'spline',
//           },
//           title: {
//             text: 'Weather History',
//           },
//           xAxis: {
//             type: 'datetime',
//           },
//           yAxis: [
//             { opposite: false, labels: { format: '{value}°C' }, title: { text: 'Temperature' } },
//             { opposite: true, labels: { format: '{value} hPa' }, title: { text: 'Pressure' } },
//             { opposite: false, labels: { format: '{value} %rH' }, title: { text: 'Humidity' } },
//           ],
//           tooltip: {
//             shared: true,
//           },
//           series: [
//             { name: 'Temperature', yAxis: 0, data: processData(data, 'field1') },
//             // { name: 'Dew point', yAxis: 0, data: processData(data, 'field4') },
//             { name: 'Pressure', yAxis: 1, data: processData(data, 'field2') },
//             { name: 'Humidity', yAxis: 2, data: processData(data, 'field3') },
//           ],
//         };

//         setChartOptions(options);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     // Initial fetch
//     fetchData();

//     // Fetch data at regular intervals (e.g., every 5 minutes)
//     const intervalId = setInterval(fetchData, 5 * 60 * 1000);

//     // Clean up the interval on component unmount
//     return () => clearInterval(intervalId);
//   }, [channelID, dataDays, dataAvg, apiKey]);

//   const processData = (wxData, field) => {
//     return wxData.feeds.map((feed) => [Date.parse(feed.created_at), parseFloat(feed[field])]);
//   };

//   return (
//     <div className="chart">
//       <div className="title">Weather History</div>
//       {chartOptions && <HighchartsReact highcharts={Highcharts} options={chartOptions} />}
//     </div>
//   );
// };

// export default Chart;

import "./chart.scss";
import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const Chart = ({ aspect, title, channelID, apiKey, dataDays, dataAvg, field }) => {
  const [chartData, setChartData] = useState([]);

  const fetchData = async () => {
    try {
      const requestURL = `https://api.thingspeak.com/channels/${channelID}/feeds.json?days=${dataDays}&average=${dataAvg}&api_key=${apiKey}`;
      const response = await fetch(requestURL);
      const data = await response.json();

      // Process data and update state
      const processedData = processData(data);
      setChartData(processedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const processData = (wxData) => {
    return wxData.feeds.map((feed) => ({
      name: new Date(feed.created_at).toLocaleDateString(),
      [field]: parseFloat(feed[field]),
    }));
  };

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Fetch data at regular intervals (e.g., every 5 minutes)
    const intervalId = setInterval(fetchData, 5 * 60 * 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [channelID, apiKey, dataDays, dataAvg, field]);

  const renderTooltip = ({ label, payload }) => {
    if (!payload || payload.length === 0) {
      return null;
    }

    return (
      <div className="custom-tooltip">
        <p>Date: {label}</p>
        {payload.map(entry => (
          <p key={entry.dataKey}>{getFieldLabel(entry.dataKey)}: {entry.value} {getUnitLabel(entry.dataKey)}</p>
        ))}
      </div>
    );
  };

  const getFieldLabel = (field) => {
    const fieldLabels = {
      field1: 'Temp',
      field2: 'Hum',
      field3: 'CO2',
      field4: 'CO',
      field5: 'PM2.5',
      // Add labels for other fields as needed
    };

    return fieldLabels[field] || field;
  };

  const getUnitLabel = (field) => {
    const unitLabels = {
      field1: '°C',
      field2: '%',
      field3: 'ppm',
      field4: 'ppm',
      field5: 'mg/m³',
      // Add unit labels for other fields as needed
    };

    return unitLabels[field] || '';
  };

  const yData = chartData.map((data) => data[field]);
  const yMin = Math.min(...yData);
  const yMax = Math.max(...yData);
  const yDomain = [Math.floor(yMin / 50) * 50, Math.ceil(yMax / 50) * 50];

  return (
    <div className="chart">
      <div className="title">{title}</div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <AreaChart
          width={730}
          height={250}
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={field} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="gray" tick={{ fontSize: 10 }} />
          <YAxis domain={yDomain} tick={{ fontSize: 10 }} />
          <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
          <Tooltip content={renderTooltip} />
          <Area
            type="monotone"
            dataKey={field}
            stroke="#8884d8"
            fillOpacity={1}
            fill={`url(#${field})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;


