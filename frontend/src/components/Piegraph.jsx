import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register components to ChartJS
ChartJS.register(ArcElement, Tooltip, Legend);

const Piegraph = (props) => {
  // Sample data for gender distribution
  const data = {
    labels: ["Male", "Female"],
    datasets: [
      {
        label: "Gender Distribution",
        data: [props.male, props.female], // Example data (you can replace this with actual data)
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)", // Blue for Male
          "rgba(255, 99, 132, 0.6)", // Pink for Female
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const dataset = tooltipItem.dataset;
            const total = dataset.data.reduce(
              (prevValue, curValue) => prevValue + curValue
            );
            const currentValue = dataset.data[tooltipItem.dataIndex];
            const percentage = ((currentValue / total) * 100).toFixed(2);
            return `${tooltipItem.label}: ${percentage}%`;
          },
        },
      },
    },
  };

  return (
    <div>
      <h2 className="text-white font-bold text-base">
        Gender Distribution in the Area
      </h2>
      <Pie data={data} options={options} />
    </div>
  );
};

export default Piegraph;
