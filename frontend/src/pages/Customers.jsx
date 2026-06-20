import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Building2,
  Mail,
  User,
  FileText,
} from "lucide-react";
import api from "../api/axios";
import { toast } from "react-toastify";

const Customers = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [search, setSearch] = useState("");

  const emptyForm = {
    company_name: "",
    contact_person: "",
    email: "",
    phone: "",
    gst_number: "",
    address: "",
  };

  const [form, setForm] = useState(emptyForm);

  // GET
  const getCustomers = async () => {
    try {
      const res = await api.get("/customers");

      setCustomers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);

  // CHANGE
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // EDIT
  const handleEdit = (customer) => {
    setEditingCustomer(customer);

    setForm({
      company_name: customer.company_name || "",
      contact_person: customer.contact_person || "",
      email: customer.email || "",
      phone: customer.phone || "",
      gst_number: customer.gst_number || "",
      address: customer.address || "",
    });

    setOpen(true);
  };

  // SAVE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCustomer) {
        await api.put(`/customers/${editingCustomer.id}`, form);

        toast.success("Customer updated");
      } else {
        await api.post("/customers", form);

        toast.success("Customer created");
      }

      setOpen(false);
      setEditingCustomer(null);
      setForm(emptyForm);

      getCustomers();
    } catch (err) {
      toast.error("Something failed");
    }
  };

  // DELETE
  const handleDelete = (id) => {
    toast(
      <div className="p-1">
        <h3 className="text-gray-900 font-bold text-base">Delete Customer?</h3>

        <p className="text-gray-500 text-sm mt-1">
          This action cannot be undone.
        </p>

        <div className="flex gap-3 mt-5">
          <button
            onClick={async () => {
              try {
                await api.delete(`/customers/${id}`);

                toast.dismiss();

                toast.success("Customer deleted successfully");

                getCustomers();
              } catch (err) {
                toast.error(err.response?.data?.message || "Delete failed");
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

  const filteredCustomers = customers.filter((item) =>
    item.company_name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-7">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Customers
          </h1>

          <p className="text-gray-500 mt-1">Manage your business customers</p>
        </div>

        {["ADMIN", "OPERATIONS"].includes(user?.role) && (
          <button
            onClick={() => {
              setEditingCustomer(null);
              setForm(emptyForm);
              setOpen(true);
            }}
            className="
              bg-[#246BED]
              text-white
              rounded-2xl
              px-5
              py-3
              flex
              items-center
              justify-center
              gap-2
              shadow-md
              font-medium
            "
          >
            <Plus size={18} />
            Add Customer
          </button>
        )}
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-3 mb-6">
        <Search className="text-gray-400" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers..."
          className="outline-none w-full bg-transparent"
        />
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
        <table className="w-full">
          <thead>
            <tr className="border-b text-gray-400 text-sm">
              <th className="text-left py-4">Company</th>
              <th className="text-left">Contact</th>
              <th className="text-left">Email</th>
              <th>GST</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="border-b last:border-none">
                <td className="py-5">
                  <div className="flex gap-3 items-center">
                    <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center text-[#246BED]">
                      <Building2 size={20} />
                    </div>

                    <b>{customer.company_name}</b>
                  </div>
                </td>

                <td>{customer.contact_person}</td>

                <td className="text-gray-500">{customer.email}</td>

                <td className="text-center">{customer.gst_number}</td>

                <td>
                  <div className="flex justify-center gap-2">
                    {["ADMIN", "OPERATIONS"].includes(user?.role) && (
                      <button
                        onClick={() => handleEdit(customer)}
                        className="p-2 rounded-xl bg-gray-100 hover:bg-blue-100 text-blue-600"
                      >
                        <Edit size={17} />
                      </button>
                    )}

                    {user?.role === "ADMIN" && (
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="p-2 rounded-xl bg-gray-100 hover:bg-red-100 text-red-600"
                      >
                        <Trash2 size={17} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD */}
      <div className="md:hidden space-y-4">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5"
          >
            <div className="flex gap-3 items-center">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[#246BED]">
                <Building2 />
              </div>

              <div>
                <h3 className="font-bold">{customer.company_name}</h3>

                <p className="text-sm text-gray-400">Customer</p>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-5">
                <span className="text-gray-400 flex gap-2">
                  <User size={15} />
                  Contact
                </span>

                <span>{customer.contact_person}</span>
              </div>

              <div className="flex justify-between gap-5">
                <span className="text-gray-400 flex gap-2">
                  <Mail size={15} />
                  Email
                </span>

                <span className="truncate">{customer.email}</span>
              </div>

              <div className="flex justify-between gap-5">
                <span className="text-gray-400 flex gap-2">
                  <FileText size={15} />
                  GST
                </span>

                <span>{customer.gst_number}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between mb-5">
              <h2 className="text-xl font-bold">
                {editingCustomer ? "Edit Customer" : "Add Customer"}
              </h2>

              <X onClick={() => setOpen(false)} className="cursor-pointer" />
            </div>

            <div className="grid gap-3">
              {Object.keys(emptyForm).map((field) => (
                <input
                  key={field}
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  placeholder={field.replace("_", " ")}
                  className="border rounded-xl p-3 outline-none"
                />
              ))}
            </div>

            <button className="mt-5 w-full bg-[#246BED] text-white rounded-xl py-3">
              Save Customer
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Customers;
