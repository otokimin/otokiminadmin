import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

interface Props {
  data: number[];
  color?: string;
}

const MiniAreaChart = ({ data, color = "#16a34a" }: Props) => {
  const chartData = {
    labels: data.map((_, i) => i),
    datasets: [
      {
        data,
        borderColor: color,
        backgroundColor: color + "33",
        borderWidth: 2,
        pointRadius: 0,
        fill: true,
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { tooltip: { enabled: false } },
    scales: { x: { display: false }, y: { display: false } }
  };

  return (
    <div style={{ height: 35 }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default MiniAreaChart;
