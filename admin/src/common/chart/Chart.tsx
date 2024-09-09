import "./chart.scss";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TooltipProps } from "recharts";

// Define the types for the Chart component
interface DataPoint {
  name: string;
  "Bills Votes"?: number; // Optional fields for better flexibility
  "Election Votes"?: number; // Optional fields for better flexibility
}

interface ChartProps {
  aspect: number;
  title: string;
  data: DataPoint[];
  dataKeys: string[];
  CustomTooltip?: React.FC<TooltipProps<number, string>>;
  grid?: boolean;
}

const Chart: React.FC<ChartProps> = ({
  aspect,
  title,
  data,
  dataKeys,
  CustomTooltip,
  grid, // Optional: if you have a grid prop
}) => {
  return (
    <div className="chart__box light_shadow">
      <div className="title">{title}</div>
      <ResponsiveContainer aspect={aspect}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 5, left: 5, bottom: 0 }}
        >
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="gray" />
          {grid && (
            <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
          )}
          {CustomTooltip && <Tooltip content={<CustomTooltip />} />}
          {dataKeys.map((key) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#total)"
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
