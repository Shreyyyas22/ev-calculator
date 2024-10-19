import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ vehicleData, title }) => {
  if (!vehicleData) {
    return <p>No data available for pie chart</p>;
  }

  const chartData = {
    labels: ['Purchase Price', 'Charging/Fuel Cost', 'Maintenance', 'Insurance', 'Resale Value'],
    datasets: [
      {
        label: `${title} Breakdown`,
        data: [
          vehicleData.purchasePrice,
          vehicleData.chargingCost || vehicleData.fuelCost,
          vehicleData.maintenanceCost,
          vehicleData.insuranceCost,
          vehicleData.resaleValue,
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.3)',
          'rgba(255, 99, 132, 0.3)',
          'rgba(54, 162, 235, 0.3)',
          'rgba(255, 206, 86, 0.3)',
          'rgba(153, 102, 255, 0.3)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow custom size
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#ffffff', font: { size: 14 } },  // White text for dark theme
      },
      title: {
        display: true,
        text: `${title}`,
        color: '#ffffff',  // White text
        font: { size: 18 },
        padding: { top: 10, bottom: 30 },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `₹${tooltipItem.raw.toLocaleString()}`,
        },
        backgroundColor: 'rgba(0,0,0,0.7)',
        titleFont: { size: 16 },
        bodyFont: { size: 14 },
      },
    },
    animation: {
      duration: 1500,  // Animation duration
      easing: 'easeInOutCubic',  // Smooth animation
    },
  };

  return (
    <div className="mt-8 glassy-background p-4 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', borderRadius: '15px', width: '400px', height: '400px' }}>
      <Pie data={chartData} options={chartOptions} />
    </div>
  );
};

export default PieChart;
