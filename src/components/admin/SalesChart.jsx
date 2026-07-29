import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

const SalesChart = () => {
  const data = {
    labels: [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
    ],

    datasets: [
      {
        label: "Ventas ($)",

        data: [
          1800,
          2500,
          2100,
          3400,
          4200,
          3900,
        ],

        borderColor: "#17195A",

        backgroundColor: "rgba(229,184,63,.18)",

        fill: true,

        tension: 0.35,

        pointBackgroundColor: "#E5B83F",

        pointBorderColor: "#17195A",

        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },

      title: {
        display: true,
        text: "Ventas de los últimos 6 meses",
        font: {
          size: 18,
        },
      },
    },

    scales: {
      y: {
        beginAtZero: true,

        grid: {
          color: "#ececec",
        },
      },

      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="card dashboard-chart">

      <div className="card-body">

        <div
          style={{
            height: "350px",
          }}
        >
          <Line
            data={data}
            options={options}
          />
        </div>

      </div>

    </div>
  );
};

export default SalesChart;