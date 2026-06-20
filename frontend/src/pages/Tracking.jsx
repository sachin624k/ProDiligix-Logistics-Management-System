import axios from "axios";
import { useState } from "react";

import {
  Search,
  CheckCircle2,
  Circle,
  MapPin,
  Clock,
  Truck,
  PackageCheck,
} from "lucide-react";

import { format } from "date-fns";

const Tracking = () => {
  const [shipmentId, setShipmentId] = useState("");

  const [data, setData] = useState(null);

  const steps = [
    "BOOKED",
    "PICKED_UP",
    "IN_TRANSIT",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
  ];

  // TRACK API
  const trackShipment = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:8000/api/tracking/${shipmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setData(res.data);
    } catch (error) {
      alert("Shipment not found");
    }
  };

  // FIXED PROGRESS LOGIC
  const currentIndex = data ? steps.indexOf(data.shipment.status) : -1;

  const progress = data
    ? Math.round(((currentIndex + 1) / steps.length) * 100)
    : 0;

  return (
    <div>
      {/* PAGE HEADER */}

      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Shipment Tracking
        </h1>

        <p className="text-gray-500 mt-1">Monitor shipment journey live</p>
      </div>

      {/* SEARCH */}

      <div
        className="
          mt-8
          bg-white
          rounded-[28px]
          border
          border-gray-100
          shadow-sm
          p-5
          flex
          flex-col
          lg:flex-row
          gap-4
        "
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-4 text-gray-400" />

          <input
            value={shipmentId}
            onChange={(e) => setShipmentId(e.target.value)}
            placeholder="Enter Shipment ID"
            className="
              w-full
              rounded-2xl
              border
              border-gray-200
              py-4
              pl-14
              outline-none
              focus:ring-2
              focus:ring-blue-100
            "
          />
        </div>

        <button
          onClick={trackShipment}
          className="
            bg-[#246BED]
            text-white
            rounded-2xl
            px-10
            py-4
            font-semibold
            shadow-md
          "
        >
          Track
        </button>
      </div>

      {data && (
        <>
          {/* SUMMARY CARD */}

          <div
            className="
              mt-8
              bg-white
              rounded-[30px]
              border
              border-gray-100
              shadow-sm
              p-6
            "
          >
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex gap-4">
                <div
                  className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-blue-50
                    text-[#246BED]
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Truck />
                </div>

                <div>
                  <h2 className="font-bold text-xl">
                    {data.shipment.shipment_id}
                  </h2>

                  <p className="text-gray-500">
                    {data.shipment.carrier_name || "Logistics Partner"}
                  </p>
                </div>
              </div>

              <div className="bg-gray-100 rounded-full px-5 py-2 h-fit font-semibold">
                {data.shipment.status.replaceAll("_", " ")}
              </div>
            </div>

            {/* ROUTE */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
              <div className="bg-gray-50 rounded-2xl p-5">
                <p className="text-gray-400 text-sm">Pickup Location</p>

                <h3 className="font-semibold">
                  {data.shipment.pickup_location}
                </h3>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5">
                <p className="text-gray-400 text-sm">Delivery Location</p>

                <h3 className="font-semibold">
                  {data.shipment.delivery_location}
                </h3>
              </div>
            </div>

            {/* PROGRESS */}

            <div className="mt-8">
              <div className="flex justify-between">
                <p className="text-gray-500">Delivery Progress</p>

                <p className="font-bold text-[#246BED]">{progress}%</p>
              </div>

              <div
                className="
                  h-3
                  bg-gray-100
                  rounded-full
                  mt-3
                  overflow-hidden
                "
              >
                <div
                  style={{
                    width: `${progress}%`,
                  }}
                  className="
                    h-full
                    bg-[#246BED]
                    rounded-full
                    transition-all
                    duration-700
                  "
                />
              </div>
            </div>
          </div>

          {/* TIMELINE */}

          <div
            className="
              mt-8
              bg-white
              rounded-[30px]
              border
              border-gray-100
              shadow-sm
              p-6
              md:p-8
            "
          >
            <h2 className="text-xl md:text-2xl font-bold mb-10">
              Tracking Timeline
            </h2>

            {steps.map((step, index) => {
              const history = data.tracking.find((x) => x.status === step);

              const done = index <= currentIndex;

              return (
                <div key={step} className="relative flex gap-5">
                  {index !== steps.length - 1 && (
                    <div
                      className={`
                        absolute
                        left-[13px]
                        top-8
                        w-[2px]
                        h-full

                        ${done ? "bg-[#246BED]" : "bg-gray-200"}
                      `}
                    />
                  )}

                  <div className="z-10 bg-white">
                    {done ? (
                      <CheckCircle2 className="text-[#246BED]" />
                    ) : (
                      <Circle className="text-gray-300" />
                    )}
                  </div>

                  <div className="pb-10">
                    <h3
                      className={`
                        font-bold

                        ${done ? "text-gray-900" : "text-gray-400"}
                      `}
                    >
                      {step.replaceAll("_", " ")}
                    </h3>

                    {done && (
                      <>
                        <p className="flex gap-2 text-gray-500 mt-2">
                          <MapPin size={15} />

                          {history?.location || "Warehouse"}
                        </p>

                        <p className="mt-1 text-sm">
                          {history?.remarks ||
                            `Shipment ${step.replaceAll("_", " ")}`}
                        </p>

                        {history?.updated_at && (
                          <p className="flex gap-2 text-gray-400 text-sm mt-2">
                            <Clock size={14} />

                            {format(
                              new Date(history.updated_at),
                              "dd MMM yyyy hh:mm a",
                            )}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {!data && (
        <div className="mt-20 flex flex-col items-center text-gray-400">
          <PackageCheck size={70} />

          <p className="mt-4">Enter shipment ID to start tracking</p>
        </div>
      )}
    </div>
  );
};

export default Tracking;
