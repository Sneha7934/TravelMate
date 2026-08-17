import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  MapPin,
  CalendarDays,
  Wallet,
  RefreshCw,
  Search,
} from "lucide-react";

import api from "../api/api";
import { getStoredUserId } from "../utils/auth";
import travelmateLogo from "../assets/images/travelmate-logo.png";

function AdminDestinations() {
  const navigate = useNavigate();

  // ==========================================
  // STATE
  // ==========================================

  const [destinations, setDestinations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deletingId, setDeletingId] = useState(null);

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredDestinations = destinations.filter((destination) =>
    [
      destination.name,
      destination.state,
      destination.description,
      destination.budget,
      destination.bestTime,
    ].some((value) =>
      String(value || "").toLowerCase().includes(normalizedSearchQuery)
    )
  );

  // ==========================================
  // LOAD DESTINATIONS
  // ==========================================

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/destinations");

      setDestinations(response.data || []);
    } catch (error) {
      console.error(
        "Error loading destinations:",
        error
      );

      setError(
        "Unable to load destinations."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  // ==========================================
  // DELETE DESTINATION
  // ==========================================

  const handleDelete = async (destination) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${destination.name}"?`
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
      setDeletingId(destination.id);

      await api.delete(
        `/destinations/${destination.id}`,
        {
          headers: {
            userId: userId,
          },
        }
      );

      // Remove deleted destination from UI
      setDestinations((current) =>
        current.filter(
          (item) =>
            item.id !== destination.id
        )
      );

      alert(
        "Destination deleted successfully."
      );
    } catch (error) {
      console.error(
        "Error deleting destination:",
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
          "Unable to delete destination."
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
            Loading destinations...
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
              Manage Destinations
            </h1>

            <p
              className="
                mt-2
                text-gray-600
              "
            >
              Add, edit and manage the
              destinations available on
              TravelMate.
            </p>
          </div>

          {/* ADD BUTTON */}

          <button
            onClick={() =>
              navigate(
                "/admin/destinations/add"
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

            Add Destination
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
            placeholder="Search destinations by name, state, or details..."
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
              onClick={fetchDestinations}
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
            DESTINATION COUNT
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
            Total Destinations
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
              ? `${filteredDestinations.length} of ${destinations.length}`
              : destinations.length}
          </p>
        </div>

        {/* ====================================
            EMPTY STATE
        ==================================== */}

        {!error &&
          destinations.length === 0 && (
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
                No destinations yet
              </h2>

              <p
                className="
                  mt-2
                  text-gray-500
                "
              >
                Add your first destination
                to TravelMate.
              </p>

              <button
                onClick={() =>
                  navigate(
                    "/admin/destinations/add"
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

                Add Destination
              </button>
            </div>
          )}

        {/* ====================================
            DESTINATION GRID
        ==================================== */}

        {destinations.length > 0 && filteredDestinations.length === 0 && (
          <div className="mt-8 rounded-3xl bg-white p-12 text-center shadow-sm">
            <Search size={45} className="mx-auto text-[#f97316]" />
            <h2 className="mt-4 text-2xl font-bold text-[#172554]">
              No matching destinations
            </h2>
            <p className="mt-2 text-gray-500">
              Try a different search term.
            </p>
          </div>
        )}

        {filteredDestinations.length > 0 && (
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
            {filteredDestinations.map(
              (destination) => (
                <article
                  key={destination.id}
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
                        destination.imageUrl
                          ? `/${destination.imageUrl}`
                          : "/default-destination.jpg"
                      }
                      alt={
                        destination.name
                      }
                      className="
                        h-full
                        w-full
                        object-cover
                      "
                      onError={(e) => {
                        e.currentTarget.src =
                          "/default-destination.jpg";
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
                      {destination.name}
                    </h2>

                    {/* STATE */}

                    {destination.state && (
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

                        {destination.state}
                      </div>
                    )}

                    {/* DESCRIPTION */}

                    {destination.description && (
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
                          destination.description
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
                      {destination.budget && (
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
                            Budget:{" "}
                            {
                              destination.budget
                            }
                          </span>
                        </div>
                      )}

                      {destination.bestTime && (
                        <div
                          className="
                            flex
                            items-center
                            gap-2
                          "
                        >
                          <CalendarDays
                            size={16}
                            className="text-[#f97316]"
                          />

                          <span>
                            Best time:{" "}
                            {
                              destination.bestTime
                            }
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
                            `/admin/destinations/edit/${destination.id}`
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
                            destination
                          )
                        }
                        disabled={
                          deletingId ===
                          destination.id
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
                        destination.id
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

export default AdminDestinations;

