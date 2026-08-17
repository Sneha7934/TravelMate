import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
} from "lucide-react";

import registerBg from "../assets/images/register-bg.png";
import travelmateLogo from "../assets/images/travelmate-logo.png";

import api from "../api/api";

function Register() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    terms: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    // Check terms
    if (!formData.terms) {
      alert("Please agree to the Terms & Conditions.");
      return;
    }

    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill in all fields.");
      return;
    }

    try {

      setLoading(true);

      const response = await api.post("/users/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      console.log("Registration response:", response.data);

      // Backend returns null when email already exists
      if (response.data === null) {
        alert("An account with this email already exists.");
        return;
      }

      alert("Account created successfully!");

      // Go to login page
      navigate("/login");

    } catch (error) {

      console.error("Registration error:", error);

      if (error.response?.status === 409) {

        alert("User already has an account with this email.");

      } else if (error.response) {

        alert(
          error.response.data?.message ||
          error.response.data ||
          "Registration failed."
        );

      } else {

        alert(
          "Unable to connect to the server. Make sure Spring Boot is running."
        );
      }

    } finally {

      setLoading(false);
    }
  };

  return (
    <>
      {/* ================= BACKGROUND ================= */}

      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${registerBg})`,
        }}
      />

      <div className="fixed inset-0 bg-[#f6eadb]/30" />

      {/* ================= PAGE ================= */}

      <div className="relative z-10 min-h-screen">

        {/* ================= HEADER ================= */}

        <header className="pt-8 text-center">

          <div className="flex items-center justify-center">

            <Link
                        to="/"
                        className="
                          inline-flex
                          items-center
                          justify-center
                          gap-0
                          cursor-pointer
                        "
                        aria-label="Go to TravelMate Home"
                      >
            
                        <img
                          src={travelmateLogo}
                          alt="TravelMate Logo"
                          className="
                            h-15
                            w-17
                            object-contain
                          "
                        />
            
                        <h1
                          className="
                            text-4xl
                            font-bold
                            tracking-tight
                            text-[#172554]
                          "
                        >
                          TravelMate
                        </h1>
            
                      </Link>

          </div>

          <p className="mt-1 text-sm font-medium text-[#172554]/80">
            Explore India, Experience Wonder
          </p>

        </header>

        {/* ================= REGISTER SECTION ================= */}

        <section className="flex min-h-[calc(100vh-125px)] items-center justify-center px-5 pb-12 pt-5">

          <div
            className="
              w-full
              max-w-[485px]
              rounded-[30px]
              border
              border-[#172554]/20
              bg-white/30
              p-7
              shadow-[0_25px_70px_rgba(23,37,84,0.20)]
              backdrop-blur-xl
              md:p-8
            "
          >

            {/* ================= TITLE ================= */}

            <div className="text-center">

              <h2 className="text-[32px] font-bold text-[#172554]">
                Create Account
              </h2>

              <p className="mx-auto mt-2 max-w-[330px] text-[15px] leading-6 text-gray-500">
                Join TravelMate and start exploring
                <br />
                the incredible places of India.
              </p>

            </div>

            {/* ================= FORM ================= */}

            <form
              onSubmit={handleSubmit}
              className="mt-6"
            >

              {/* FULL NAME */}

              <div>

                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Full Name
                </label>

                <div className="relative">

                  <User
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                    className="
                      h-[48px]
                      w-full
                      rounded-xl
                      border
                      border-gray-300
                      bg-white/80
                      pl-12
                      pr-4
                      text-sm
                      outline-none
                      transition
                      placeholder:text-gray-400
                      focus:border-[#2563eb]
                      focus:ring-2
                      focus:ring-blue-100
                    "
                  />

                </div>

              </div>

              {/* EMAIL */}

              <div className="mt-4">

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Email
                </label>

                <div className="relative">

                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                    className="
                      h-[48px]
                      w-full
                      rounded-xl
                      border
                      border-gray-300
                      bg-white/80
                      pl-12
                      pr-4
                      text-sm
                      outline-none
                      transition
                      placeholder:text-gray-400
                      focus:border-[#2563eb]
                      focus:ring-2
                      focus:ring-blue-100
                    "
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div className="mt-4">

                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Password
                </label>

                <div className="relative">

                  <Lock
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    required
                    className="
                      h-[48px]
                      w-full
                      rounded-xl
                      border
                      border-gray-300
                      bg-white/80
                      pl-12
                      pr-12
                      text-sm
                      outline-none
                      transition
                      placeholder:text-gray-400
                      focus:border-[#2563eb]
                      focus:ring-2
                      focus:ring-blue-100
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#172554]"
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>

                </div>

              </div>

              {/* TERMS */}

              <div className="mt-5 flex items-start gap-2">

                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={formData.terms}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 cursor-pointer accent-[#2563eb]"
                />

                <label
                  htmlFor="terms"
                  className="cursor-pointer text-xs leading-5 text-gray-600"
                >
                  I agree to the{" "}

                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="font-medium text-[#2563eb] hover:underline"
                  >
                    Terms & Conditions
                  </a>

                  {" "}and{" "}

                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="font-medium text-[#2563eb] hover:underline"
                  >
                    Privacy Policy
                  </a>

                </label>

              </div>

              {/* REGISTER BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="
                  mt-5
                  flex
                  h-[52px]
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-gradient-to-r
                  from-[#172554]
                  via-[#1e3a8a]
                  to-[#f97316]
                  text-base
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  duration-200
                  hover:bg-[#ea580c]
                  active:scale-[0.98]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >

                <UserPlus size={20} />

                {loading ? "Creating Account..." : "Create Account"}

              </button>

            </form>

            {/* LOGIN LINK */}

            <p className="mt-6 text-center text-sm text-gray-700">

              Already have an account?{" "}

              <Link
                to="/login"
                className="font-semibold text-[#2563eb] hover:underline"
              >
                Login
              </Link>

            </p>

          </div>

        </section>

      </div>
    </>
  );
}

export default Register;
