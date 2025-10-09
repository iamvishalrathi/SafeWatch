import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register components to ChartJS
ChartJS.register(ArcElement, Tooltip, Legend);

const Piegraph = (props) => {
  const total = props.male + props.female;
  const malePercentage = total > 0 ? ((props.male / total) * 100).toFixed(1) : 0;
  const femalePercentage = total > 0 ? ((props.female / total) * 100).toFixed(1) : 0;

  // Enhanced data with better colors and styling
  const data = {
    labels: ["Male", "Female"],
    datasets: [
      {
        label: "Gender Distribution",
        data: [props.male, props.female],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",  // Modern blue for Male
          "rgba(236, 72, 153, 0.8)",  // Modern pink for Female
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(236, 72, 153, 1)",
        ],
        borderWidth: 2,
        hoverOffset: 15,
        hoverBorderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#374151",
          font: {
            size: 13,
            weight: "600",
            family: "Inter, system-ui, sans-serif",
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: "easeInOutQuart",
    },
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <Pie data={data} options={options} />
    </div>
  );
};

export default Piegraph;
