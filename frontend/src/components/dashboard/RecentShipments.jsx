import { useEffect, useState } from "react";

import { Package, Building2, IndianRupee } from "lucide-react";

import api from "../../api/axios";

const RecentShipments = () => {
  const [shipments, setShipments] = useState([]);

  const getShipments = async () => {
    try {
      const res = await api.get("/shipments");

      setShipments(res.data.slice(0, 5));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getShipments();
  }, []);

  return (
    <div
      className="

bg-white

rounded-[26px]

border

border-gray-100

shadow-sm

p-5

"
    >
      <h3
        className="
text-xl
font-bold
mb-5
"
      >
        Recent Shipments
      </h3>

      {/* DESKTOP TABLE */}

      <div className="hidden md:block">
        <table className="w-full">
          <thead>
            <tr className="text-gray-400 border-b">
              <th className="text-left py-3">Shipment</th>

              <th className="text-left">Customer</th>

              <th>Status</th>

              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            {shipments.map((item) => (
              <tr key={item.id} className="border-b last:border-none">
                <td className="py-5 font-semibold">{item.shipment_id}</td>

                <td>{item.company_name}</td>

                <td className="text-center">
                  <span
                    className="
bg-gray-100
rounded-full
px-3
py-1
text-sm
"
                  >
                    {item.status.replaceAll("_", " ")}
                  </span>
                </td>

                <td className="font-bold text-center">₹{item.shipment_cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE VERSION */}

      <div className="md:hidden space-y-4">
        {shipments.map((item) => (
          <div
            key={item.id}
            className="

border

border-gray-100

rounded-3xl

p-4

shadow-sm

"
          >
            <div className="flex items-center gap-3">
              <div
                className="
w-11
h-11
rounded-2xl
bg-gray-50
text-[#246BED]
flex
items-center
justify-center
"
              >
                <Package size={20} />
              </div>

              <div className="overflow-hidden">
                <h4
                  className="
font-bold
truncate
"
                >
                  {item.shipment_id}
                </h4>

                <p className="text-xs text-gray-400">Shipment ID</p>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400 flex gap-2">
                  <Building2 size={15} />
                  Customer
                </span>

                <b className="truncate max-w-[150px]">{item.company_name}</b>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>

                <span
                  className="
bg-gray-100
rounded-full
px-3
py-1
text-xs
"
                >
                  {item.status.replaceAll("_", " ")}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400 flex gap-1">
                  <IndianRupee size={15} />
                  Amount
                </span>

                <b>₹{item.shipment_cost}</b>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentShipments;
