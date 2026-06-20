import {
  LayoutDashboard,
  Users,
  Package,
  Truck,
  FileText,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import logo from "../assets/logo.png";

const DashboardLayout = () => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  // =====================
  // LOGOUT
  // =====================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  const menu = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
      roles: ["ADMIN", "MANAGEMENT"],
    },

    {
      name: "Customers",
      path: "/customers",
      icon: <Users size={20} />,
      roles: ["ADMIN", "OPERATIONS"],
    },

    {
      name: "Shipments",
      path: "/shipments",
      icon: <Package size={20} />,
      roles: ["ADMIN", "OPERATIONS"],
    },

    {
      name: "Tracking",
      path: "/tracking",
      icon: <Truck size={20} />,
      roles: ["ADMIN", "OPERATIONS"],
    },

    {
      name: "Reports",
      path: "/reports",
      icon: <FileText size={20} />,
      roles: ["ADMIN", "MANAGEMENT"],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      {/* ==========================
          MOBILE DARK OVERLAY
      ========================== */}

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="
          fixed
          inset-0
          bg-black/50
          z-40
          lg:hidden
          "
        />
      )}

      {/* ==========================
          SIDEBAR
      ========================== */}

      <aside
        className={`

        fixed
        top-0
        left-0

        h-screen
        w-72

        bg-[#0B1220]

        text-white

        z-50

        flex
        flex-col

        px-5
        py-6

        transition-all
        duration-300

        ${open ? "translate-x-0" : "-translate-x-full"}

        lg:translate-x-0

        `}
      >
        {/* MOBILE CLOSE */}

        <button
          onClick={() => setOpen(false)}
          className="
          absolute
          top-5
          right-5

          lg:hidden

          bg-white/10
          p-2
          rounded-lg
          "
        >
          <X size={20} />
        </button>

        {/* LOGO */}

        <div
          className="
          flex
          items-center
          gap-4

          mb-12
          "
        >
          <div
            className="
            w-16
            h-16

            rounded-2xl

            bg-white

            flex
            items-center
            justify-center

            shadow-lg
            "
          >
            <img
              src={logo}
              className="
              w-20
              h-20

              object-contain

              scale-150
              "
            />
          </div>

          <div>
            <h1
              className="
            text-xl
            font-bold
            tracking-wide
            "
            >
              ProDiligix
            </h1>

            <p
              className="
            text-xs
            text-gray-400
            "
            >
              LMS Portal
            </p>
          </div>
        </div>

        {/* MENU */}

        <nav
          className="
        flex-1
        space-y-3
        "
        >
          {menu
            .filter((item) => item.roles.includes(user?.role))

            .map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) => `

          flex
          items-center
          gap-4

          px-5
          py-3.5

          rounded-2xl

          transition-all
          duration-300


          ${
            isActive
              ? `
            bg-gradient-to-r
            from-[#246BED]
            to-[#4F7DFF]

            shadow-lg
            shadow-blue-500/30

            text-white
            `
              : `
            text-gray-400

            hover:text-white
            hover:bg-white/10
            `
          }


          `}
              >
                {item.icon}

                <span
                  className="
          font-medium
          "
                >
                  {item.name}
                </span>
              </NavLink>
            ))}
        </nav>

        {/* LOGOUT */}

        <button
          onClick={logout}
          className="
        mt-auto

        flex
        items-center
        gap-4

        px-5
        py-3.5

        rounded-2xl

        text-gray-400

        hover:bg-red-500/10
        hover:text-red-400

        transition
        "
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* ==========================
            MAIN CONTENT
      ========================== */}

      <section
        className="
      lg:ml-72

      min-h-screen

      flex
      flex-col
      "
      >
        {/* TOP BAR */}

        <header
          className="
      sticky
      top-0

      z-30

      h-20

      bg-white/80

      backdrop-blur-xl

      border-b

      flex
      items-center
      justify-between

      px-5
      md:px-8
      "
        >
          <div
            className="
      flex
      items-center
      gap-4
      "
          >
            <button
              onClick={() => setOpen(true)}
              className="
      lg:hidden

      p-2

      rounded-xl

      hover:bg-gray-100
      "
            >
              <Menu />
            </button>

            <div>
              <h2
                className="
      text-lg
      md:text-xl

      font-bold

      text-gray-900
      "
              >
                Logistics Dashboard
              </h2>

              <p
                className="
      text-sm
      text-gray-500
      "
              >
                Welcome back, {user?.name}
              </p>
            </div>
          </div>

          {/* ROLE BADGE */}

          <div
            className="
      bg-gradient-to-r
      from-[#246BED]
      to-[#4F7DFF]

      text-white

      px-5
      py-2

      rounded-xl

      shadow-md

      text-sm
      font-semibold
      "
          >
            {user?.role}
          </div>
        </header>

        {/* ONLY THIS SCROLLS */}

        <main
          className="
      flex-1

      overflow-y-auto

      p-5
      md:p-8
      "
        >
          <Outlet />
        </main>
      </section>
    </div>
  );
};

export default DashboardLayout;
