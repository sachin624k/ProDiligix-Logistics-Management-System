import { Plus, Eye, Edit, Trash2, Package, X } from "lucide-react";

import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

const Shipments = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [shipments, setShipments] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [selectedShipment, setSelectedShipment] = useState(null);

  const emptyForm = {
    customer_id: "",
    pickup_location: "",
    delivery_location: "",
    shipment_mode: "SURFACE",
    weight: "",
    carrier_name: "",
    expected_delivery_date: "",
    shipment_cost: "",
  };

  const [form, setForm] = useState(emptyForm);

  // LOAD
  const fetchShipments = async () => {
    const res = await api.get("/shipments");

    setShipments(res.data);
  };

  const fetchCustomers = async () => {
    const res = await api.get("/customers");

    setCustomers(res.data);
  };

  useEffect(() => {
    fetchShipments();
    fetchCustomers();
  }, []);

  // CREATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/shipments", form);

      toast.success("Shipment created");

      setOpen(false);

      setForm(emptyForm);

      fetchShipments();
    } catch (error) {
      toast.error("Create failed");
    }
  };

  // EDIT
  const updateShipment = async () => {
    try {
      await api.put(`/shipments/${selectedShipment.id}`, selectedShipment);

      toast.success("Shipment updated");

      setEditOpen(false);

      fetchShipments();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  // STATUS
  const updateStatus = async (item, status) => {
    try {
      await api.post(`/tracking/${item.id}`, {
        status,
        location: "Warehouse",
        remarks: `Shipment ${status.replaceAll("_", " ")}`,
      });

      toast.success("Status updated");

      fetchShipments();
    } catch (error) {
      toast.error("Status failed");
    }
  };

  // DELETE
  const deleteShipment = (id) => {
    toast(
      <div className="p-1">
        <h3 className="text-gray-900 font-bold text-base">Delete Shipment?</h3>

        <p className="text-gray-500 text-sm mt-1">
          This shipment record will be permanently removed.
        </p>

        <div className="flex gap-3 mt-5">
          <button
            onClick={async () => {
              try {
                await api.delete(`/shipments/${id}`);

                toast.dismiss();

                toast.success("Shipment deleted successfully");

                fetchShipments();
              } catch (error) {
                toast.error(error.response?.data?.message || "Delete failed");
              }
            }}
            className="
              flex-1
              bg-[#246BED]
              hover:bg-[#1d55c9]
              text-white
              px-4
              py-2.5
              rounded-xl
              font-medium
              transition
            "
          >
            Delete
          </button>

          <button
            onClick={() => toast.dismiss()}
            className="
              flex-1
              bg-gray-100
              hover:bg-gray-200
              text-gray-700
              px-4
              py-2.5
              rounded-xl
              font-medium
              transition
            "
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeButton: false,
        closeOnClick: false,
        draggable: false,
        position: "top-center",
      },
    );
  };
  return (
    <div>
      {/* HEADER */}

      <div className="flex flex-col sm:flex-row justify-between gap-5 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Shipments</h1>

          <p className="text-gray-500">Manage logistics shipments</p>
        </div>

        {["ADMIN", "OPERATIONS"].includes(user?.role) && (
          <button
            onClick={() => setOpen(true)}
            className="
              bg-gradient-to-r
              from-[#246BED]
              to-indigo-600
              text-white
              rounded-2xl
              px-6
              py-3
              shadow-lg
              flex
              items-center
              justify-center
              gap-2
            "
          >
            <Plus />
            Create Shipment
          </button>
        )}
      </div>

      {/* MOBILE CARDS */}

      <div className="md:hidden space-y-5">
        {shipments.map((item) => (
          <div
            key={item.id}
            className="
              bg-white
              rounded-[26px]
              border
              shadow-sm
              p-5
            "
          >
            <div className="flex justify-between">
              <div className="flex gap-3">
                <div
                  className="
                    w-12
                    h-12
                    rounded-xl
                    bg-blue-50
                    text-[#246BED]
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Package />
                </div>

                <div>
                  <h3 className="font-bold text-sm">{item.shipment_id}</h3>

                  <p className="text-xs text-gray-400">{item.carrier_name}</p>
                </div>
              </div>

              <span
                className="
                  bg-blue-50
                  text-[#246BED]
                  h-fit
                  px-3
                  py-1
                  rounded-full
                  text-xs
                "
              >
                {item.shipment_mode}
              </span>
            </div>

            <div className="mt-5 space-y-3">
              <div>
                <p className="text-xs text-gray-400">Customer</p>

                <p className="font-semibold">{item.company_name}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Amount</p>

                <p className="font-bold">₹{item.shipment_cost}</p>
              </div>
            </div>

            <select
              value={item.status}
              onChange={(e) => updateStatus(item, e.target.value)}
              className="
                mt-5
                w-full
                bg-blue-50
                text-[#246BED]
                rounded-xl
                p-3
                font-medium
              "
            >
              <option>BOOKED</option>
              <option>PICKED_UP</option>
              <option>IN_TRANSIT</option>
              <option>OUT_FOR_DELIVERY</option>
              <option>DELIVERED</option>
              <option>EXCEPTION</option>
            </select>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => {
                  setSelectedShipment(item);
                  setViewOpen(true);
                }}
                className="
                  flex-1
                  bg-blue-50
                  rounded-xl
                  py-3
                  flex
                  justify-center
                "
              >
                <Eye />
              </button>

              {["ADMIN", "OPERATIONS"].includes(user?.role) && (
                <button
                  onClick={() => {
                    setSelectedShipment(item);
                    setEditOpen(true);
                  }}
                  className="
                    flex-1
                    bg-yellow-50
                    rounded-xl
                    py-3
                    flex
                    justify-center
                  "
                >
                  <Edit />
                </button>
              )}

              {user?.role === "ADMIN" && (
                <button
                  onClick={() => deleteShipment(item.id)}
                  className="
                    flex-1
                    bg-red-50
                    rounded-xl
                    py-3
                    flex
                    justify-center
                  "
                >
                  <Trash2 />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE */}

      <div
        className="
          hidden
          md:block
          bg-white
          rounded-[26px]
          border
          shadow-sm
          p-5
          overflow-x-auto
        "
      >
        <table className="w-full">
          <thead>
            <tr className="text-gray-400 border-b">
              <th className="text-left pb-4">Shipment</th>
              <th className="text-left">Customer</th>
              <th className="text-left">Mode</th>
              <th className="text-left">Status</th>
              <th className="text-left">Cost</th>
              <th className="text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {shipments.map((item) => (
              <tr
                key={item.id}
                className="
                  border-b
                  last:border-none
                  hover:bg-gray-50
                  transition
                "
              >
                <td className="py-5">
                  <div className="flex gap-3 items-center">
                    <div
                      className="
                        w-11
                        h-11
                        rounded-xl
                        bg-blue-50
                        text-[#246BED]
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <Package size={20} />
                    </div>

                    <div>
                      <p className="font-semibold">{item.shipment_id}</p>

                      <p className="text-xs text-gray-400">
                        {item.carrier_name}
                      </p>
                    </div>
                  </div>
                </td>

                <td>{item.company_name}</td>

                <td>
                  <span className="bg-gray-100 px-3 py-1 rounded-full">
                    {item.shipment_mode}
                  </span>
                </td>

                <td>
                  <select
                    value={item.status}
                    onChange={(e) => updateStatus(item, e.target.value)}
                    className="
                      bg-blue-50
                      text-[#246BED]
                      rounded-xl
                      px-3
                      py-2
                      outline-none
                    "
                  >
                    <option>BOOKED</option>
                    <option>PICKED_UP</option>
                    <option>IN_TRANSIT</option>
                    <option>OUT_FOR_DELIVERY</option>
                    <option>DELIVERED</option>
                    <option>EXCEPTION</option>
                  </select>
                </td>

                <td className="font-semibold">₹{item.shipment_cost}</td>

                <td>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedShipment(item);
                        setViewOpen(true);
                      }}
                      className="
                        bg-blue-50
                        text-[#246BED]
                        p-2
                        rounded-xl
                      "
                    >
                      <Eye size={18} />
                    </button>

                    {["ADMIN", "OPERATIONS"].includes(user?.role) && (
                      <button
                        onClick={() => {
                          setSelectedShipment(item);
                          setEditOpen(true);
                        }}
                        className="
                          bg-yellow-50
                          p-2
                          rounded-xl
                        "
                      >
                        <Edit size={18} />
                      </button>
                    )}

                    {user?.role === "ADMIN" && (
                      <button
                        onClick={() => deleteShipment(item.id)}
                        className="
                          bg-red-50
                          p-2
                          rounded-xl
                        "
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE / EDIT / VIEW MODALS */}
      {/* CREATE MODAL */}

      {open && (
        <div
          className="
      fixed
      inset-0
      bg-black/50
      flex
      items-center
      justify-center
      z-50
      p-4
    "
        >
          <div
            className="
        bg-white
        rounded-3xl
        p-6
        w-full
        max-w-xl
      "
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold">Create Shipment</h2>

              <button onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                value={form.customer_id}
                onChange={(e) =>
                  setForm({
                    ...form,
                    customer_id: e.target.value,
                  })
                }
                className="border p-3 rounded-xl w-full"
              >
                <option value="">Select Customer</option>

                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company_name}
                  </option>
                ))}
              </select>

              {[
                "pickup_location",
                "delivery_location",
                "weight",
                "carrier_name",
                "expected_delivery_date",
                "shipment_cost",
              ].map((field) => (
                <input
                  key={field}
                  type={field === "expected_delivery_date" ? "date" : "text"}
                  placeholder={field.replaceAll("_", " ")}
                  value={form[field]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [field]: e.target.value,
                    })
                  }
                  className="
              border
              p-3
              rounded-xl
              w-full
            "
                />
              ))}

              <select
                value={form.shipment_mode}
                onChange={(e) =>
                  setForm({
                    ...form,
                    shipment_mode: e.target.value,
                  })
                }
                className="
            border
            p-3
            rounded-xl
            w-full
          "
              >
                <option>SURFACE</option>
                <option>AIR</option>
                <option>SEA</option>
                <option>RAIL</option>
              </select>

              <button
                className="
            w-full
            bg-[#246BED]
            text-white
            rounded-xl
            py-3
          "
              >
                Create Shipment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shipments;
