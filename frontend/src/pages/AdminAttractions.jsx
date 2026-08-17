
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  MapPin,
  Wallet,
  Navigation,
  RefreshCw,
  Search,
} from "lucide-react";

import api from "../api/api";
import { getStoredUserId } from "../utils/auth";
import travelmateLogo from "../assets/images/travelmate-logo.png";

function AdminAttractions() {
  const navigate = useNavigate();

  // ==========================================
  // STATE
  // ==========================================

  const [attractions, setAttractions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deletingId, setDeletingId] = useState(null);

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredAttractions = attractions.filter((attraction) =>
    [
      attraction.name,
      attraction.location,
      attraction.description,
      attraction.destination?.name,
    ].some((value) =>
      String(value || "").toLowerCase().includes(normalizedSearchQuery)
    )
  );

  // ==========================================
  // LOAD ATTRACTIONS
  // ==========================================

  const fetchAttractions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/attractions");

      setAttractions(response.data || []);
    } catch (error) {
      console.error(
        "Error loading attractions:",
        error
      );

      setError(
        "Unable to load attractions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttractions();
  }, []);

  // ==========================================
  // DELETE ATTRACTION
  // ==========================================

  const handleDelete = async (attraction) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${attraction.name}"?`
    );

    if (!confirmed) {
      return;
    }

    // ------------------------------------------
    // GET USER ID
    // ------------------------------------------

    const userId = getStoredUserId();

    if (!userId) {
      alert(
        "Admin user information was not found. Please log in again."
      );

      return;
    }

    try {
      setDeletingId(attraction.id);

      await api.delete(
        `/attractions/${attraction.id}`,
        {
          headers: {
            userId: userId,
          },
        }
      );

      // Remove deleted attraction from UI
      setAttractions((current) =>
        current.filter(
          (item) =>
            item.id !== attraction.id
        )
      );

      alert(
        "Attraction deleted successfully."
      );
    } catch (error) {
      console.error(
        "Error deleting attraction:",
        error
      );

      if (
        error.response?.status === 403
      ) {
        alert(
          "Access denied. Admin only."
        );
      } else {
        alert(
          "Unable to delete attraction."
        );
      }
    } finally {
      setDeletingId(null);
    }
  };

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
            size={30}
            className="
              mx-auto
              animate-spin
              text-[#f97316]
            "
          />

          <p className="mt-4 text-gray-500">
            Loading attractions...
          </p>
        </div>

      </main>
    );
  }

  // ==========================================
  // PAGE
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
          onClick={() =>
            navigate("/home")
          }
          className="
            inline-flex
            items-center
            justify-center
            gap-0
          "
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

        {/* BACK */}

        <button
          onClick={() =>
            navigate("/admin")
          }
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

          Admin Dashboard
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

        <div
          className="
            flex
            flex-col
            gap-5
            md:flex-row
            md:items-center
            md:justify-between
          "
        >
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
              Admin Panel
            </p>

            <h1
              className="
                mt-1
                text-4xl
                font-bold
                text-[#172554]
              "
            >
              Manage Attractions
            </h1>

            <p
              className="
                mt-2
                text-gray-600
              "
            >
              Add, edit and manage the
              attractions available on
              TravelMate.
            </p>
          </div>

          {/* ADD BUTTON */}

          <button
            onClick={() =>
              navigate(
                "/admin/attractions/add"
              )
            }
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#f97316]
              px-5
              py-3
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-[#ea580c]
              hover:shadow-md
            "
          >
            <Plus size={19} />

            Add Attraction
          </button>
        </div>

        <div className="relative mt-8 max-w-xl">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search attractions by name, location, or details..."
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20"
          />
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

            <button
              onClick={fetchAttractions}
              className="
                mt-3
                inline-flex
                items-center
                gap-2
                rounded-lg
                bg-red-600
                px-4
                py-2
                text-sm
                font-semibold
                text-white
              "
            >
              <RefreshCw size={15} />

              Try Again
            </button>
          </div>
        )}

        {/* ====================================
            ATTRACTION COUNT
        ==================================== */}

        <div
          className="
            mt-8
            rounded-2xl
            bg-white
            p-5
            shadow-sm
          "
        >
          <p
            className="
              text-sm
              text-gray-500
            "
          >
            Total Attractions
          </p>

          <p
            className="
              mt-1
              text-3xl
              font-bold
              text-[#172554]
            "
          >
            {normalizedSearchQuery
              ? `${filteredAttractions.length} of ${attractions.length}`
              : attractions.length}
          </p>
        </div>

        {/* ====================================
            EMPTY STATE
        ==================================== */}

        {!error &&
          attractions.length === 0 && (
            <div
              className="
                mt-8
                rounded-3xl
                bg-white
                p-12
                text-center
                shadow-sm
              "
            >
              <MapPin
                size={45}
                className="
                  mx-auto
                  text-[#f97316]
                "
              />

              <h2
                className="
                  mt-4
                  text-2xl
                  font-bold
                  text-[#172554]
                "
              >
                No attractions yet
              </h2>

              <p
                className="
                  mt-2
                  text-gray-500
                "
              >
                Add your first attraction
                to TravelMate.
              </p>

              <button
                onClick={() =>
                  navigate(
                    "/admin/attractions/add"
                  )
                }
                className="
                  mt-6
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-[#f97316]
                  px-5
                  py-3
                  font-semibold
                  text-white
                "
              >
                <Plus size={18} />

                Add Attraction
              </button>
            </div>
          )}

        {/* ====================================
            ATTRACTION GRID
        ==================================== */}

        {attractions.length > 0 && filteredAttractions.length === 0 && (
          <div className="mt-8 rounded-3xl bg-white p-12 text-center shadow-sm">
            <Search size={45} className="mx-auto text-[#f97316]" />
            <h2 className="mt-4 text-2xl font-bold text-[#172554]">
              No matching attractions
            </h2>
            <p className="mt-2 text-gray-500">
              Try a different search term.
            </p>
          </div>
        )}

        {filteredAttractions.length > 0 && (
          <div
            className="
              mt-8
              grid
              grid-cols-1
              gap-6
              md:grid-cols-2
              xl:grid-cols-3
            "
          >
            {filteredAttractions.map(
              (attraction) => (
                <article
                  key={attraction.id}
                  className="
                    overflow-hidden
                    rounded-3xl
                    bg-white
                    shadow-md
                    transition
                    hover:-translate-y-1
                    hover:shadow-lg
                  "
                >
                  {/* IMAGE */}

                  <div
                    className="
                      h-52
                      w-full
                      overflow-hidden
                      bg-gray-100
                    "
                  >
                    <img
                      src={
                        attraction.imageUrl
                          ? `/${attraction.imageUrl}`
                          : "/default-attraction.jpg"
                      }
                      alt={
                        attraction.name
                      }
                      className="
                        h-full
                        w-full
                        object-cover
                      "
                      onError={(e) => {
                        e.currentTarget.src =
                          "/default-attraction.jpg";
                      }}
                    />
                  </div>

                  {/* CONTENT */}

                  <div className="p-6">
                    {/* NAME */}

                    <h2
                      className="
                        text-2xl
                        font-bold
                        text-[#172554]
                      "
                    >
                      {attraction.name}
                    </h2>

                    {/* DESTINATION */}

                    {attraction.destination && (
                      <div
                        className="
                          mt-2
                          flex
                          items-center
                          gap-2
                          text-sm
                          font-medium
                          text-[#f97316]
                        "
                      >
                        <MapPin
                          size={16}
                        />

                        <span>
                          {
                            attraction
                              .destination
                              .name
                          }
                        </span>
                      </div>
                    )}

                    {/* LOCATION */}

                    {attraction.location && (
                      <p
                        className="
                          mt-2
                          text-sm
                          text-gray-500
                        "
                      >
                        {attraction.location}
                      </p>
                    )}

                    {/* DESCRIPTION */}

                    {attraction.description && (
                      <p
                        className="
                          mt-4
                          line-clamp-3
                          text-sm
                          leading-6
                          text-gray-600
                        "
                      >
                        {
                          attraction.description
                        }
                      </p>
                    )}

                    {/* DETAILS */}

                    <div
                      className="
                        mt-5
                        space-y-2
                        text-sm
                        text-gray-600
                      "
                    >
                      {/* ENTRY FEE */}

                      {attraction.entryFee && (
                        <div
                          className="
                            flex
                            items-center
                            gap-2
                          "
                        >
                          <Wallet
                            size={16}
                            className="text-[#f97316]"
                          />

                          <span>
                            Entry Fee:{" "}
                            {
                              attraction.entryFee
                            }
                          </span>
                        </div>
                      )}

                      {/* COORDINATES */}

                      {attraction.latitude != null &&
                        attraction.longitude !=
                          null && (
                          <div
                            className="
                              flex
                              items-center
                              gap-2
                            "
                          >
                            <Navigation
                              size={16}
                              className="text-[#f97316]"
                            />

                            <span>
                              {attraction.latitude.toFixed(
                                4
                              )}
                              ,{" "}
                              {attraction.longitude.toFixed(
                                4
                              )}
                            </span>
                          </div>
                        )}
                    </div>

                    {/* ACTIONS */}

                    <div
                      className="
                        mt-6
                        flex
                        gap-3
                        border-t
                        border-gray-100
                        pt-5
                      "
                    >
                      {/* EDIT */}

                      <button
                        onClick={() =>
                          navigate(
                            `/admin/attractions/edit/${attraction.id}`
                          )
                        }
                        className="
                          flex
                          flex-1
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          border
                          border-[#172554]/20
                          px-4
                          py-2.5
                          text-sm
                          font-semibold
                          text-[#172554]
                          transition
                          hover:bg-[#172554]
                          hover:text-white
                        "
                      >
                        <Pencil
                          size={16}
                        />

                        Edit
                      </button>

                      {/* DELETE */}

                      <button
                        onClick={() =>
                          handleDelete(
                            attraction
                          )
                        }
                        disabled={
                          deletingId ===
                          attraction.id
                        }
                        className="
                          flex
                          flex-1
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          border
                          border-red-200
                          px-4
                          py-2.5
                          text-sm
                          font-semibold
                          text-red-600
                          transition
                          hover:bg-red-600
                          hover:text-white
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      >
                        <Trash2
                          size={16}
                        />

                        {deletingId ===
                        attraction.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminAttractions;

