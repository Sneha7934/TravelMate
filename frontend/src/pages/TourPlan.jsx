import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  MapPin,
  Wallet,
  ExternalLink,
  Navigation,
  Clock,
  Milestone,
  Route,
  Sparkles,
  Map,
} from "lucide-react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import api from "../api/api";
import travelmateLogo from "../assets/images/travelmate-logo.png";
import travelBg from "../assets/images/forgot-password-bg.png";

import Footer from "./Footer";

import "leaflet/dist/leaflet.css";

// ======================================================
// FIX LEAFLET DEFAULT MARKER ICON
// ======================================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ======================================================
// MAP AUTO FIT COMPONENT
// ======================================================

function MapBounds({ attractions, routeCoordinates }) {
  const map = useMap();

  useEffect(() => {
    if (routeCoordinates && routeCoordinates.length > 0) {
      const bounds = L.latLngBounds(routeCoordinates);

      if (bounds.isValid()) {
        map.fitBounds(bounds, {
          padding: [50, 50],
        });
      }

      return;
    }

    if (attractions && attractions.length > 0) {
      const validCoordinates = attractions
        .filter(
          (attraction) =>
            Number.isFinite(Number(attraction.latitude)) &&
            Number.isFinite(Number(attraction.longitude))
        )
        .map((attraction) => [
          Number(attraction.latitude),
          Number(attraction.longitude),
        ]);

      if (validCoordinates.length > 0) {
        const bounds = L.latLngBounds(validCoordinates);

        if (bounds.isValid()) {
          map.fitBounds(bounds, {
            padding: [50, 50],
          });
        }
      }
    }
  }, [map, attractions, routeCoordinates]);

  return null;
}

// ======================================================
// GOOGLE MAPS URL
// ======================================================

