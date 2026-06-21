import { Mail, Lock, ShieldCheck, Eye, EyeOff, Loader2 } from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import logo from "../assets/logo.png";

import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success(`Welcome back, ${res.data.user.name} 👋`);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 overflow-hidden">
      {/* LEFT DESKTOP */}
      <div
        className="
          hidden
          lg:flex
          w-1/2
          flex-col
          justify-center
          px-20
          text-white
        "
        style={{
          background: "linear-gradient(135deg,#246BED,#4338CA)",
        }}
      >
        <div className="flex items-center gap-5 mb-12">
          <div
            className="
              w-24
              h-24
              bg-white
              rounded-[28px]
              flex
              items-center
              justify-center
              shadow-xl
            "
          >
            <img src={logo} className="w-24 scale-125" />
          </div>

          <div>
            <h1 className="text-5xl font-bold">ProDiligix</h1>

            <p className="text-xl opacity-90">Business Solutions Platform</p>
          </div>
        </div>

        <h2 className="text-4xl font-bold">Logistics Management System</h2>

        <p className="mt-6 text-lg leading-8 opacity-90">
          Enterprise logistics platform for shipments, customers, live tracking
          and analytics.
        </p>

        <div className="mt-10 space-y-5">
          {[
            "Secure Role Based Access",
            "Real Time Shipment Tracking",
            "Business Analytics Dashboard",
          ].map((item) => (
            <div key={item} className="flex gap-3 items-center">
              <ShieldCheck />

              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div
        className="
          flex-1
          flex
          items-center
          justify-center
          px-4
          py-4
          sm:py-8
          bg-gradient-to-br
          from-white
          to-blue-50
        "
      >
        <div
          className="
            w-full
            max-w-[390px]
            mx-auto
          "
        >
          {/* MOBILE BRAND */}
          <div
            className="
              lg:hidden
              text-center
              mb-5
            "
          >
            <div
              className="
                mx-auto
                w-16
                h-16
                bg-white
                rounded-2xl
                flex
                items-center
                justify-center
                shadow-lg
                mb-3
              "
            >
              <img src={logo} className="w-16 scale-125" />
            </div>

            <h1
              className="
                text-3xl
                font-bold
                text-gray-900
              "
            >
              ProDiligix
            </h1>

            <p
              className="
                text-[#246BED]
                text-sm
                font-semibold
              "
            >
              Logistics Management System
            </p>
          </div>

          {/* LOGIN CARD */}
          <div
            className="
              bg-white
              rounded-[24px]
              border
              shadow-xl
              px-5
              py-6
              sm:p-8
            "
          >
            <h2
              className="
                text-2xl
                sm:text-3xl
                font-bold
                text-gray-900
              "
            >
              Welcome Back
            </h2>

            <p
              className="
                text-gray-500
                mt-1
                text-sm
              "
            >
              Login to continue your dashboard
            </p>

            <form
              onSubmit={handleLogin}
              className="
                mt-5
                space-y-4
              "
            >
              {/* EMAIL */}

              <div>
                <label className="text-sm">Email Address</label>

                <div
                  className="
                    mt-2
                    flex
                    items-center
                    gap-3
                    border
                    rounded-xl
                    px-4
                  "
                >
                  <Mail size={18} />

                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@prodiligix.com"
                    className="
                      flex-1
                      min-w-0
                      py-3
                      outline-none
                      text-sm
                    "
                  />
                </div>
              </div>

              {/* PASSWORD */}

              <div>
                <label className="text-sm">Password</label>

                <div
                  className="
                    mt-2
                    flex
                    items-center
                    gap-3
                    border
                    rounded-xl
                    px-4
                  "
                >
                  <Lock size={18} />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="
                      flex-1
                      min-w-0
                      py-3
                      outline-none
                      text-sm
                    "
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* LOGIN BUTTON */}

              <button
                disabled={loading}
                className="
                  w-full
                  py-3.5
                  rounded-xl
                  text-white
                  font-semibold
                  bg-gradient-to-r
                  from-[#246BED]
                  to-[#4338CA]
                  flex
                  justify-center
                  items-center
                  gap-2
                  shadow-lg
                "
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>

              <p
                className="
                  text-center
                  text-xs
                  text-gray-500
                "
              >
                Admin • Operations • Management
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
