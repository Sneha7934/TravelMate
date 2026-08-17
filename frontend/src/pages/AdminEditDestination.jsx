
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Save,
  MapPin,
  Image,
  Wallet,
  CalendarDays,
  RefreshCw,
} from "lucide-react";

import api from "../api/api";
import { getStoredUserId } from "../utils/auth";
import travelmateLogo from "../assets/images/travelmate-logo.png";

function AdminEditDestination() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ==========================================
  // FORM STATE
  // ==========================================

  const [formData, setFormData] = useState({
    name: "",
    state: "",
    description: "",
    budget: "",
    bestTime: "",
    imageUrl: "",
  });

  // ==========================================
  // PAGE STATE
  // ==========================================

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  // ==========================================
  // LOAD DESTINATION
  // ==========================================

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/destinations/${id}`
        );

        const destination = response.data;

        // --------------------------------------
        // FILL FORM WITH EXISTING DATA
        // --------------------------------------

        setFormData({
          name: destination.name || "",
          state: destination.state || "",
          description:
            destination.description || "",
          budget: destination.budget || "",
          bestTime:
            destination.bestTime || "",
          imageUrl:
            destination.imageUrl || "",
        });
      } catch (error) {
        console.error(
          "Error loading destination:",
          error
        );

        if (error.response?.status === 404) {
          setError(
            "Destination not found."
          );
        } else {
          setError(
            "Unable to load destination."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [id]);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };


  // ==========================================
  // UPDATE DESTINATION
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // ----------------------------------------
    // BASIC VALIDATION
    // ----------------------------------------

    if (!formData.name.trim()) {
      setError(
        "Please enter the destination name."
      );
      return;
    }

    if (!formData.state.trim()) {
      setError(
        "Please enter the state."
      );
      return;
    }

    if (!formData.description.trim()) {
      setError(
        "Please enter a description."
      );
      return;
    }

    // ----------------------------------------
    // GET ADMIN USER ID
    // ----------------------------------------

    const userId = getStoredUserId();

    if (!userId) {
      setError(
        "Admin user information was not found. Please log in again."
      );
      return;
    }

    try {
      setSaving(true);

      // ----------------------------------------
      // SEND UPDATED DESTINATION
      // ----------------------------------------

      await api.put(
        `/destinations/${id}`,
        {
          name: formData.name.trim(),
          state: formData.state.trim(),
          description:
            formData.description.trim(),
          budget: formData.budget.trim(),
          bestTime:
            formData.bestTime.trim(),
          imageUrl:
            formData.imageUrl.trim(),
        },
        {
          headers: {
            userId: userId,
          },
        }
      );

      // ----------------------------------------
      // SUCCESS
      // ----------------------------------------

      alert(
        "Destination updated successfully."
      );

      navigate("/admin/destinations");
    } catch (error) {
      console.error(
        "Error updating destination:",
        error
      );

      if (error.response?.status === 403) {
        setError(
          "Access denied. Only administrators can update destinations."
        );
      } else if (error.response?.status === 404) {
        setError(
          "Destination not found."
        );
      } else if (error.response?.status === 400) {
        setError(
          "The destination information is invalid."
        );
      } else {
        setError(
          "Unable to update destination. Please try again."
        );
      }
    } finally {
      setSaving(false);
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
            Loading destination...
          </p>
        </div>
      </main>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error && !formData.name) {
    return (
      <main
        className="
          flex
          min-h-screen
          flex-col
          items-center
          justify-center
          bg-[#f6eadb]
          px-6
        "
      >
        <div
          className="
            w-full
            max-w-md
            rounded-3xl
            bg-white
            p-8
            text-center
            shadow-md
          "
        >
          <p className="text-red-500">
            {error}
          </p>

          <button
            onClick={() =>
              navigate("/admin/destinations")
            }
            className="
              mt-6
              rounded-xl
              bg-[#172554]
              px-5
              py-3
              font-semibold
              text-white
              transition
              hover:bg-[#1e3a8a]
            "
          >
            Back to Destinations
          </button>
        </div>
      </main>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main className="min-h-screen bg-[#f6eadb]">

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
            navigate("/admin/destinations")
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

          Manage Destinations
        </button>
      </nav>

      {/* ======================================
          CONTENT
      ====================================== */}

      <section
        className="
          mx-auto
          max-w-4xl
          px-6
          py-10
          md:px-12
        "
      >
        {/* HEADER */}

        <div className="mb-8">
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
            Edit Destination
          </h1>

          <p className="mt-2 text-gray-600">
            Update the information for{" "}
            <span className="font-semibold">
              {formData.name}
            </span>
            .
          </p>
        </div>

        {/* ====================================
            ERROR
        ==================================== */}

        {error && (
          <div
            className="
              mb-6
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
            FORM
        ==================================== */}

        <form
          onSubmit={handleSubmit}
          className="
            rounded-3xl
            bg-white
            p-6
            shadow-md
            md:p-10
          "
        >

          {/* ==================================
              DESTINATION NAME
          ================================== */}

          <div>
            <label
              htmlFor="name"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-[#172554]
              "
            >
              Destination Name
            </label>

            <div className="relative">
              <MapPin
                size={18}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-[#f97316]
                "
              />

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Darjeeling"
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  py-3
                  pl-11
                  pr-4
                  outline-none
                  transition
                  focus:border-[#f97316]
                  focus:bg-white
                  focus:ring-2
                  focus:ring-[#f97316]/20
                "
              />
            </div>
          </div>

          {/* ==================================
              STATE
          ================================== */}

          <div className="mt-6">
            <label
              htmlFor="state"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-[#172554]
              "
            >
              State
            </label>

            <input
              id="state"
              name="state"
              type="text"
              value={formData.state}
              onChange={handleChange}
              placeholder="e.g. West Bengal"
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                px-4
                py-3
                outline-none
                transition
                focus:border-[#f97316]
                focus:bg-white
                focus:ring-2
                focus:ring-[#f97316]/20
              "
            />
          </div>

          {/* ==================================
              DESCRIPTION
          ================================== */}

          <div className="mt-6">
            <label
              htmlFor="description"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-[#172554]
              "
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the destination..."
              rows={6}
              className="
                w-full
                resize-none
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                px-4
                py-3
                outline-none
                transition
                focus:border-[#f97316]
                focus:bg-white
                focus:ring-2
                focus:ring-[#f97316]/20
              "
            />
          </div>

          {/* ==================================
              BUDGET + BEST TIME
          ================================== */}

          <div
            className="
              mt-6
              grid
              grid-cols-1
              gap-6
              md:grid-cols-2
            "
          >
            {/* BUDGET */}

            <div>
              <label
                htmlFor="budget"
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-[#172554]
                "
              >
                Budget
              </label>

              <div className="relative">
                <Wallet
                  size={18}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-[#f97316]
                  "
                />

                <input
                  id="budget"
                  name="budget"
                  type="text"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="e.g. ₹10,000 - ₹15,000"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    py-3
                    pl-11
                    pr-4
                    outline-none
                    transition
                    focus:border-[#f97316]
                    focus:bg-white
                    focus:ring-2
                    focus:ring-[#f97316]/20
                  "
                />
              </div>
            </div>

            {/* BEST TIME */}

            <div>
              <label
                htmlFor="bestTime"
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-[#172554]
                "
              >
                Best Time to Visit
              </label>

              <div className="relative">
                <CalendarDays
                  size={18}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-[#f97316]
                  "
                />

                <input
                  id="bestTime"
                  name="bestTime"
                  type="text"
                  value={formData.bestTime}
                  onChange={handleChange}
                  placeholder="e.g. October - March"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    py-3
                    pl-11
                    pr-4
                    outline-none
                    transition
                    focus:border-[#f97316]
                    focus:bg-white
                    focus:ring-2
                    focus:ring-[#f97316]/20
                  "
                />
              </div>
            </div>
          </div>

          {/* ==================================
              IMAGE URL
          ================================== */}

          <div className="mt-6">
            <label
              htmlFor="imageUrl"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-[#172554]
              "
            >
              Image File Name
            </label>

            <div className="relative">
              <Image
                size={18}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-[#f97316]
                "
              />

              <input
                id="imageUrl"
                name="imageUrl"
                type="text"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="e.g. darjeeling.jpg"
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  py-3
                  pl-11
                  pr-4
                  outline-none
                  transition
                  focus:border-[#f97316]
                  focus:bg-white
                  focus:ring-2
                  focus:ring-[#f97316]/20
                "
              />
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Enter the image file name available
              in your public/images folder.
            </p>
          </div>

          {/* ==================================
              BUTTONS
          ================================== */}

          <div
            className="
              mt-10
              flex
              flex-col-reverse
              gap-3
              border-t
              border-gray-100
              pt-6
              sm:flex-row
              sm:justify-end
            "
          >
            {/* CANCEL */}

            <button
              type="button"
              onClick={() =>
                navigate("/admin/destinations")
              }
              disabled={saving}
              className="
                rounded-xl
                border
                border-[#172554]/20
                px-6
                py-3
                font-semibold
                text-[#172554]
                transition
                hover:bg-[#172554]
                hover:text-white
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            {/* SAVE */}

            <button
              type="submit"
              disabled={saving}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#f97316]
                px-6
                py-3
                font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-[#ea580c]
                hover:shadow-md
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <Save size={18} />

              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default AdminEditDestination;