function getGoogleMapsUrl(attraction) {
  const latitude = Number(attraction.latitude);
  const longitude = Number(attraction.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
}

// ======================================================
// HAVERSINE DISTANCE
// ======================================================

function calculateDistance(
  latitude1,
  longitude1,
  latitude2,
  longitude2
) {
  const earthRadius = 6371;

  const lat1 = (Number(latitude1) * Math.PI) / 180;
  const lat2 = (Number(latitude2) * Math.PI) / 180;

  const deltaLatitude =
    ((Number(latitude2) - Number(latitude1)) * Math.PI) / 180;

  const deltaLongitude =
    ((Number(longitude2) - Number(longitude1)) * Math.PI) / 180;

  const a =
    Math.sin(deltaLatitude / 2) *
      Math.sin(deltaLatitude / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLongitude / 2) *
      Math.sin(deltaLongitude / 2);

  const c =
    2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

// ======================================================
// NEAREST NEIGHBOUR TOUR ORDER
// ======================================================

function createNearestNeighbourOrder(attractions, startId) {
  if (!attractions || attractions.length === 0) {
    return [];
  }

  const validAttractions = attractions.filter((attraction) => {
    const latitude = Number(attraction.latitude);
    const longitude = Number(attraction.longitude);

    return (
      Number.isFinite(latitude) &&
      Number.isFinite(longitude)
    );
  });

  if (validAttractions.length <= 1) {
    return [...validAttractions];
  }

  const unvisited = [...validAttractions];

  let startIdx = unvisited.findIndex(
    (item) => String(item.id) === String(startId)
  );

  if (startIdx === -1) {
    startIdx = 0;
  }

  const tour = [unvisited[startIdx]];

  unvisited.splice(startIdx, 1);

  while (unvisited.length > 0) {
    const current = tour[tour.length - 1];

    let nearestIndex = 0;
    let shortestDistance = Infinity;

    unvisited.forEach((candidate, index) => {
      const distance = calculateDistance(
        current.latitude,
        current.longitude,
        candidate.latitude,
        candidate.longitude
      );

      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestIndex = index;
      }
    });

    const nearest = unvisited.splice(nearestIndex, 1)[0];

    tour.push(nearest);
  }

  return tour;
}

// ======================================================
// FORMATTING UTILITIES
// ======================================================

const formatDistance = (meters) => {
  if (meters === null || meters === undefined) {
    return null;
  }

  return meters >= 1000
    ? `${(meters / 1000).toFixed(1)} km`
    : `${Math.round(meters)} m`;
};

const formatDuration = (seconds) => {
  if (seconds === null || seconds === undefined) {
    return null;
  }

  const totalMinutes = Math.round(seconds / 60);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours} hr ${minutes} min`;
  }

  return `${minutes} min`;
};

// ======================================================
// TOUR PLAN COMPONENT
// ======================================================

function TourPlan() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [destination, setDestination] = useState(null);
  const [rawAttractions, setRawAttractions] = useState([]);
  const [startAttractionId, setStartAttractionId] = useState("");

  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [routeLegs, setRouteLegs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [routeLoading, setRouteLoading] = useState(false);

  const [error, setError] = useState("");
  const [routeError, setRouteError] = useState("");

  const [routeDistance, setRouteDistance] = useState(null);
  const [routeDuration, setRouteDuration] = useState(null);

  // ======================================================
  // LOAD DESTINATION + ATTRACTIONS
  // ======================================================

  useEffect(() => {
    const fetchTourPlan = async () => {
      try {
        setLoading(true);
        setError("");

        const destinationResponse = await api.get(
          `/destinations/${id}`
        );

        const attractionsResponse = await api.get(
          `/attractions/destination/${id}`
        );

        setDestination(destinationResponse.data);

        const fetched = attractionsResponse.data || [];

        setRawAttractions(fetched);

        if (fetched.length > 0) {
          setStartAttractionId(String(fetched[0].id));
        }
      } catch (err) {
        console.error("Error loading tour plan:", err);

        setError("Unable to load tour plan.");
      } finally {
        setLoading(false);
      }
    };

    fetchTourPlan();
  }, [id]);

  // ======================================================
  // ORDER ATTRACTIONS
  // ======================================================

  const orderedAttractions = useMemo(() => {
    return createNearestNeighbourOrder(
      rawAttractions,
      startAttractionId
    );
  }, [rawAttractions, startAttractionId]);

  // ======================================================
  // FETCH ROAD ROUTE FROM OSRM
  // ======================================================

  useEffect(() => {
    const fetchRoadRoute = async () => {
      if (
        !orderedAttractions ||
        orderedAttractions.length < 2
      ) {
        setRouteCoordinates([]);
        setRouteLegs([]);
        setRouteDistance(null);
        setRouteDuration(null);

        return;
      }

      const validAttractions = orderedAttractions.filter(
        (attraction) => {
          const latitude = Number(attraction.latitude);
          const longitude = Number(attraction.longitude);

          return (
            Number.isFinite(latitude) &&
            Number.isFinite(longitude)
          );
        }
      );

      if (validAttractions.length < 2) {
        setRouteCoordinates([]);
        setRouteLegs([]);

        return;
      }

      try {
        setRouteLoading(true);
        setRouteError("");

        const coordinates = validAttractions
          .map(
            (attraction) =>
              `${Number(attraction.longitude)},${Number(
                attraction.latitude
              )}`
          )
          .join(";");

        const osrmUrl =
          `https://router.project-osrm.org/route/v1/driving/${coordinates}` +
          `?overview=full&geometries=geojson&steps=false`;

        const response = await fetch(osrmUrl);

        if (!response.ok) {
          throw new Error("OSRM request failed.");
        }

        const data = await response.json();

        if (
          data.code !== "Ok" ||
          !data.routes ||
          data.routes.length === 0
        ) {
          throw new Error("No road route was found.");
        }

        const primaryRoute = data.routes[0];

        const roadCoordinates =
          primaryRoute.geometry.coordinates.map(
            ([longitude, latitude]) => [
              latitude,
              longitude,
            ]
          );

        setRouteCoordinates(roadCoordinates);

        setRouteDistance(primaryRoute.distance);

        setRouteDuration(primaryRoute.duration);

        setRouteLegs(primaryRoute.legs || []);
      } catch (err) {
        console.error("Error loading road route:", err);

        setRouteError(
          "Unable to load the road route. Showing direct paths instead."
        );

        const fallbackCoordinates =
          validAttractions.map((attraction) => [
            Number(attraction.latitude),
            Number(attraction.longitude),
          ]);

        setRouteCoordinates(fallbackCoordinates);

        setRouteLegs([]);

        setRouteDistance(null);

        setRouteDuration(null);
      } finally {
        setRouteLoading(false);
      }
    };

    fetchRoadRoute();
  }, [orderedAttractions]);

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${travelBg})`,
        }}
      >
        <div className="rounded-3xl bg-white/90 px-10 py-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#f97316]/20 border-t-[#f97316]" />

          <p className="font-semibold text-[#172554]">
            Preparing your tour plan...
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Finding the best route for you
          </p>
        </div>
      </div>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================

  if (error || !destination) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center bg-cover bg-center px-6"
        style={{
          backgroundImage: `url(${travelBg})`,
        }}
      >
        <div className="max-w-md rounded-3xl bg-white/90 p-10 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
            <MapPin size={30} />
          </div>

          <h2 className="text-2xl font-bold text-[#172554]">
            Something went wrong
          </h2>

          <p className="mt-3 text-gray-500">
            {error || "Destination not found."}
          </p>

          <button
            onClick={() =>
              navigate(`/destinations/${id}`)
            }
            className="mt-7 rounded-xl bg-[#172554] px-6 py-3 font-semibold text-white transition hover:bg-[#1e3a8a]"
          >
            Back to Destination
          </button>
        </div>
      </div>
    );
  }

  // ======================================================
  // VALID MAP ATTRACTIONS
  // ======================================================

  const mappedAttractions =
    orderedAttractions.filter((attraction) => {
      const latitude = Number(attraction.latitude);
      const longitude = Number(attraction.longitude);

      return (
        Number.isFinite(latitude) &&
        Number.isFinite(longitude)
      );
    });

  const mapCenter =
    mappedAttractions.length > 0
      ? [
          Number(mappedAttractions[0].latitude),
          Number(mappedAttractions[0].longitude),
        ]
      : [20.5937, 78.9629];

  // ======================================================
  // MAIN UI
  // ======================================================

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* ==================================================
          FULL PAGE SUNSET BACKGROUND
      ================================================== */}

      <div
        className="fixed inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage: `url(${travelBg})`,
        }}
      />

      {/* Soft overlay so text/cards remain readable */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#fff7ed]/65 via-[#fef3e2]/55 to-[#f6eadb]/70" />

      {/* ==================================================
          NAVBAR
      ================================================== */}

      <nav className="sticky top-0 z-50 border-b border-white/50 bg-white/65 px-5 py-3 shadow-sm backdrop-blur-xl md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <button
            onClick={() => navigate("/home")}
            className="group flex items-center gap-2"
          >
            <img
              src={travelmateLogo}
              alt="TravelMate Logo"
              className="h-12 w-14 object-contain transition-transform group-hover:scale-105"
            />

            <h1 className="text-2xl font-extrabold tracking-tight text-[#172554] md:text-3xl">
              TravelMate
            </h1>
          </button>

          <button
            onClick={() =>
              navigate(`/destinations/${id}`)
            }
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-[#172554] transition hover:bg-white/80 md:px-4"
          >
            <ArrowLeft size={18} />

            <span className="hidden sm:inline">
              Back to Destination
            </span>

            <span className="sm:hidden">Back</span>
          </button>
        </div>
      </nav>

      {/* ==================================================
          PAGE CONTENT
      ================================================== */}

      <section className="relative">
        <div className="mx-auto max-w-7xl px-5 py-8 md:px-10 md:py-12">

          {/* ==================================================
              COLORFUL LIGHT HERO
              NO GLASSMORPHISM HERE
          ================================================== */}

          <div className="relative mb-8 overflow-hidden rounded-[2rem] border border-orange-200/80 bg-gradient-to-br from-[#fff1d6] via-[#ffe4c7] to-[#ffd6c9] px-7 py-10 shadow-2xl md:px-12 md:py-14">

            {/* Decorative colorful shapes */}

            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#fb923c]/20 blur-3xl" />

            <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-[#f472b6]/15 blur-3xl" />

            <div className="absolute right-20 top-10 h-24 w-24 rounded-full bg-[#facc15]/20 blur-2xl" />

            <div className="relative z-10">

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/60 px-4 py-2 text-sm font-bold text-[#c2410c] shadow-sm">
                <Sparkles
                  size={16}
                  className="text-[#f97316]"
                />

                Personalized Travel Route
              </div>

              <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">

                <div>
                  <p className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[#ea580c]">
                    <MapPin size={17} />

                    {destination.state}
                  </p>

                  <h1 className="mt-3 text-4xl font-black tracking-tight text-[#172554] md:text-6xl">
                    {destination.name}
                  </h1>

                  <p className="mt-3 text-xl font-bold text-[#334155]">
                    Your Personalized Tour Plan
                  </p>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-[#475569] md:text-base">
                    Choose where you want to begin and
                    TravelMate will arrange the attractions
                    into a convenient route based on the
                    nearest locations.
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/70 bg-white/60 px-5 py-4 shadow-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#f97316] to-[#fb7185] text-white shadow-md">
                    <Route size={24} />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-500">
                      Planned Stops
                    </p>

                    <p className="text-2xl font-black text-[#172554]">
                      {mappedAttractions.length}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* ==================================================
              STARTING POINT SELECTOR
              GLASSMORPHISM
          ================================================== */}

          <div className="mb-8 rounded-3xl border border-white/70 bg-white/45 p-6 shadow-xl backdrop-blur-xl md:p-7">

            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100/80">
                    <Navigation
                      size={21}
                      className="text-[#f97316]"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#f97316]">
                      Step 01
                    </p>

                    <h2 className="text-lg font-bold text-[#172554]">
                      Choose Your Starting Point
                    </h2>
                  </div>
                </div>

                <p className="mt-3 max-w-xl text-sm text-gray-600">
                  Select the attraction where you would like
                  your journey to begin. The route will
                  automatically be rearranged.
                </p>
              </div>

              <div className="w-full md:max-w-sm">
                <select
                  value={startAttractionId}
                  onChange={(e) =>
                    setStartAttractionId(e.target.value)
                  }
                  className="w-full cursor-pointer rounded-2xl border border-white/80 bg-white/65 px-4 py-4 text-sm font-bold text-[#172554] shadow-sm outline-none transition focus:border-[#f97316] focus:ring-4 focus:ring-orange-100"
                >
                  {rawAttractions.map((attraction) => (
                    <option
                      key={attraction.id}
                      value={attraction.id}
                    >
                      {attraction.name}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          {/* ==================================================
              ROUTE SUMMARY
              GLASSMORPHISM
          ================================================== */}

          {mappedAttractions.length > 0 && (
            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">

              {/* STOPS */}

              <div className="group rounded-3xl border border-white/70 bg-white/45 p-6 shadow-lg backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/55">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Tour Stops
                    </p>

                    <p className="mt-1 text-3xl font-black text-[#172554]">
                      {mappedAttractions.length}
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100/80">
                    <Map
                      size={23}
                      className="text-[#f97316]"
                    />
                  </div>
                </div>
              </div>

              {/* DISTANCE */}

              <div className="group rounded-3xl border border-white/70 bg-white/45 p-6 shadow-lg backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/55">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Distance
                    </p>

                    <p className="mt-1 text-3xl font-black text-[#172554]">
                      {routeLoading
                        ? "..."
                        : formatDistance(routeDistance) ||
                          "—"}
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100/80">
                    <Route
                      size={23}
                      className="text-[#172554]"
                    />
                  </div>
                </div>
              </div>

              {/* TIME */}

              <div className="group rounded-3xl border border-white/70 bg-white/45 p-6 shadow-lg backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/55">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Driving Time
                    </p>

                    <p className="mt-1 text-3xl font-black text-[#172554]">
                      {routeLoading
                        ? "..."
                        : formatDuration(routeDuration) ||
                          "—"}
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100/80">
                    <Clock
                      size={23}
                      className="text-purple-600"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ==================================================
              MAP
              GLASS CONTAINER
          ================================================== */}

          <div className="mb-12 overflow-hidden rounded-[2rem] border border-white/70 bg-white/50 p-3 shadow-2xl backdrop-blur-xl">

            <div className="mb-3 flex flex-col justify-between gap-3 px-3 py-3 sm:flex-row sm:items-center">

              <div>
                <div className="flex items-center gap-2">
                  <Map
                    size={20}
                    className="text-[#f97316]"
                  />

                  <h2 className="text-xl font-black text-[#172554]">
                    Interactive Route Map
                  </h2>
                </div>

                <p className="mt-1 text-xs text-gray-600">
                  Follow the recommended route between
                  your selected attractions.
                </p>
              </div>

              {routeLoading && (
                <div className="inline-flex items-center gap-2 rounded-full bg-orange-50/90 px-4 py-2 text-xs font-bold text-[#f97316]">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#f97316]" />
                  Calculating route...
                </div>
              )}

            </div>

            {mappedAttractions.length === 0 ? (
              <div className="flex h-[500px] items-center justify-center rounded-2xl bg-white/40">
                <div className="text-center">
                  <MapPin
                    size={40}
                    className="mx-auto text-gray-300"
                  />

                  <p className="mt-3 font-semibold text-gray-500">
                    Location coordinates unavailable.
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative">

                {!routeLoading && routeError && (
                  <div className="absolute bottom-4 left-1/2 z-[1000] -translate-x-1/2 rounded-xl bg-white px-4 py-3 text-xs font-medium text-gray-600 shadow-xl">
                    {routeError}
                  </div>
                )}

                <MapContainer
                  center={mapCenter}
                  zoom={10}
                  scrollWheelZoom={true}
                  className="h-[500px] w-full rounded-2xl"
                >

                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <MapBounds
                    attractions={mappedAttractions}
                    routeCoordinates={routeCoordinates}
                  />

                  {routeCoordinates.length > 1 && (
                    <Polyline
                      positions={routeCoordinates}
                      pathOptions={{
                        color: "#f97316",
                        weight: 5,
                        opacity: 0.85,
                        lineCap: "round",
                        lineJoin: "round",
                      }}
                    />
                  )}

                  {mappedAttractions.map(
                    (attraction, index) => {
                      const googleMapsUrl =
                        getGoogleMapsUrl(attraction);

                      return (
                        <Marker
                          key={attraction.id}
                          position={[
                            Number(attraction.latitude),
                            Number(attraction.longitude),
                          ]}
                        >
                          <Tooltip
                            permanent
                            direction="right"
                            offset={[10, 0]}
                            className="tour-marker-label"
                          >
                            <span className="font-semibold text-[#172554]">
                              {index === 0
                                ? "🚩 "
                                : `${index + 1}. `}
                              {attraction.name}
                            </span>
                          </Tooltip>

                          <Popup>
                            <div className="min-w-[220px]">
                              <p className="text-xs font-bold uppercase tracking-wide text-[#f97316]">
                                {index === 0
                                  ? "Starting Point"
                                  : `Stop ${index + 1}`}
                              </p>

                              <h3 className="mt-1 text-base font-bold text-[#172554]">
                                {attraction.name}
                              </h3>

                              {attraction.description && (
                                <p className="mt-2 text-xs leading-5 text-gray-500">
                                  {attraction.description}
                                </p>
                              )}

                              {attraction.entryFee && (
                                <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-gray-700">
                                  <Wallet
                                    size={14}
                                    className="text-[#f97316]"
                                  />

                                  {attraction.entryFee}
                                </div>
                              )}

                              {googleMapsUrl && (
                                <a
                                  href={googleMapsUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                                >
                                  Open in Google Maps

                                  <ExternalLink size={13} />
                                </a>
                              )}
                            </div>
                          </Popup>
                        </Marker>
                      );
                    }
                  )}

                </MapContainer>
              </div>
            )}
          </div>

          {/* ==================================================
              TOUR SEQUENCE
          ================================================== */}

          <div className="mb-16">

            <div className="mb-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#172554] text-white shadow-lg">
                  <Route size={23} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#f97316]">
                    Step 02
                  </p>

                  <h2 className="text-3xl font-black text-[#172554]">
                    Your Tour Sequence
                  </h2>
                </div>
              </div>

              <p className="mt-3 max-w-2xl text-gray-600">
                Your attractions are arranged from your
                chosen starting point to the nearest available
                location, creating a simple travel sequence.
              </p>
            </div>

            <div className="space-y-6">

              {orderedAttractions.map(
                (attraction, index) => {
                  const googleMapsUrl =
                    getGoogleMapsUrl(attraction);

                  const hasCoordinates =
                    Number.isFinite(
                      Number(attraction.latitude)
                    ) &&
                    Number.isFinite(
                      Number(attraction.longitude)
                    );

                  const legToThisStop =
                    index > 0 &&
                    routeLegs[index - 1];

                  return (
                    <div
                      key={attraction.id}
                      className="relative"
                    >

                      {/* DISTANCE BETWEEN STOPS */}

                      {index > 0 && (
                        <div className="mb-4 ml-5 flex flex-wrap items-center gap-3 border-l-2 border-dashed border-[#f97316] py-1 pl-6">

                          <div className="flex items-center gap-2 rounded-xl bg-orange-100/80 px-3 py-2 text-sm font-bold text-[#f97316]">
                            <Milestone size={16} />

                            {legToThisStop
                              ? formatDistance(
                                  legToThisStop.distance
                                )
                              : "Calculating..."}
                          </div>

                          <div className="flex items-center gap-2 rounded-xl bg-blue-100/80 px-3 py-2 text-sm font-bold text-[#172554]">
                            <Clock size={16} />

                            {legToThisStop
                              ? formatDuration(
                                  legToThisStop.duration
                                )
                              : "Calculating..."}
                          </div>

                          <span className="text-xs font-medium text-gray-500">
                            Drive to Stop {index + 1}
                          </span>
                        </div>
                      )}

                      {/* ATTRACTION CARD */}

                      <article className="group overflow-hidden rounded-[2rem] border border-white/70 bg-white/50 shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/60 hover:shadow-2xl">

                        <div className="flex flex-col md:flex-row">

                          {/* IMAGE */}

                          <div className="relative h-64 w-full overflow-hidden md:h-auto md:w-72">

                            <img
                              src={
                                attraction.imageUrl
                                  ? `/${attraction.imageUrl}`
                                  : "/default-attraction.jpg"
                              }
                              alt={attraction.name}
                              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "/default-attraction.jpg";
                              }}
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                            {/* STOP BADGE */}

                            <div
                              className={`absolute left-5 top-5 flex h-12 min-w-12 items-center justify-center rounded-2xl px-3 text-sm font-black text-white shadow-lg backdrop-blur-md ${
                                index === 0
                                  ? "bg-green-600/90"
                                  : "bg-[#f97316]/95"
                              }`}
                            >
                              {index === 0
                                ? "START"
                                : index + 1}
                            </div>

                          </div>

                          {/* DETAILS */}

                          <div className="flex flex-1 flex-col justify-between p-7 md:p-8">

                            <div>

                              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                                <div>

                                  {index === 0 && (
                                    <span className="text-xs font-bold uppercase tracking-widest text-green-600">
                                      Journey Begins Here
                                    </span>
                                  )}

                                  <h3 className="mt-1 text-2xl font-black text-[#172554] md:text-3xl">
                                    {attraction.name}
                                  </h3>

                                </div>

                                {index === 0 && (
                                  <div className="hidden rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600 sm:block">
                                    Starting Point
                                  </div>
                                )}

                              </div>

                              {attraction.description && (
                                <p className="mt-4 max-w-3xl leading-7 text-gray-700">
                                  {attraction.description}
                                </p>
                              )}

                              <div className="mt-5 flex flex-wrap gap-3">

                                {hasCoordinates && (
                                  <div className="flex items-center gap-2 rounded-xl border border-white/70 bg-white/50 px-3 py-2 text-sm font-semibold text-gray-600">
                                    <MapPin
                                      size={16}
                                      className="text-[#f97316]"
                                    />

                                    {Number(
                                      attraction.latitude
                                    ).toFixed(4)}
                                    ,{" "}
                                    {Number(
                                      attraction.longitude
                                    ).toFixed(4)}
                                  </div>
                                )}

                                {attraction.entryFee && (
                                  <div className="flex items-center gap-2 rounded-xl border border-white/70 bg-white/50 px-3 py-2 text-sm font-semibold text-gray-600">
                                    <Wallet
                                      size={16}
                                      className="text-[#f97316]"
                                    />

                                    {attraction.entryFee}
                                  </div>
                                )}

                              </div>

                              {attraction.location && (
                                <p className="mt-4 text-sm text-gray-600">
                                  📍 {attraction.location}
                                </p>
                              )}

                            </div>

                            {/* GOOGLE MAP BUTTON */}

                            {googleMapsUrl && (
                              <div className="mt-6">
                                <a
                                  href={googleMapsUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 rounded-xl bg-[#172554] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#1e3a8a] hover:shadow-lg"
                                >
                                  <MapPin size={17} />

                                  Open in Google Maps

                                  <ExternalLink size={15} />
                                </a>
                              </div>
                            )}

                          </div>
                        </div>
                      </article>
                    </div>
                  );
                }
              )}

            </div>
          </div>

          {/* ==================================================
              BOTTOM CTA
              COLORFUL LIGHT CARD
          ================================================== */}

          <div className="mb-10 overflow-hidden rounded-[2rem] border border-orange-200/70 bg-gradient-to-r from-[#fff1d6] via-[#ffe4c7] to-[#ffd6c9] p-8 shadow-2xl md:p-10">

            <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">

              <div>

                <div className="mb-2 flex items-center justify-center gap-2 md:justify-start">
                  <Sparkles
                    size={18}
                    className="text-[#f97316]"
                  />

                  <span className="text-sm font-bold uppercase tracking-widest text-[#ea580c]">
                    TravelMate
                  </span>
                </div>

                <h2 className="text-2xl font-black text-[#172554] md:text-3xl">
                  Ready to explore {destination.name}?
                </h2>

                <p className="mt-2 max-w-xl text-sm text-gray-600">
                  Your route is planned. Now all that's left
                  is to enjoy the journey.
                </p>
              </div>

              <button
                onClick={() =>
                  navigate(`/destinations/${id}`)
                }
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#f97316] px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#ea580c] hover:shadow-xl"
              >
                <ArrowLeft size={17} />

                Back to Destination
              </button>

            </div>
          </div>

        </div>
      </section>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <Footer />
    </main>
  );
}

export default TourPlan;