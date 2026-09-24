import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  MapPin,
  Wallet,
} from "lucide-react";

import attractionBg from "../assets/images/sunset2.jpeg";
import api from "../api/api";
import Footer from "./Footer";
import Header from "./Header";

function AttractionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [attraction, setAttraction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // GET SPECIFIC ATTRACTION
  // ==========================================

  useEffect(() => {
    const fetchAttraction = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/attractions/${id}`);

        setAttraction(response.data);
      } catch (error) {
        console.error("Error loading attraction:", error);
        setError("Unable to load attraction.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttraction();
  }, [id]);

  // ==========================================
  // GOOGLE MAPS URL
  // ==========================================

  const getGoogleMapsUrl = () => {
    if (
      !attraction ||
      attraction.latitude === null ||
      attraction.latitude === undefined ||
      attraction.longitude === null ||
      attraction.longitude === undefined
    ) {
      return null;
    }

    const latitude = Number(attraction.latitude);
    const longitude = Number(attraction.longitude);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return null;
    }

    return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#eaf1ff]">
        <p className="text-lg font-semibold text-[#172554]">
          Loading attraction...
        </p>
      </main>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !attraction) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#eaf1ff] px-6">
        <p className="text-center text-red-500">
          {error || "Attraction not found."}
        </p>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="
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
          Go Back
        </button>
      </main>
    );
  }

  return (
    <main
      className="
        min-h-screen
        bg-cover
        bg-center
        bg-fixed
      "
      style={{
        backgroundImage: `
          linear-gradient(
            rgba(219,234,254,0.68),
            rgba(237,233,254,0.58),
            rgba(255,237,213,0.68)
          ),
          url(${attractionBg})
        `,
      }}
    >

      {/* ======================================
          HEADER
          Separate Header.jsx
      ====================================== */}

      <Header />


      {/* ======================================
          MAIN CONTENT
      ====================================== */}

      <section
        className="
          mx-auto
          max-w-5xl
          px-6
          py-10
          md:px-12
          md:py-14
        "
      >

        {/* ======================================
            IMAGE
        ====================================== */}

        <div
          className="
            relative
            h-[300px]
            overflow-hidden
            rounded-[28px]
            border
            border-white/40
            bg-white/20
            shadow-[0_25px_70px_rgba(23,37,84,0.20)]
            backdrop-blur-md
            md:h-[500px]
          "
        >

          <img
            src={
              attraction.imageUrl
                ? `/${attraction.imageUrl}`
                : "/default-attraction.jpg"
            }
            alt={attraction.name}
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

          {/* IMAGE LIGHT OVERLAY */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-t
              from-[#172554]/35
              via-transparent
              to-purple-400/10
            "
          />

        </div>


        {/* ======================================
            INFORMATION GLASS CARD
        ====================================== */}

        <div
          className="
            relative
            mt-8
            overflow-hidden
            rounded-[30px]
            border
            border-white/45
            bg-white/35
            p-6
            shadow-[0_25px_70px_rgba(23,37,84,0.18)]
            backdrop-blur-2xl
            md:p-10
          "
        >

          {/* BLUE GLOW */}

          <div
            className="
              pointer-events-none
              absolute
              -left-24
              -top-24
              h-64
              w-64
              rounded-full
              bg-blue-400/15
              blur-3xl
            "
          />

          {/* PURPLE GLOW */}

          <div
            className="
              pointer-events-none
              absolute
              right-0
              top-0
              h-52
              w-52
              rounded-full
              bg-purple-400/15
              blur-3xl
            "
          />

          {/* ORANGE GLOW */}

          <div
            className="
              pointer-events-none
              absolute
              -bottom-20
              -right-10
              h-48
              w-48
              rounded-full
              bg-orange-400/15
              blur-3xl
            "
          />

          <div className="relative z-10">

            {/* NAME */}

            <h1
              className="
                text-4xl
                font-bold
                tracking-tight
                text-[#172554]
                md:text-5xl
              "
            >
              {attraction.name}
            </h1>


            {/* LOCATION */}

            {attraction.location && (
              <div
                className="
                  mt-4
                  flex
                  items-center
                  gap-2
                  text-purple-700
                "
              >
                <MapPin size={19} />

                <span className="font-semibold">
                  {attraction.location}
                </span>
              </div>
            )}


            {/* GOOGLE MAPS BUTTON */}

            {getGoogleMapsUrl() && (
              <a
                href={getGoogleMapsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-gradient-to-r
                  from-[#172554]
                  via-[#3730a3]
                  to-[#f97316]
                  px-5
                  py-3
                  font-semibold
                  text-white
                  shadow-[0_8px_25px_rgba(23,37,84,0.22)]
                  transition
                  duration-300
                  hover:-translate-y-0.5
                  hover:shadow-[0_12px_30px_rgba(249,115,22,0.25)]
                "
              >
                <MapPin size={18} />

                Open in Google Maps
              </a>
            )}


            {/* DESCRIPTION */}

            <div className="mt-9">

              <h2
                className="
                  text-2xl
                  font-bold
                  text-[#172554]
                "
              >
                About this attraction
              </h2>

              <p
                className="
                  mt-3
                  leading-7
                  text-gray-700
                "
              >
                {attraction.description ||
                  "No description available for this attraction."}
              </p>

            </div>


            {/* COORDINATES */}

            {getGoogleMapsUrl() && (
              <div
                className="
                  mt-7
                  rounded-2xl
                  border
                  border-white/40
                  bg-white/30
                  p-5
                  backdrop-blur-md
                "
              >

                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-gray-500
                  "
                >
                  Location Coordinates
                </p>

                <p
                  className="
                    mt-1
                    text-sm
                    font-semibold
                    text-[#172554]
                  "
                >
                  {Number(attraction.latitude).toFixed(6)}
                  {", "}
                  {Number(attraction.longitude).toFixed(6)}
                </p>

              </div>
            )}


            {/* ENTRY FEE */}

            {attraction.entryFee && (
              <div
                className="
                  mt-7
                  rounded-2xl
                  border
                  border-orange-200/50
                  bg-gradient-to-r
                  from-orange-50/50
                  to-white/30
                  p-5
                  backdrop-blur-md
                "
              >

                <Wallet
                  size={24}
                  className="text-orange-500"
                />

                <p
                  className="
                    mt-3
                    text-sm
                    font-medium
                    text-gray-500
                  "
                >
                  Entry Fee
                </p>

                <p
                  className="
                    mt-1
                    text-xl
                    font-bold
                    text-[#172554]
                  "
                >
                  {attraction.entryFee}
                </p>

              </div>
            )}


            {/* BACK TO DESTINATION */}

            <button
              type="button"
              onClick={() => {
                if (
                  attraction.destination &&
                  attraction.destination.id
                ) {
                  navigate(
                    `/destinations/${attraction.destination.id}`
                  );
                } else {
                  navigate(-1);
                }
              }}
              className="
                mt-8
                rounded-xl
                bg-gradient-to-r
                from-[#172554]
                via-[#1e3a8a]
                to-[#f97316]
                px-6
                py-3
                font-semibold
                text-white
                shadow-[0_8px_25px_rgba(23,37,84,0.20)]
                transition
                duration-300
                hover:-translate-y-0.5
                hover:shadow-[0_12px_30px_rgba(249,115,22,0.25)]
              "
            >
              Back to Destination
            </button>

          </div>
        </div>

      </section>


      {/* ======================================
          FOOTER
      ====================================== */}

      <Footer />

    </main>
  );
}

export default AttractionDetails;