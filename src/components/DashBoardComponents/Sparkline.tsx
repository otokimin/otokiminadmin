import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

interface Props {
  data: number[];
  color?: string;
}

const Sparkline = ({ data, color = "#ffffff" }: Props) => {
  const chartData = {
    labels: data.map((_, i) => i),
    datasets: [
      { data, borderColor: color, borderWidth: 2, pointRadius: 0, fill: false, tension: 0.3 }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { tooltip: { enabled: false } },
    scales: { x: { display: false }, y: { display: false } }
  };

  return (
    <div style={{ height: 35, width: "100%",marginTop:10 }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default Sparkline;
