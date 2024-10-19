import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TCOChart = ({ data }) => {
  const [isCumulative, setIsCumulative] = useState(false);
  const [breakEvenYear, setBreakEvenYear] = useState(null); // To track the break-even year

  // Calculate the break-even point when EV becomes more cost-effective than ICE
  useEffect(() => {
    if (data && data.ev && data.ice) {
      const years = Array.from({ length: data.ev.yearsOfOwnership }, (_, i) => i + 1);

      const evYearlyCost = years.map((year) => (
        data.ev.purchasePrice +
        year * data.ev.chargingCost +
        year * data.ev.maintenanceCost +
        year * data.ev.insuranceCost -
        (data.ev.resaleValue / data.ev.yearsOfOwnership) * year
      ));

      const iceYearlyCost = years.map((year) => (
        data.ice.purchasePrice +
        year * data.ice.fuelCost +
        year * data.ice.maintenanceCost +
        year * data.ice.insuranceCost -
        (data.ice.resaleValue / data.ice.yearsOfOwnership) * year
      ));

      // Find the year when EV costs are less than or equal to ICE costs (break-even year)
      const breakEven = years.find((year, index) => evYearlyCost[index] <= iceYearlyCost[index]);
      setBreakEvenYear(breakEven ? breakEven : null);
    }
  }, [data]);

  if (!data || !data.ev || !data.ice) {
    return <p className="text-center text-gray-300">No data available for chart</p>;
  }

  const years = Array.from({ length: data.ev.yearsOfOwnership }, (_, i) => i + 1);

  const evYearlyCost = years.map((year) => (
    data.ev.purchasePrice +
    year * data.ev.chargingCost +
    year * data.ev.maintenanceCost +
    year * data.ev.insuranceCost -
    (data.ev.resaleValue / data.ev.yearsOfOwnership) * year
  ));

  const iceYearlyCost = years.map((year) => (
    data.ice.purchasePrice +
    year * data.ice.fuelCost +
    year * data.ice.maintenanceCost +
    year * data.ice.insuranceCost -
    (data.ice.resaleValue / data.ice.yearsOfOwnership) * year
  ));

  // Cumulative Costs
  const cumulativeEV = evYearlyCost.map((_, index) => evYearlyCost.slice(0, index + 1).reduce((acc, value) => acc + value, 0));
  const cumulativeICE = iceYearlyCost.map((_, index) => iceYearlyCost.slice(0, index + 1).reduce((acc, value) => acc + value, 0));

  // Chart Data
  const chartData = {
    labels: years.map((year) => `Year ${year}`),
    datasets: [
      {
        label: 'Electric Vehicle (EV)',
        data: isCumulative ? cumulativeEV : evYearlyCost,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.3,  // Smooth curve
        fill: true,
      },
      {
        label: 'Internal Combustion Engine (ICE)',
        data: isCumulative ? cumulativeICE : iceYearlyCost,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.3,  // Smooth curve
        fill: true,
      },
    ],
  };

  // Chart Options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow custom width and height
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#ffffff',  // Legend text color for dark theme
        },
      },
      title: {
        display: true,
        text: `Total Cost of Ownership Over Time (₹) ${isCumulative ? '(Cumulative)' : ''}`,
        color: '#ffffff',  // Chart title text color for dark theme
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `₹${tooltipItem.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#ffffff' },  // X-axis text color for dark theme
      },
      y: {
        ticks: { 
          color: '#ffffff',
          callback: (value) => `₹${value.toLocaleString()}`,  // Format y-axis with ₹
        },
      },
    },
    animation: {
      duration: 1500,  // Animation duration for smoother loading
      easing: 'easeInOutCubic',  // Smooth easing effect for animations
    },
  };

  return (
    <div
      className="mt-8 p-4 rounded-lg"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '15px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Toggle for Cumulative Cost */}
      <div className="flex justify-end mb-4">
        <label className="cursor-pointer flex items-center text-white">
          <input
            type="checkbox"
            checked={isCumulative}
            onChange={() => setIsCumulative(!isCumulative)}
            className="mr-2"
          />
          Show Cumulative Cost
        </label>
      </div>

      {/* Line Chart */}
      <div style={{ height: '400px' }}>
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Break-Even Point Display */}
      {breakEvenYear && (
        <div className="text-center text-white font-semibold mt-4">
          EV becomes more cost-effective than ICE after Year {breakEvenYear}.
        </div>
      )}
    </div>
  );
};

export default TCOChart;
