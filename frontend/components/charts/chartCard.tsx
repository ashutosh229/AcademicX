import { ChartCardProps } from "@/types/types";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import GaugeChart from "react-gauge-chart";

// Register Chart.js components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const ChartCard: React.FC<ChartCardProps> = ({ metricName, metricData }) => {
  const barData = {
    labels: metricData.distribution.map((d) => d.value.toString()),
    datasets: [
      {
        label: "Count",
        data: metricData.distribution.map((d) => d.count),
        backgroundColor: "#29AB87",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    scales: {
      x: { type: "category" as const }, // Explicitly set category type
      y: { beginAtZero: true },
    },
  };

  let averageValue = metricData.average;
  if (metricData.average === -1) {
    averageValue = 0;
  }

  const stableGaugeChart = useMemo(
    () => (
      <GaugeChart
        id={metricName}
        nrOfLevels={11}
        arcsLength={[0.2, 0.4, 0.4]}
        colors={["#FF5F6D", "#FFC371", "#29AB87"]}
        percent={averageValue / 10}
        textColor="#000"
        animate={false} // Disable animation
      />
    ),
    [metricName, averageValue]
  );

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">{metricName}</h3>
      {stableGaugeChart}
      <p className="text-center mt-2">Average: {averageValue.toFixed(2)}/10</p>
      <Bar data={barData} options={barOptions} className="mt-4" />
    </div>
  );
};

export default ChartCard;
