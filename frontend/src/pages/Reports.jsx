import { useEffect, useState } from "react";

import { Download, FileText, Calendar, PackageCheck } from "lucide-react";

import api from "../api/axios";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import * as XLSX from "xlsx";

const Reports = () => {
  const [reports, setReports] = useState([]);

  const [filter, setFilter] = useState("");

  // FETCH
  const fetchReports = async (type = "") => {
    try {
      const res = await api.get(`/reports?type=${type}`);

      setReports(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // FILTER
  const handleFilter = (type) => {
    setFilter(type);

    fetchReports(type);
  };

  // PDF
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text("ProDiligix Shipment Report", 14, 15);

    autoTable(doc, {
      startY: 25,

      head: [["Shipment ID", "Customer", "Mode", "Status", "Cost", "Date"]],

      body: reports.map((item) => [
        item.shipment_id,
        item.company_name,
        item.shipment_mode,
        item.status,
        item.shipment_cost,
        new Date(item.created_at).toLocaleDateString(),
      ]),
    });

    doc.save("shipment-report.pdf");
  };

  // EXCEL
  const exportExcel = () => {
    const sheet = XLSX.utils.json_to_sheet(reports);

    const book = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(book, sheet, "Reports");

    XLSX.writeFile(book, "shipment-report.xlsx");
  };

  const statusStyle = (status) => {
    if (status === "DELIVERED") return "bg-gray-900 text-white";

    if (status === "IN_TRANSIT") return "bg-slate-100 text-slate-700";

    if (status === "OUT_FOR_DELIVERY") return "bg-blue-50 text-[#246BED]";

    return "bg-gray-100 text-gray-500";
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-start gap-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Reports</h1>

          <p className="text-gray-500 text-sm md:text-base mt-1">
            Analyze shipment performance
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-white border rounded-xl px-4 py-2 shadow-sm">
          <FileText size={18} className="text-[#246BED]" />

          <span className="font-semibold">{reports.length}</span>
        </div>
      </div>

      {/* ACTION CARD */}
      <div className="mt-6 bg-white rounded-3xl border border-gray-100 shadow-sm p-4 md:p-5">
        {/* FILTERS */}
        <div className="grid grid-cols-3 gap-2">
          {["daily", "weekly", "monthly"].map((item) => (
            <button
              key={item}
              onClick={() => handleFilter(item)}
              className={`
                py-2.5
                rounded-xl
                text-sm
                capitalize
                font-medium
                transition

                ${
                  filter === item
                    ? "bg-gray-900 text-white"
                    : "bg-gray-50 text-gray-500"
                }
              `}
            >
              <Calendar size={14} className="inline mr-1" />

              {item}
            </button>
          ))}
        </div>

        {/* EXPORT */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            onClick={exportPDF}
            className="
              border
              rounded-xl
              py-3
              flex
              items-center
              justify-center
              gap-2
              font-medium
              text-gray-700
            "
          >
            <Download size={17} />
            PDF
          </button>

          <button
            onClick={exportExcel}
            className="
              border
              rounded-xl
              py-3
              flex
              items-center
              justify-center
              gap-2
              font-medium
              text-gray-700
            "
          >
            <Download size={17} />
            Excel
          </button>
        </div>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block mt-8 bg-white rounded-3xl border border-gray-100 shadow-sm p-5 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b text-gray-400 text-sm">
              <th className="text-left py-4">Shipment</th>

              <th className="text-left">Customer</th>

              <th>Mode</th>

              <th>Status</th>

              <th>Cost</th>

              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((item) => (
              <tr key={item.id} className="border-b last:border-none">
                <td className="py-5 font-semibold">{item.shipment_id}</td>

                <td>{item.company_name}</td>

                <td className="text-center">{item.shipment_mode}</td>

                <td className="text-center">
                  <span
                    className={`
                      px-4
                      py-1
                      rounded-full
                      text-sm

                      ${statusStyle(item.status)}
                    `}
                  >
                    {item.status.replaceAll("_", " ")}
                  </span>
                </td>

                <td className="text-center font-semibold">
                  ₹{item.shipment_cost}
                </td>

                <td className="text-center text-gray-500">
                  {new Date(item.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden mt-6 space-y-4">
        {reports.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5"
          >
            <div className="flex justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm">{item.shipment_id}</h3>

                <p className="text-gray-500 text-sm">{item.company_name}</p>
              </div>

              <span
                className={`
                  h-fit
                  px-3
                  py-1
                  rounded-full
                  text-xs

                  ${statusStyle(item.status)}
                `}
              >
                {item.status.replaceAll("_", " ")}
              </span>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Mode</span>

                <span>{item.shipment_mode}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Cost</span>

                <b>₹{item.shipment_cost}</b>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Date</span>

                <span>{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY */}
      {reports.length === 0 && (
        <div
          className="
            py-20
            flex
            flex-col
            items-center
            text-gray-400
          "
        >
          <PackageCheck size={55} />

          <p>No reports found</p>
        </div>
      )}
    </div>
  );
};

export default Reports;
