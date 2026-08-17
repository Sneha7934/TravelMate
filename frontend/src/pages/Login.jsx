import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

import loginBg from "../assets/images/login-bg.png";
import travelmateLogo from "../assets/images/travelmate-logo.png";

import api from "../api/api";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  // ==========================================
  // LOGIN
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    // ========================================
    // BASIC VALIDATION
    // ========================================

    if (!email.trim() || !password) {

      alert(
        "Please enter your email and password."
      );

      return;
    }


    try {

      setLoading(true);


      // ======================================
      // SEND LOGIN REQUEST
      // ======================================

      const response = await api.post(
        "/users/login",
        {
          email: email.trim(),
          password: password,
        }
      );


      console.log(
        "Login successful:",
        response.data
      );


      /*
       * Only continue if the backend returned
       * a valid successful response.
       */

      if (
        !response.data ||
        !response.data.id ||
        !response.data.name
      ) {

        alert(
          "Login failed. Invalid server response."
        );

        return;
      }


      // ======================================
      // SAVE USER
      // ======================================

      localStorage.setItem(
        "user",
        JSON.stringify(response.data)
      );
      localStorage.setItem(
        "userId",
        String(response.data.id)
      );


      // ======================================
      // SUCCESS MESSAGE
      // ======================================

      alert(
        `Welcome back, ${response.data.name}!`
      );


      // ======================================
      // GO TO HOME
      // ======================================

      navigate("/");


    } catch (error) {

      console.error(
        "Login error:",
        error
      );


      // ======================================
      // INCORRECT EMAIL / PASSWORD
      // ======================================

      if (
        error.response?.status === 401
      ) {

        alert(
          "Incorrect email or password."
        );

        return;
      }


      // ======================================
      // OTHER BACKEND ERRORS
      // ======================================

      if (error.response) {

        const backendMessage =
          typeof error.response.data === "string"
            ? error.response.data
            : error.response.data?.message;


        alert(
          backendMessage ||
          "Login failed. Please try again."
        );

        return;
      }


      // ======================================
      // SERVER NOT AVAILABLE
      // ======================================

      alert(
        "Unable to connect to the server. Make sure Spring Boot is running."
      );


    } finally {

      setLoading(false);

    }

  };


  return (

    <main className="min-h-screen">


      {/* ======================================
          BACKGROUND
      ====================================== */}

      <div
        className="
          fixed
          inset-0
          bg-cover
          bg-center
        "
        style={{
          backgroundImage: `url(${loginBg})`,
        }}
      />

      <div
        className="
          fixed
          inset-0
          bg-[#f6eadb]/35
        "
      />


      {/* ======================================
          PAGE
      ====================================== */}

      <div
        className="
          relative
          z-10
          min-h-screen
        "
      >


        {/* ====================================
            HEADER
        ==================================== */}

        <header
          className="
            pt-10
            text-center
          "
        >

          {/* ==================================
              CLICKABLE TRAVELMATE LOGO
          ================================== */}

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


          {/* ==================================
              TAGLINE
          ================================== */}

          <p
            className="
              mt-2
              text-sm
              font-medium
              text-[#172554]/80
            "
          >
            Explore India, Experience Wonder
          </p>

        </header>


        {/* ====================================
            LOGIN SECTION
        ==================================== */}

        <section
          className="
            flex
            min-h-[calc(100vh-150px)]
            items-center
            justify-center
            px-5
            pb-16
            pt-5
          "
        >

          {/* ==================================
              LOGIN CARD
          ================================== */}

          <div
            className="
              w-full
              max-w-[455px]
              rounded-[30px]
              border
              border-white/50
              bg-white/25
              p-7
              shadow-[0_25px_80px_rgba(23,37,84,0.25)]
              backdrop-blur-2xl
              backdrop-saturate-150
              md:p-8
            "
          >


            {/* =================================
                TITLE
            ================================= */}

            <div className="text-center">

              <h2
                className="
                  text-[32px]
                  font-bold
                  text-[#172554]
                "
              >
                Welcome Back!
              </h2>


              <p
                className="
                  mx-auto
                  mt-3
                  max-w-[320px]
                  text-[15px]
                  leading-6
                  text-gray-500
                "
              >
                Login to your account to continue
                <br />
                your journey with TravelMate.
              </p>

            </div>


            {/* =================================
                FORM
            ================================= */}

            <form
              onSubmit={handleSubmit}
              className="mt-8"
            >


              {/* ================================
                  EMAIL
              ================================= */}

              <div>

                <label
                  htmlFor="email"
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-gray-800
                  "
                >
                  Email
                </label>


                <div className="relative">

                  <Mail
                    size={19}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />


                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                    className="
                      h-[50px]
                      w-full
                      rounded-xl
                      border
                      border-gray-300
                      bg-white
                      pl-12
                      pr-4
                      text-sm
                      text-gray-800
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


              {/* ================================
                  PASSWORD
              ================================= */}

              <div className="mt-5">

                <div
                  className="
                    mb-2
                    flex
                    items-center
                    justify-between
                  "
                >

                  <label
                    htmlFor="password"
                    className="
                      text-sm
                      font-semibold
                      text-gray-800
                    "
                  >
                    Password
                  </label>


                  <Link
                    to="/forgot-password"
                    className="
                      text-sm
                      font-medium
                      text-[#2563eb]
                      transition
                      hover:underline
                    "
                  >
                    Forgot Password?
                  </Link>

                </div>


                <div className="relative">

                  <Lock
                    size={19}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />


                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="
                      h-[50px]
                      w-full
                      rounded-xl
                      border
                      border-gray-300
                      bg-white
                      pl-12
                      pr-12
                      text-sm
                      text-gray-800
                      outline-none
                      transition
                      placeholder:text-gray-400
                      focus:border-[#2563eb]
                      focus:ring-2
                      focus:ring-blue-100
                    "
                  />


                  {/* SHOW / HIDE PASSWORD */}

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (previous) => !previous
                      )
                    }
                    className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                      transition
                      hover:text-[#172554]
                    "
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >

                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}

                  </button>

                </div>

              </div>


              {/* ================================
                  LOGIN BUTTON
              ================================= */}

              <button
                type="submit"
                disabled={loading}
                className="
                  mt-7
                  flex
                  h-[53px]
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#172554]
                  text-base
                  font-semibold
                  text-white
                  transition
                  duration-200
                  hover:bg-[#1e3a8a]
                  active:scale-[0.98]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >

                <ArrowRight size={20} />

                {loading
                  ? "Logging in..."
                  : "Login"
                }

              </button>

            </form>


            {/* =================================
                DIVIDER
            ================================= */}

            <div
              className="
                my-5
                flex
                w-full
                items-center
                gap-4
              "
            >

              <div
                className="
                  h-px
                  flex-1
                  bg-[#172554]/40
                "
              />

              <span
                className="
                  shrink-0
                  text-sm
                  font-medium
                  text-[#172554]
                "
              >
                OR
              </span>

              <div
                className="
                  h-px
                  flex-1
                  bg-[#172554]/40
                "
              />

            </div>


            {/* =================================
                GOOGLE LOGIN
            ================================= */}

            <button
              type="button"
              onClick={() =>
                alert(
                  "Google login will be connected later."
                )
              }
              className="
                flex
                h-[52px]
                w-full
                items-center
                justify-center
                gap-3
                rounded-xl
                border
                border-gray-300
                bg-white
                text-sm
                font-semibold
                text-[#172554]
                transition
                hover:bg-gray-50
                active:scale-[0.98]
              "
            >

              <span
                className="
                  text-xl
                  font-bold
                "
              >
                G
              </span>

              Login with Google

            </button>


            {/* =================================
                REGISTER
            ================================= */}

            <p
              className="
                mt-7
                text-center
                text-sm
                text-gray-600
              "
            >

              Don't have an account?{" "}

              <Link
                to="/register"
                className="
                  font-semibold
                  text-[#2563eb]
                  hover:underline
                "
              >
                Register
              </Link>

            </p>

          </div>

        </section>

      </div>

    </main>

  );
}

export default Login;

