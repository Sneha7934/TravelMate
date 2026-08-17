
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Save,
  RefreshCw,
  MapPin,
  Wallet,
  Image,
  Navigation,
} from "lucide-react";

import api from "../api/api";
import { getStoredUserId } from "../utils/auth";
import travelmateLogo from "../assets/images/travelmate-logo.png";

function AdminEditAttraction() {
  const navigate = useNavigate();
  const { id } = useParams();

  // ==========================================
  // STATE
  // ==========================================

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    entryFee: "",
    imageUrl: "",
    latitude: "",
    longitude: "",
    destinationId: "",
  });

  const [destinations, setDestinations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD ATTRACTION + DESTINATIONS
  // ==========================================

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [attractionResponse, destinationsResponse] =
          await Promise.all([
            api.get(`/attractions/${id}`),
            api.get("/destinations"),
          ]);

        const attraction = attractionResponse.data;

        setFormData({
          name: attraction.name || "",
          description: attraction.description || "",
          location: attraction.location || "",
          entryFee: attraction.entryFee || "",
          imageUrl: attraction.imageUrl || "",
          latitude:
            attraction.latitude !== null &&
            attraction.latitude !== undefined
              ? attraction.latitude
              : "",
          longitude:
            attraction.longitude !== null &&
            attraction.longitude !== undefined
              ? attraction.longitude
              : "",
          destinationId:
            attraction.destination?.id || "",
        });

        setDestinations(
          destinationsResponse.data || []
        );
      } catch (error) {
        console.error(
          "Error loading attraction:",
          error
        );

        setError(
          "Unable to load attraction."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
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
  // UPDATE ATTRACTION
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userId = getStoredUserId();

    if (!userId) {
      alert(
        "Admin user information was not found. Please log in again."
      );

      return;
    }

    // Basic validation
    if (!formData.name.trim()) {
      alert("Please enter the attraction name.");
      return;
    }

    if (!formData.destinationId) {
      alert("Please select a destination.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const selectedDestination =
        destinations.find(
          (destination) =>
            String(destination.id) ===
            String(formData.destinationId)
        );

      const updatedAttraction = {
        name: formData.name.trim(),

        description:
          formData.description.trim(),

        location:
          formData.location.trim(),

        entryFee:
          formData.entryFee.trim(),

        imageUrl:
          formData.imageUrl.trim(),

        latitude:
          formData.latitude === ""
            ? null
            : Number(formData.latitude),

        longitude:
          formData.longitude === ""
            ? null
            : Number(formData.longitude),

        destination:
          selectedDestination,
      };

      await api.put(
        `/attractions/${id}`,
        updatedAttraction,
        {
          headers: {
            userId: userId,
          },
        }
      );

      alert(
        "Attraction updated successfully."
      );

      navigate("/admin/attractions");
    } catch (error) {
      console.error(
        "Error updating attraction:",
        error
      );

      if (
        error.response?.status === 403
      ) {
        setError(
          "Access denied. Admin only."
        );
      } else if (
        error.response?.status === 404
      ) {
        setError(
          "Attraction was not found."
        );
      } else {
        setError(
          "Unable to update attraction."
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
            Loading attraction...
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
            navigate("/admin/attractions")
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

          Attractions
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
            Edit Attraction
          </h1>

          <p
            className="
              mt-2
              text-gray-600
            "
          >
            Update the attraction information
            available on TravelMate.
          </p>
        </div>

        {/* ERROR */}

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

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="
            mt-8
            rounded-3xl
            bg-white
            p-6
            shadow-md
            md:p-10
          "
        >
          {/* NAME */}

          <div>
            <label
              htmlFor="name"
              className="
                block
                text-sm
                font-semibold
                text-[#172554]
              "
            >
              Attraction Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter attraction name"
              className="
                mt-2
                w-full
                rounded-xl
                border
                border-gray-200
                px-4
                py-3
                outline-none
                transition
                focus:border-[#f97316]
                focus:ring-2
                focus:ring-[#f97316]/20
              "
              required
            />
          </div>

          {/* DESCRIPTION */}

          <div className="mt-6">
            <label
              htmlFor="description"
              className="
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
              placeholder="Describe the attraction"
              rows={6}
              className="
                mt-2
                w-full
                resize-none
                rounded-xl
                border
                border-gray-200
                px-4
                py-3
                outline-none
                transition
                focus:border-[#f97316]
                focus:ring-2
                focus:ring-[#f97316]/20
              "
            />
          </div>

          {/* LOCATION */}

          <div className="mt-6">
            <label
              htmlFor="location"
              className="
                flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-[#172554]
              "
            >
              <MapPin size={16} />

              Location
            </label>

            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              placeholder="Example: Jaipur, Rajasthan"
              className="
                mt-2
                w-full
                rounded-xl
                border
                border-gray-200
                px-4
                py-3
                outline-none
                transition
                focus:border-[#f97316]
                focus:ring-2
                focus:ring-[#f97316]/20
              "
            />
          </div>

          {/* ENTRY FEE */}

          <div className="mt-6">
            <label
              htmlFor="entryFee"
              className="
                flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-[#172554]
              "
            >
              <Wallet size={16} />

              Entry Fee
            </label>

            <input
              id="entryFee"
              name="entryFee"
              type="text"
              value={formData.entryFee}
              onChange={handleChange}
              placeholder="Example: ₹50"
              className="
                mt-2
                w-full
                rounded-xl
                border
                border-gray-200
                px-4
                py-3
                outline-none
                transition
                focus:border-[#f97316]
                focus:ring-2
                focus:ring-[#f97316]/20
              "
            />
          </div>

          {/* IMAGE */}

          <div className="mt-6">
            <label
              htmlFor="imageUrl"
              className="
                flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-[#172554]
              "
            >
              <Image size={16} />

              Image File Name
            </label>

            <input
              id="imageUrl"
              name="imageUrl"
              type="text"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="Example: taj-mahal.jpg"
              className="
                mt-2
                w-full
                rounded-xl
                border
                border-gray-200
                px-4
                py-3
                outline-none
                transition
                focus:border-[#f97316]
                focus:ring-2
                focus:ring-[#f97316]/20
              "
            />

            <p
              className="
                mt-2
                text-xs
                text-gray-500
              "
            >
              Enter the image file name
              stored in your public/images
              folder.
            </p>
          </div>

          {/* COORDINATES */}

          <div className="mt-6">
            <p
              className="
                flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-[#172554]
              "
            >
              <Navigation size={16} />

              Google Maps Coordinates
            </p>

            <div
              className="
                mt-2
                grid
                grid-cols-1
                gap-4
                md:grid-cols-2
              "
            >
              {/* LATITUDE */}

              <div>
                <label
                  htmlFor="latitude"
                  className="
                    block
                    text-xs
                    font-medium
                    text-gray-500
                  "
                >
                  Latitude
                </label>

                <input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="Example: 27.1751"
                  className="
                    mt-2
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    px-4
                    py-3
                    outline-none
                    transition
                    focus:border-[#f97316]
                    focus:ring-2
                    focus:ring-[#f97316]/20
                  "
                />
              </div>

              {/* LONGITUDE */}

              <div>
                <label
                  htmlFor="longitude"
                  className="
                    block
                    text-xs
                    font-medium
                    text-gray-500
                  "
                >
                  Longitude
                </label>

                <input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="Example: 78.0421"
                  className="
                    mt-2
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    px-4
                    py-3
                    outline-none
                    transition
                    focus:border-[#f97316]
                    focus:ring-2
                    focus:ring-[#f97316]/20
                  "
                />
              </div>
            </div>
          </div>

          {/* DESTINATION */}

          <div className="mt-6">
            <label
              htmlFor="destinationId"
              className="
                block
                text-sm
                font-semibold
                text-[#172554]
              "
            >
              Destination
            </label>

            <select
              id="destinationId"
              name="destinationId"
              value={formData.destinationId}
              onChange={handleChange}
              className="
                mt-2
                w-full
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                py-3
                outline-none
                transition
                focus:border-[#f97316]
                focus:ring-2
                focus:ring-[#f97316]/20
              "
              required
            >
              <option value="">
                Select a destination
              </option>

              {destinations.map(
                (destination) => (
                  <option
                    key={destination.id}
                    value={destination.id}
                  >
                    {destination.name}
                    {destination.state
                      ? `, ${destination.state}`
                      : ""}
                  </option>
                )
              )}
            </select>
          </div>

          {/* ACTIONS */}

          <div
            className="
              mt-8
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
            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin/attractions"
                )
              }
              className="
                rounded-xl
                border
                border-gray-200
                px-6
                py-3
                font-semibold
                text-gray-600
                transition
                hover:bg-gray-50
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#172554]
                px-6
                py-3
                font-semibold
                text-white
                transition
                hover:bg-[#1e3a8a]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {saving ? (
                <>
                  <RefreshCw
                    size={18}
                    className="animate-spin"
                  />

                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />

                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default AdminEditAttraction;

