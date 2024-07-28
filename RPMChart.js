import React from 'react';
import { Bar } from 'react-chartjs-2';
import useSocketData from './useSocketData';

import {
  Chart as ChartJS,
  CategoryScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RPMChart = () => {
  const rpmData = useSocketData();

  // Extracting controller IDs and RPM values from the data
  const labels = rpmData.map(data => `E${data.controllerId}`);
  const dataValues = rpmData.map(data => data.R);

  const chartData = {
    labels: labels,
    datasets: [
      {
        //dynamic bar color
        backgroundColor: (context) => {
          const index = context.dataIndex;
          const value = dataValues[index];
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          let gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          // Dangerous RPM
          if (value > 350) {
            gradient.addColorStop(0, '#55DD33');  // Transition from green
            gradient.addColorStop(1, 'red');    // to red
          } 
          else if (value <50 ){
            gradient.addColorStop(0, 'red');  // Transition from green
            gradient.addColorStop(1, 'red');    // to red
          }
          else {
            // Safe RPM
            gradient.addColorStop(0, '#55DD33');  // Solid green color
            gradient.addColorStop(1, '#55DD33');  // Solid green color
          }

          return gradient;
        },
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: dataValues,
      },
    ],
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Bar
        data={chartData}
        options={{
          plugins: {
            legend: false,
            title: {
              text: "RPM",
              display: true,
              fontSize: 16,
            }
          },
          maintainAspectRatio: false,
          responsive: true,
        }}
      />
    </div>
  );
}

export default RPMChart;