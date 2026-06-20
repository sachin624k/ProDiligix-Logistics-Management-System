import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#2563EB",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#64748B",
];

const ShipmentStatusChart = ({ data = [] }) => {
  const chartData = data.map((item) => ({
    name: item.status.replaceAll("_", " "),
    value: Number(item.count),
  }));

  return (
    <div className="bg-white rounded-[26px] border border-gray-100 shadow-sm p-5 h-[330px] md:h-[380px]">
      <h2 className="text-xl font-bold mb-3 text-gray-900">Shipment Status</h2>

      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius="45%"
            outerRadius="70%"
            paddingAngle={7}
            cornerRadius={8}
          >
            {chartData.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              borderRadius: "16px",
              border: "none",
              boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
            }}
          />

          <Legend
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{
              fontSize: "12px",
              paddingTop: "15px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ShipmentStatusChart;
