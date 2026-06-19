import { Mail, Lock, ShieldCheck } from "lucide-react";
import logo from "../assets/logo.png";

const Login = () => {
  return (
    <div className="min-h-screen flex bg-white">
      {/* LEFT BRAND SECTION */}

      <div
        className="hidden lg:flex w-1/2 flex-col justify-center px-20 text-white"
        style={{
          background: "linear-gradient(135deg,#246BED,#2D5DD5)",
        }}
      >
        <div className="flex items-center gap-5 mb-10">
          {/* LOGO BOX */}
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl overflow-hidden">
            <img
              src={logo}
              alt="ProDiligix Logo"
              className="w-30 h-30 object-cover scale-150"
            />
          </div>

          {/* BRAND TEXT */}
          <div>
            <h1 className="text-5xl font-bold tracking-tight">ProDiligix</h1>

            <p className="text-white/85 text-xl mt-1">
              Business Solutions Platform
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-semibold">Logistics Management System</h2>

        <p className="mt-6 text-lg opacity-90 leading-8">
          A centralized logistics platform for managing customers, shipments,
          live tracking, analytics and business operations.
        </p>
        <div className="mt-10 grid gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck />

            <span>Secure Role Based Access</span>
          </div>

          <div className="flex items-center gap-3">
            <ShieldCheck />

            <span>Real Time Shipment Tracking</span>
          </div>

          <div className="flex items-center gap-3">
            <ShieldCheck />

            <span>Business Analytics Dashboard</span>
          </div>
        </div>
      </div>

      {/* LOGIN SECTION */}

      <div
        className="
        flex
        flex-1
        items-center
        justify-center
        bg-gray-50
        px-6
        "
      >
        <div
          className="
        bg-white
        w-full
        max-w-md
        rounded-2xl
        shadow-2xl
        border
        border-gray-100
        p-8
        "
        >
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>

          <p className="text-gray-500 mt-2">
            Login to your ProDiligix dashboard
          </p>

          <form className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-medium">Email Address</label>

              <div className="flex items-center border rounded-xl px-4 mt-2">
                <Mail size={18} />

                <input
                  className="
                w-full
                p-3
                outline-none
                "
                  placeholder="admin@prodiligix.com"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>

              <div className="flex items-center border rounded-xl px-4 mt-2">
                <Lock size={18} />

                <input
                  type="password"
                  className="
                w-full
                p-3
                outline-none
                "
                  placeholder="********"
                />
              </div>
            </div>

            <button
              className="
            w-full
            py-3
            rounded-xl
            text-white
            font-semibold
            "
              style={{
                background: "linear-gradient(135deg,#246BED,#2D5DD5)",
              }}
            >
              Login
            </button>
            <p className="text-center text-sm text-gray-500 mt-5">
              Admin • Operations • Management
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
