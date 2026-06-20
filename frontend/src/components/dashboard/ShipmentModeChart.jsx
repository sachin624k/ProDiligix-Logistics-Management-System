import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = ["#246BED", "#3B82F6", "#60A5FA", "#93C5FD"];

const ShipmentModeChart = ({ data = [] }) => {
  const chartData = data.map((item) => ({
    name: item.shipment_mode,

    count: Number(item.count),
  }));

  return (
    <div
      className="

bg-white

rounded-[26px]

border

border-gray-100

shadow-sm

p-5

h-[330px]

md:h-[380px]

"
    >
      <h2
        className="
text-xl
font-bold
mb-3
"
      >
        Shipment Mode
      </h2>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={chartData}
          barCategoryGap={60}
          margin={{
            top: 20,

            right: 20,

            bottom: 10,

            left: -15,
          }}
        >
          <XAxis dataKey="name" axisLine={false} tickLine={false} />

          <YAxis axisLine={false} tickLine={false} />

          <Tooltip />

          <Bar dataKey="count" radius={[14, 14, 14, 14]} barSize={70}>
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ShipmentModeChart;
