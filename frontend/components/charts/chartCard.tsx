import React from "react";
import { Bar } from "react-chartjs-2";
import GaugeChart from "react-gauge-chart";

interface ChartCardProps {
  metricName: string;
  metricData: {
    average: number;
    distribution: { value: number; count: number }[];
  };
}

const ChartCard: React.FC<ChartCardProps> = ({ metricName, metricData }) => {
  const barData = {
    labels: metricData.distribution.map((d) => {
      return d.value.toString();
    }),
    datasets: [
      {
        label: "Count",
        data: metricData.distribution.map((d) => {
          return d.count;
        }),
        backgroundColor: "#29AB87",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true },
    },
  };

  return (
    <>
      <div>
        <h3 className="text-lg font-medium mb-4">{metricName}</h3>
        <GaugeChart
          id="content-toughness-gauge"
          nrOfLevels={11}
          arcsLength={[0.2, 0.4, 0.4]}
          colors={["#FF5F6D", "#FFC371", "#29AB87"]}
          percent={metricData.average / 10}
          textColor="#000"
        />
        <p className="text-center mt-2">Average: {metricData.average}/10</p>
        <Bar data={barData} options={barOptions} className="mt-4" />
      </div>
    </>
  );
};

export default ChartCard;
