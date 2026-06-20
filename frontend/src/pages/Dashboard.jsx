import { useEffect, useState } from "react";

import { Users, Package, Truck, IndianRupee, CheckCircle } from "lucide-react";

import api from "../api/axios";

import ShipmentStatusChart from "../components/dashboard/ShipmentStatusChart";
import ShipmentModeChart from "../components/dashboard/ShipmentModeChart";
import RecentShipments from "../components/dashboard/RecentShipments";

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await api.get("/dashboard");

      setStats(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cards = [
    {
      title: "Customers",
      value: stats?.cards?.customers || 0,
      icon: <Users />,
    },
    {
      title: "Shipments",
      value: stats?.cards?.shipments || 0,
      icon: <Package />,
    },
    {
      title: "Transit",
      value: stats?.cards?.transit || 0,
      icon: <Truck />,
    },
    {
      title: "Delivered",
      value: stats?.cards?.delivered || 0,
      icon: <CheckCircle />,
    },
    {
      title: "Revenue",
      value: `₹${Number(stats?.cards?.revenue || 0).toLocaleString("en-IN")}`,
      icon: <IndianRupee />,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
        Dashboard Overview
      </h1>

      <p className="text-gray-500 mt-1">Real time logistics insights</p>

      {/* CARDS */}
      <div
        className="
          grid
          grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          2xl:grid-cols-5
          gap-5
          mt-8
        "
      >
        {cards.map((card, index) => (
          <div
            key={index}
            className={`
              bg-white
              rounded-[26px]
              border
              border-gray-100
              shadow-sm
              hover:shadow-xl
              transition
              p-5
              min-h-[150px]

              ${index === 4 ? "max-md:col-span-2" : ""}
            `}
          >
            <div className="flex justify-between items-center h-full">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  {card.title}
                </p>

                <h2 className="text-3xl font-bold mt-5">{card.value}</h2>
              </div>

              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-gradient-to-br
                  from-[#246BED]
                  to-[#4338CA]
                  text-white
                  flex
                  items-center
                  justify-center
                  shadow-lg
                "
              >
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CHART */}
      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
          mt-8
        "
      >
        <ShipmentStatusChart data={stats?.charts?.status} />

        <ShipmentModeChart data={stats?.charts?.mode} />
      </div>

      <div className="mt-8">
        <RecentShipments />
      </div>
    </div>
  );
};

export default Dashboard;
