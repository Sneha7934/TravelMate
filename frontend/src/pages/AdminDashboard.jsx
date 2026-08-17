
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  MapPin,
  Landmark,
  Users,
  Plus,
  RefreshCw,
  Settings,
  MessageSquare,
} from "lucide-react";

import api from "../api/api";
import travelmateLogo from "../assets/images/travelmate-logo.png";

function AdminDashboard() {
  const navigate = useNavigate();

  // ==========================================
  // STATE
  // ==========================================

  const [destinationCount, setDestinationCount] = useState(0);
  const [attractionCount, setAttractionCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [userCount, setUserCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // GET LOGGED-IN USER
  // ==========================================

  const getLoggedInUser = () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        return null;
      }

      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Invalid user data:", error);
      return null;
    }
  };

  // ==========================================
  // LOAD DASHBOARD DATA
  // ==========================================

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      // ======================================
      // GET CURRENT ADMIN
      // ======================================

      const admin = getLoggedInUser();

      if (!admin?.id) {
        navigate("/login");
        return;
      }

      // ======================================
      // CHECK ADMIN ROLE
      // ======================================

      if (admin.role?.toUpperCase() !== "ADMIN") {
        setError("Access denied. Admin only.");
        return;
      }

      // ======================================
      // LOAD PUBLIC CONTENT
      // ======================================

      const [
        destinationsResponse,
        attractionsResponse,
        reviewsResponse,
      ] = await Promise.all([
        api.get("/destinations"),
        api.get("/attractions"),
        api.get("/reviews", {
          headers: {
            userId: admin.id,
          },
        }).catch((reviewError) => {
          console.error(
            "Error loading reviews:",
            reviewError
          );

          return {
            data: [],
          };
        }),
      ]);

      // ======================================
      // SET CONTENT COUNTS
      // ======================================

      setDestinationCount(
        Array.isArray(destinationsResponse.data)
          ? destinationsResponse.data.length
          : 0
      );

      setAttractionCount(
        Array.isArray(attractionsResponse.data)
          ? attractionsResponse.data.length
          : 0
      );

      setReviewCount(
        Array.isArray(reviewsResponse.data)
          ? reviewsResponse.data.length
          : 0
      );

      // ======================================
      // LOAD USERS
      // ADMIN ONLY
      // ======================================

      try {
        const usersResponse = await api.get(
          "/users",
          {
            headers: {
              userId: admin.id,
            },
          }
        );

        setUserCount(
          Array.isArray(usersResponse.data)
            ? usersResponse.data.length
            : 0
        );
      } catch (userError) {
        console.error(
          "Error loading users:",
          userError
        );

        // Do not break the entire dashboard
        setUserCount(0);

        if (
          userError.response?.status === 403
        ) {
          setError(
            "Access denied. Admin only."
          );

          return;
        }

        if (
          userError.response?.status === 401
        ) {
          setError(
            "Your admin session is invalid. Please login again."
          );

          return;
        }
      }
    } catch (error) {
      console.error(
        "Error loading admin dashboard:",
        error
      );

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        setError(
          "You are not authorized to access the admin dashboard."
        );

        return;
      }

      setError(
        "Unable to load dashboard information."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD ON PAGE OPEN
  // ==========================================

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#f6eadb]
        "
      >
        <div className="text-center">
          <RefreshCw
            size={32}
            className="
              mx-auto
              animate-spin
              text-[#f97316]
            "
          />

          <p className="mt-4 text-gray-500">
            Loading admin dashboard...
          </p>
        </div>
      </main>
    );
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <main
      className="
        min-h-screen
        bg-[#f6eadb]
      "
    >
      {/* ======================================
          NAVBAR
      ====================================== */}

      <nav
        className="
          flex
          items-center
          justify-between
          border-b
          border-[#172554]/10
          bg-white/70
          px-6
          py-4
          backdrop-blur-md
          md:px-12
        "
      >
        {/* LOGO */}

        <button
          onClick={() => navigate("/home")}
          className="
            inline-flex
            items-center
            justify-center
            gap-0
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
        </button>

        {/* BACK TO WEBSITE */}

        <button
          onClick={() => navigate("/home")}
          className="
            flex
            items-center
            gap-2
            text-sm
            font-semibold
            text-[#172554]
            transition
            hover:text-[#f97316]
          "
        >
          <ArrowLeft size={18} />

          Back to TravelMate
        </button>
      </nav>

      {/* ======================================
          CONTENT
      ====================================== */}

      <section
        className="
          mx-auto
          max-w-7xl
          px-6
          py-10
          md:px-12
        "
      >
        {/* ====================================
            HEADER
        ==================================== */}

        <div>
          <p
            className="
              text-sm
              font-semibold
              uppercase
              tracking-wide
              text-[#f97316]
            "
          >
            TravelMate
          </p>

          <h1
            className="
              mt-1
              text-4xl
              font-bold
              text-[#172554]
              md:text-5xl
            "
          >
            Admin Dashboard
          </h1>

          <p
            className="
              mt-3
              max-w-2xl
              text-gray-600
            "
          >
            Manage users, destinations,
            attractions, and reviews available
            throughout the TravelMate platform.
          </p>
        </div>

        {/* ====================================
            ERROR
        ==================================== */}

        {error && (
          <div
            className="
              mt-6
              rounded-2xl
              border
              border-red-200
              bg-red-50
              p-5
              text-red-600
            "
          >
            <p className="font-semibold">
              {error}
            </p>
          </div>
        )}

        {/* ====================================
            STATISTICS
        ==================================== */}

        <div
          className="
            mt-8
            grid
            grid-cols-1
            gap-6
            md:grid-cols-2
            xl:grid-cols-4
          "
        >
          {/* USERS */}

          <div
            className="
              rounded-3xl
              bg-white
              p-6
              shadow-md
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
              "
            >
              <div>
                <p
                  className="
                    text-sm
                    font-medium
                    text-gray-500
                  "
                >
                  Registered Users
                </p>

                <p
                  className="
                    mt-2
                    text-4xl
                    font-bold
                    text-[#172554]
                  "
                >
                  {userCount}
                </p>
              </div>

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#f6eadb]
                "
              >
                <Users
                  size={27}
                  className="text-[#f97316]"
                />
              </div>
            </div>

            <button
              onClick={() =>
                navigate("/admin/users")
              }
              className="
                mt-6
                text-sm
                font-semibold
                text-[#f97316]
                transition
                hover:text-[#ea580c]
              "
            >
              Manage users →
            </button>
          </div>

          {/* DESTINATIONS */}

          <div
            className="
              rounded-3xl
              bg-white
              p-6
              shadow-md
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
              "
            >
              <div>
                <p
                  className="
                    text-sm
                    font-medium
                    text-gray-500
                  "
                >
                  Total Destinations
                </p>

                <p
                  className="
                    mt-2
                    text-4xl
                    font-bold
                    text-[#172554]
                  "
                >
                  {destinationCount}
                </p>
              </div>

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#f6eadb]
                "
              >
                <MapPin
                  size={27}
                  className="text-[#f97316]"
                />
              </div>
            </div>

            <button
              onClick={() =>
                navigate("/admin/destinations")
              }
              className="
                mt-6
                text-sm
                font-semibold
                text-[#f97316]
                transition
                hover:text-[#ea580c]
              "
            >
              Manage destinations →
            </button>
          </div>

          {/* ATTRACTIONS */}

          <div
            className="
              rounded-3xl
              bg-white
              p-6
              shadow-md
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
              "
            >
              <div>
                <p
                  className="
                    text-sm
                    font-medium
                    text-gray-500
                  "
                >
                  Total Attractions
                </p>

                <p
                  className="
                    mt-2
                    text-4xl
                    font-bold
                    text-[#172554]
                  "
                >
                  {attractionCount}
                </p>
              </div>

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#f6eadb]
                "
              >
                <Landmark
                  size={27}
                  className="text-[#f97316]"
                />
              </div>
            </div>

            <button
              onClick={() =>
                navigate("/admin/attractions")
              }
              className="
                mt-6
                text-sm
                font-semibold
                text-[#f97316]
                transition
                hover:text-[#ea580c]
              "
            >
              Manage attractions →
            </button>
          </div>

          {/* REVIEWS */}

          <div
            className="
              rounded-3xl
              bg-white
              p-6
              shadow-md
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
              "
            >
              <div>
                <p
                  className="
                    text-sm
                    font-medium
                    text-gray-500
                  "
                >
                  Total Reviews
                </p>

                <p
                  className="
                    mt-2
                    text-4xl
                    font-bold
                    text-[#172554]
                  "
                >
                  {reviewCount}
                </p>
              </div>

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#f6eadb]
                "
              >
                <MessageSquare
                  size={27}
                  className="text-[#f97316]"
                />
              </div>
            </div>

            <button
              onClick={() =>
                navigate("/admin/reviews")
              }
              className="
                mt-6
                text-sm
                font-semibold
                text-[#f97316]
                transition
                hover:text-[#ea580c]
              "
            >
              Manage reviews →
            </button>
          </div>
        </div>

        {/* ====================================
            MANAGEMENT SECTION
        ==================================== */}

        <div className="mt-10">
          <h2
            className="
              text-2xl
              font-bold
              text-[#172554]
            "
          >
            Content Management
          </h2>

          <p
            className="
              mt-2
              text-gray-600
            "
          >
            Quickly access the main TravelMate
            management sections.
          </p>

          <div
            className="
              mt-6
              grid
              grid-cols-1
              gap-6
              md:grid-cols-2
              xl:grid-cols-4
            "
          >
            {/* USERS CARD */}

            <div
              className="
                rounded-3xl
                bg-white
                p-7
                shadow-md
              "
            >
              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#f6eadb]
                "
              >
                <Users
                  size={27}
                  className="text-[#f97316]"
                />
              </div>

              <h3
                className="
                  mt-5
                  text-2xl
                  font-bold
                  text-[#172554]
                "
              >
                Users
              </h3>

              <p
                className="
                  mt-2
                  leading-6
                  text-gray-600
                "
              >
                View registered users and remove
                user accounts.
              </p>

              <button
                onClick={() =>
                  navigate("/admin/users")
                }
                className="
                  mt-6
                  w-full
                  rounded-xl
                  bg-[#172554]
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-[#1e3a8a]
                "
              >
                Manage Users
              </button>
            </div>

            {/* DESTINATIONS CARD */}

            <div
              className="
                rounded-3xl
                bg-white
                p-7
                shadow-md
              "
            >
              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#f6eadb]
                "
              >
                <MapPin
                  size={27}
                  className="text-[#f97316]"
                />
              </div>

              <h3
                className="
                  mt-5
                  text-2xl
                  font-bold
                  text-[#172554]
                "
              >
                Destinations
              </h3>

              <p
                className="
                  mt-2
                  leading-6
                  text-gray-600
                "
              >
                Add, edit and delete destinations
                available to users.
              </p>

              <div
                className="
                  mt-6
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                "
              >
                <button
                  onClick={() =>
                    navigate(
                      "/admin/destinations"
                    )
                  }
                  className="
                    flex-1
                    rounded-xl
                    bg-[#172554]
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-[#1e3a8a]
                  "
                >
                  Manage
                </button>

                <button
                  onClick={() =>
                    navigate(
                      "/admin/destinations/add"
                    )
                  }
                  className="
                    inline-flex
                    flex-1
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-[#f97316]
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    text-[#f97316]
                    transition
                    hover:bg-[#f97316]
                    hover:text-white
                  "
                >
                  <Plus size={17} />

                  Add New
                </button>
              </div>
            </div>

            {/* ATTRACTIONS CARD */}

            <div
              className="
                rounded-3xl
                bg-white
                p-7
                shadow-md
              "
            >
              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#f6eadb]
                "
              >
                <Landmark
                  size={27}
                  className="text-[#f97316]"
                />
              </div>

              <h3
                className="
                  mt-5
                  text-2xl
                  font-bold
                  text-[#172554]
                "
              >
                Attractions
              </h3>

              <p
                className="
                  mt-2
                  leading-6
                  text-gray-600
                "
              >
                Add, edit and delete attractions
                belonging to your destinations.
              </p>

              <div
                className="
                  mt-6
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                "
              >
                <button
                  onClick={() =>
                    navigate(
                      "/admin/attractions"
                    )
                  }
                  className="
                    flex-1
                    rounded-xl
                    bg-[#172554]
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-[#1e3a8a]
                  "
                >
                  Manage
                </button>

                <button
                  onClick={() =>
                    navigate(
                      "/admin/attractions/add"
                    )
                  }
                  className="
                    inline-flex
                    flex-1
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-[#f97316]
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    text-[#f97316]
                    transition
                    hover:bg-[#f97316]
                    hover:text-white
                  "
                >
                  <Plus size={17} />

                  Add New
                </button>
              </div>
            </div>

            {/* REVIEWS CARD */}

            <div
              className="
                rounded-3xl
                bg-white
                p-7
                shadow-md
              "
            >
              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#f6eadb]
                "
              >
                <MessageSquare
                  size={27}
                  className="text-[#f97316]"
                />
              </div>

              <h3
                className="
                  mt-5
                  text-2xl
                  font-bold
                  text-[#172554]
                "
              >
                Reviews
              </h3>

              <p
                className="
                  mt-2
                  leading-6
                  text-gray-600
                "
              >
                View and delete reviews submitted
                by users.
              </p>

              <button
                onClick={() =>
                  navigate("/admin/reviews")
                }
                className="
                  mt-6
                  w-full
                  rounded-xl
                  bg-[#172554]
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-[#1e3a8a]
                "
              >
                Manage Reviews
              </button>
            </div>
          </div>
        </div>

        {/* ====================================
            ADMIN NOTE
        ==================================== */}

        <div
          className="
            mt-10
            rounded-3xl
            border
            border-[#172554]/10
            bg-white/60
            p-6
          "
        >
          <div
            className="
              flex
              items-start
              gap-4
            "
          >
            <Settings
              size={24}
              className="
                mt-1
                shrink-0
                text-[#f97316]
              "
            />

            <div>
              <h3
                className="
                  font-bold
                  text-[#172554]
                "
              >
                Admin Area
              </h3>

              <p
                className="
                  mt-1
                  text-sm
                  leading-6
                  text-gray-600
                "
              >
                This dashboard provides access
                to TravelMate's administrative
                content. Only authorized admin
                users should be able to access
                these pages.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard;

