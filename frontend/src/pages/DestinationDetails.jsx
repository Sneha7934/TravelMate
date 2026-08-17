import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  MapPin,
  CalendarDays,
  Wallet,
  Heart,
  Star,
  Route,
} from "lucide-react";

import travelBg from "../assets/images/login-bg.png";
import api from "../api/api";

import Header from "./Header";
import Footer from "./Footer";

function DestinationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ==========================================
  // DESTINATION
  // ==========================================

  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // ATTRACTIONS
  // ==========================================

  const [attractions, setAttractions] = useState([]);
  const [attractionsLoading, setAttractionsLoading] = useState(true);

  // ==========================================
  // FAVORITES
  // ==========================================

  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  // ==========================================
  // REVIEWS
  // ==========================================

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [hasReviewed, setHasReviewed] = useState(false);

  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // ==========================================
  // EDIT REVIEW
  // ==========================================

  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);

  // ==========================================
  // GET DESTINATION
  // ==========================================

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/destinations/${id}`);

        setDestination(response.data);
      } catch (error) {
        console.error("Error loading destination:", error);

        setError("Unable to load destination.");
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [id]);

  // ==========================================
  // GET ATTRACTIONS
  // ==========================================

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        setAttractionsLoading(true);

        const response = await api.get(
          `/attractions/destination/${id}`
        );

        setAttractions(response.data);
      } catch (error) {
        console.error("Error loading attractions:", error);
      } finally {
        setAttractionsLoading(false);
      }
    };

    fetchAttractions();
  }, [id]);

  // ==========================================
  // GET REVIEWS
  // ==========================================

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);

        const response = await api.get(
          `/reviews/destination/${id}`
        );

        const fetchedReviews = response.data;

        setReviews(fetchedReviews);

        const storedUser = localStorage.getItem("user");

        if (storedUser) {
          const currentUser = JSON.parse(storedUser);

          const alreadyReviewed = fetchedReviews.some(
            (review) => review.user?.id === currentUser.id
          );

          setHasReviewed(alreadyReviewed);
        } else {
          setHasReviewed(false);
        }
      } catch (error) {
        console.error("Error loading reviews:", error);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  // ==========================================
  // GET REVIEW SUMMARY
  // ==========================================

  useEffect(() => {
    const fetchReviewSummary = async () => {
      try {
        const response = await api.get(
          `/reviews/destination/${id}/summary`
        );

        setAverageRating(
          response.data.averageRating || 0
        );

        setReviewCount(
          response.data.reviewCount || 0
        );
      } catch (error) {
        console.error(
          "Error loading review summary:",
          error
        );
      }
    };

    fetchReviewSummary();
  }, [id]);

  // ==========================================
  // RESOLVE DESTINATION ID
  // ==========================================

  const resolveDestinationId = () => {
    if (!destination) {
      return null;
    }

    const candidate =
      destination.id ??
      destination.destinationId ??
      destination.destination?.id ??
      Number(id);

    return Number.isFinite(Number(candidate))
      ? Number(candidate)
      : null;
  };

  // ==========================================
  // CHECK FAVORITE
  // ==========================================

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const storedUser =
          localStorage.getItem("user");

        if (!storedUser) {
          return;
        }

        const user = JSON.parse(storedUser);

        if (!user || !user.id) {
          return;
        }

        const response = await api.get(
          `/favorites/user/${user.id}`
        );

        const favorites = response.data;

        const alreadyFavorite = favorites.some(
          (favorite) => {
            const favoriteDestinationId =
              favorite.destination?.id ??
              favorite.destinationId ??
              favorite.destination?.destinationId;

            return (
              Number(favoriteDestinationId) ===
              Number(id)
            );
          }
        );

        setIsFavorite(alreadyFavorite);
      } catch (error) {
        console.error(
          "Error checking favorite:",
          error
        );
      }
    };

    checkFavorite();
  }, [id]);

  // ==========================================
  // ADD / REMOVE FAVORITE
  // ==========================================

  const handleFavorite = async () => {
    try {
      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        alert("Please login to add favorites.");
        navigate("/");
        return;
      }

      const user = JSON.parse(storedUser);

      if (!user || !user.id) {
        alert("Unable to identify your account.");
        return;
      }

      const targetDestinationId =
        resolveDestinationId();

      if (!targetDestinationId) {
        alert(
          "Destination information is still loading. Please try again."
        );
        return;
      }

      setFavoriteLoading(true);

      // REMOVE FAVORITE
      if (isFavorite) {
        try {
          await api.delete(
            `/favorites/user/${user.id}/destination/${targetDestinationId}`
          );

          setIsFavorite(false);

          alert("Removed from favorites.");
        } catch (error) {
          if (error.response?.status === 404) {
            setIsFavorite(false);

            alert(
              "This destination was already removed from your favorites."
            );
          } else {
            throw error;
          }
        }
      }

      // ADD FAVORITE
      else {
        await api.post(
          `/favorites/user/${user.id}/destination/${targetDestinationId}`
        );

        setIsFavorite(true);

        alert("Added to favorites.");
      }
    } catch (error) {
      console.error("Favorite error:", error);

      alert(
        "Something went wrong while updating favorites."
      );
    } finally {
      setFavoriteLoading(false);
    }
  };

  // ==========================================
  // SUBMIT REVIEW
  // ==========================================

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) {
      alert("Please login to write a review.");
      navigate("/");
      return;
    }

    const user = JSON.parse(storedUser);

    if (!user || !user.id) {
      alert("Unable to identify your account.");
      return;
    }

    if (rating < 1 || rating > 5) {
      alert("Please select a rating.");
      return;
    }

    if (!comment.trim()) {
      alert("Please write a comment.");
      return;
    }

    try {
      setReviewSubmitting(true);

      const response = await api.post(
        `/reviews/user/${user.id}/destination/${destination.id}`,
        {
          rating,
          comment: comment.trim(),
        }
      );

      setReviews((currentReviews) => [
        ...currentReviews,
        response.data,
      ]);

      setHasReviewed(true);

      const summaryResponse = await api.get(
        `/reviews/destination/${destination.id}/summary`
      );

      setAverageRating(
        summaryResponse.data.averageRating || 0
      );

      setReviewCount(
        summaryResponse.data.reviewCount || 0
      );

      setRating(0);
      setComment("");

      alert("Review submitted successfully.");
    } catch (error) {
      console.error(
        "Error submitting review:",
        error
      );

      alert(
        error.response?.data ||
          "Unable to submit review."
      );
    } finally {
      setReviewSubmitting(false);
    }
  };

  // ==========================================
  // DELETE REVIEW
  // ==========================================

  const handleDeleteReview = async (reviewId) => {
    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) {
      alert("Please login first.");
      navigate("/");
      return;
    }

    const user = JSON.parse(storedUser);

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(
        `/reviews/${reviewId}/user/${user.id}`
      );

      setReviews((currentReviews) =>
        currentReviews.filter(
          (review) => review.id !== reviewId
        )
      );

      setHasReviewed(false);

      const summaryResponse = await api.get(
        `/reviews/destination/${destination.id}/summary`
      );

      setAverageRating(
        summaryResponse.data.averageRating || 0
      );

      setReviewCount(
        summaryResponse.data.reviewCount || 0
      );
    } catch (error) {
      console.error(
        "Error deleting review:",
        error
      );

      alert(
        error.response?.data ||
          "Unable to delete review."
      );
    }
  };

  // ==========================================
  // EDIT REVIEW
  // ==========================================

  const handleEditReview = async (reviewId) => {
    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) {
      alert("Please login first.");
      navigate("/");
      return;
    }

    const user = JSON.parse(storedUser);

    if (editRating < 1 || editRating > 5) {
      alert("Please select a rating.");
      return;
    }

    if (!editComment.trim()) {
      alert("Please write a review.");
      return;
    }

    try {
      setEditSubmitting(true);

      const response = await api.put(
        `/reviews/${reviewId}/user/${user.id}`,
        {
          rating: editRating,
          comment: editComment.trim(),
        }
      );

      setReviews((currentReviews) =>
        currentReviews.map((review) =>
          review.id === reviewId
            ? response.data
            : review
        )
      );

      setEditingReviewId(null);
      setEditRating(0);
      setEditComment("");

      const summaryResponse = await api.get(
        `/reviews/destination/${destination.id}/summary`
      );

      setAverageRating(
        summaryResponse.data.averageRating || 0
      );

      setReviewCount(
        summaryResponse.data.reviewCount || 0
      );
    } catch (error) {
      console.error(
        "Error updating review:",
        error
      );

      alert(
        error.response?.data ||
          "Unable to update review."
      );
    } finally {
      setEditSubmitting(false);
    }
  };

  // ==========================================
  // START EDITING
  // ==========================================

  const startEditingReview = (review) => {
    setEditingReviewId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  // ==========================================
  // CANCEL EDITING
  // ==========================================

  const cancelEditingReview = () => {
    setEditingReviewId(null);
    setEditRating(0);
    setEditComment("");
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#eaf1ff]">
        <p className="text-lg font-semibold text-[#172554]">
          Loading destination...
        </p>
      </main>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !destination) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#eaf1ff] px-6">
        <p className="mb-5 text-center text-red-500">
          {error || "Destination not found."}
        </p>

        <button
          type="button"
          onClick={() => navigate("/home")}
          className="
            rounded-xl
            bg-[#172554]
            px-5
            py-3
            font-semibold
            text-white
            transition
            duration-300
            hover:-translate-y-0.5
            hover:bg-[#1e3a8a]
          "
        >
          Back to Home
        </button>
      </main>
    );
  }

  // ==========================================
  // MAIN PAGE
  // ==========================================

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#eaf1ff]
      "
      style={{
        backgroundImage: `
          linear-gradient(
            rgba(219,234,254,0.70),
            rgba(237,233,254,0.62),
            rgba(255,237,213,0.68)
          ),
          url(${travelBg})
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* ======================================
          SOFT BACKGROUND FILTER
      ====================================== */}

      <div
        className="
          pointer-events-none
          fixed
          inset-0
          z-0
          bg-white/10
          backdrop-blur-[3px]
        "
      />

      {/* ======================================
          SOFT LIGHT EFFECTS
      ====================================== */}

      <div
        className="
          pointer-events-none
          fixed
          -left-32
          top-32
          z-0
          h-80
          w-80
          rounded-full
          bg-blue-400/15
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          fixed
          right-[-100px]
          top-[35%]
          z-0
          h-96
          w-96
          rounded-full
          bg-orange-400/15
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          fixed
          bottom-[-120px]
          left-[35%]
          z-0
          h-96
          w-96
          rounded-full
          bg-purple-400/10
          blur-3xl
        "
      />

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="relative z-50">
        <Header />
      </div>

      {/* ======================================
          PAGE CONTENT
      ====================================== */}

      <div className="relative z-10">

        <section
          className="
            mx-auto
            max-w-6xl
            px-5
            py-10
            md:px-10
            md:py-14
          "
        >

          {/* ==================================
              DESTINATION IMAGE
          ================================== */}

          <div
            className="
              group
              relative
              h-[300px]
              overflow-hidden
              rounded-[30px]
              border
              border-white/50
              bg-white/20
              shadow-[0_25px_70px_rgba(23,37,84,0.20)]
              backdrop-blur-xl
              md:h-[450px]
            "
          >
            <img
              src={
                destination.imageUrl
                  ? (
                      destination.imageUrl.startsWith("/")
                        ? destination.imageUrl
                        : `/${destination.imageUrl}`
                    )
                  : "/default-destination.jpg"
              }
              alt={destination.name}
              className="
                h-full
                w-full
                object-cover
                transition
                duration-700
                group-hover:scale-[1.02]
              "
              onError={(e) => {
                e.currentTarget.src =
                  "/default-destination.jpg";
              }}
            />

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-gradient-to-t
                from-[#172554]/35
                via-transparent
                to-white/10
              "
            />
          </div>

          {/* ==================================
              DESTINATION GLASS CARD
          ================================== */}

          <div
            className="
              relative
              mt-8
              overflow-hidden
              rounded-[30px]
              border
              border-white/50
              bg-white/30
              p-6
              shadow-[0_25px_70px_rgba(23,37,84,0.18)]
              backdrop-blur-2xl
              md:p-10
            "
          >

            {/* CARD LIGHT EFFECTS */}

            <div
              className="
                pointer-events-none
                absolute
                -left-24
                -top-24
                h-72
                w-72
                rounded-full
                bg-blue-400/15
                blur-3xl
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                right-[-80px]
                top-[-50px]
                h-64
                w-64
                rounded-full
                bg-orange-400/15
                blur-3xl
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                bottom-[-100px]
                left-[40%]
                h-64
                w-64
                rounded-full
                bg-purple-400/10
                blur-3xl
              "
            />

            <div className="relative z-10">

              {/* ==================================
                  NAME + FAVORITE
              ================================== */}

              <div
                className="
                  flex
                  flex-col
                  gap-5
                  md:flex-row
                  md:items-start
                  md:justify-between
                "
              >
                <div>

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      text-sm
                      font-semibold
                      text-orange-600
                    "
                  >
                    <MapPin size={17} />

                    {destination.state}
                  </div>

                  <h1
                    className="
                      mt-2
                      text-4xl
                      font-bold
                      tracking-tight
                      text-[#172554]
                      md:text-5xl
                    "
                  >
                    {destination.name}
                  </h1>

                </div>

                {/* FAVORITE */}

                <button
                  type="button"
                  onClick={handleFavorite}
                  disabled={favoriteLoading}
                  className={`
                    flex
                    w-fit
                    items-center
                    gap-2
                    rounded-xl
                    border
                    px-5
                    py-3
                    font-semibold
                    shadow-sm
                    transition
                    duration-300

                    ${
                      isFavorite
                        ? `
                          border-red-500
                          bg-red-500
                          text-white
                          hover:bg-red-600
                        `
                        : `
                          border-white/60
                          bg-white/35
                          text-red-500
                          backdrop-blur-md
                          hover:bg-white/60
                        `
                    }

                    ${
                      favoriteLoading
                        ? "cursor-not-allowed opacity-60"
                        : "hover:-translate-y-0.5 hover:shadow-md"
                    }
                  `}
                >
                  <Heart
                    size={19}
                    fill={
                      isFavorite
                        ? "currentColor"
                        : "none"
                    }
                  />

                  {favoriteLoading
                    ? "Please wait..."
                    : isFavorite
                      ? "Remove from Favorites"
                      : "Add to Favorites"}
                </button>

              </div>

              {/* ==================================
                  DESCRIPTION
              ================================== */}

              <div className="mt-8">

                <h2
                  className="
                    text-2xl
                    font-bold
                    text-[#172554]
                  "
                >
                  About {destination.name}
                </h2>

                <p
                  className="
                    mt-3
                    max-w-4xl
                    leading-7
                    text-gray-700
                  "
                >
                  {destination.description}
                </p>

              </div>

              {/* ==================================
                  INFORMATION CARDS
              ================================== */}

              <div
                className="
                  mt-8
                  grid
                  grid-cols-1
                  gap-4
                  md:grid-cols-3
                "
              >

                {/* BUDGET */}

                <div
                  className="
                    group
                    rounded-2xl
                    border
                    border-white/50
                    bg-white/30
                    p-5
                    shadow-[0_10px_30px_rgba(23,37,84,0.08)]
                    backdrop-blur-xl
                    transition
                    duration-300
                    hover:-translate-y-1
                    hover:bg-white/45
                    hover:shadow-lg
                  "
                >
                  <Wallet
                    className="text-orange-500"
                    size={24}
                  />

                  <p className="mt-3 text-sm text-gray-500">
                    Estimated Budget
                  </p>

                  <p className="mt-1 font-bold text-[#172554]">
                    {destination.budget}
                  </p>
                </div>

                {/* BEST TIME */}

                <div
                  className="
                    group
                    rounded-2xl
                    border
                    border-white/50
                    bg-white/30
                    p-5
                    shadow-[0_10px_30px_rgba(23,37,84,0.08)]
                    backdrop-blur-xl
                    transition
                    duration-300
                    hover:-translate-y-1
                    hover:bg-white/45
                    hover:shadow-lg
                  "
                >
                  <CalendarDays
                    className="text-orange-500"
                    size={24}
                  />

                  <p className="mt-3 text-sm text-gray-500">
                    Best Time to Visit
                  </p>

                  <p className="mt-1 font-bold text-[#172554]">
                    {destination.bestTime}
                  </p>
                </div>

                {/* STATE */}

                <div
                  className="
                    group
                    rounded-2xl
                    border
                    border-white/50
                    bg-white/30
                    p-5
                    shadow-[0_10px_30px_rgba(23,37,84,0.08)]
                    backdrop-blur-xl
                    transition
                    duration-300
                    hover:-translate-y-1
                    hover:bg-white/45
                    hover:shadow-lg
                  "
                >
                  <MapPin
                    className="text-orange-500"
                    size={24}
                  />

                  <p className="mt-3 text-sm text-gray-500">
                    State
                  </p>

                  <p className="mt-1 font-bold text-[#172554]">
                    {destination.state}
                  </p>
                </div>

              </div>

              {/* ==================================
                  ATTRACTIONS
              ================================== */}

              <div className="mt-14">

                <h2
                  className="
                    text-2xl
                    font-bold
                    text-[#172554]
                  "
                >
                  Attractions
                </h2>

                <p className="mt-2 text-gray-600">
                  Explore popular attractions in{" "}
                  {destination.name}.
                </p>

                {/* LOADING */}

                {attractionsLoading && (
                  <div
                    className="
                      mt-6
                      rounded-2xl
                      border
                      border-white/50
                      bg-white/30
                      p-6
                      text-center
                      shadow-sm
                      backdrop-blur-xl
                    "
                  >
                    <p className="text-gray-500">
                      Loading attractions...
                    </p>
                  </div>
                )}

                {/* NO ATTRACTIONS */}

                {!attractionsLoading &&
                  attractions.length === 0 && (
                    <div
                      className="
                        mt-6
                        rounded-2xl
                        border
                        border-white/50
                        bg-white/30
                        p-6
                        text-center
                        shadow-sm
                        backdrop-blur-xl
                      "
                    >
                      <p className="text-gray-500">
                        Attractions will be added soon.
                      </p>
                    </div>
                  )}

                {/* ATTRACTION CARDS */}

                {!attractionsLoading &&
                  attractions.length > 0 && (
                    <div
                      className="
                        mt-6
                        grid
                        grid-cols-1
                        gap-5
                        md:grid-cols-2
                        lg:grid-cols-3
                      "
                    >
                      {attractions.map(
                        (attraction) => (
                          <article
                            key={attraction.id}
                            onClick={() =>
                              navigate(
                                `/attractions/${attraction.id}`
                              )
                            }
                            className="
                              group
                              cursor-pointer
                              overflow-hidden
                              rounded-2xl
                              border
                              border-white/50
                              bg-white/30
                              shadow-[0_12px_35px_rgba(23,37,84,0.10)]
                              backdrop-blur-xl
                              transition
                              duration-300
                              hover:-translate-y-1
                              hover:bg-white/45
                              hover:shadow-xl
                            "
                          >

                            {/* IMAGE */}

                            <div
                              className="
                                h-48
                                overflow-hidden
                                bg-white/20
                              "
                            >
                              <img
                                src={
                                  attraction.imageUrl
                                    ? (
                                        attraction.imageUrl.startsWith("/")
                                          ? attraction.imageUrl
                                          : `/${attraction.imageUrl}`
                                      )
                                    : "/default-attraction.jpg"
                                }
                                alt={attraction.name}
                                className="
                                  h-full
                                  w-full
                                  object-cover
                                  transition
                                  duration-500
                                  group-hover:scale-105
                                "
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "/default-attraction.jpg";
                                }}
                              />
                            </div>

                            {/* CONTENT */}

                            <div className="p-5">

                              <h3
                                className="
                                  text-xl
                                  font-bold
                                  text-[#172554]
                                "
                              >
                                {attraction.name}
                              </h3>

                              <p
                                className="
                                  mt-2
                                  line-clamp-2
                                  text-sm
                                  leading-6
                                  text-gray-600
                                "
                              >
                                {attraction.description}
                              </p>

                              <p
                                className="
                                  mt-4
                                  text-sm
                                  font-semibold
                                  text-orange-600
                                "
                              >
                                View attraction details →
                              </p>

                            </div>

                          </article>
                        )
                      )}
                    </div>
                  )}

              </div>

              {/* ==================================
                  TOUR PLAN
              ================================== */}

              <div className="mt-8">

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/destinations/${destination.id}/tour-plan`
                    )
                  }
                  className="
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    bg-gradient-to-r
                    from-[#172554]
                    via-[#3730a3]
                    to-[#f97316]
                    px-6
                    py-4
                    text-base
                    font-semibold
                    text-white
                    shadow-[0_10px_30px_rgba(23,37,84,0.20)]
                    transition
                    duration-300
                    hover:-translate-y-0.5
                    hover:shadow-xl
                    active:scale-[0.98]
                    md:w-fit
                  "
                >
                  <Route size={20} />

                  View Your Tour Plan
                </button>

              </div>

              {/* ==================================
                  REVIEWS
              ================================== */}

              <section className="mt-14">

                {/* REVIEW HEADER */}

                <div className="mb-6">

                  <h2
                    className="
                      text-3xl
                      font-bold
                      text-[#172554]
                    "
                  >
                    Traveler Reviews
                  </h2>

                  <p className="mt-2 text-gray-600">
                    See what other travelers think
                    about this destination.
                  </p>

                </div>

                {/* ==================================
                    WRITE REVIEW
                ================================== */}

                {hasReviewed ? (
                  <div
                    className="
                      mb-8
                      rounded-3xl
                      border
                      border-white/50
                      bg-white/30
                      p-6
                      text-center
                      shadow-[0_15px_45px_rgba(23,37,84,0.10)]
                      backdrop-blur-xl
                    "
                  >

                    <Star
                      size={30}
                      fill="currentColor"
                      className="
                        mx-auto
                        text-yellow-400
                      "
                    />

                    <h3
                      className="
                        mt-3
                        text-xl
                        font-bold
                        text-[#172554]
                      "
                    >
                      You've already reviewed
                      this destination
                    </h3>

                    <p className="mt-2 text-gray-500">
                      You can only submit one
                      review for each destination.
                    </p>

                  </div>
                ) : (
                  <div
                    className="
                      mb-8
                      rounded-3xl
                      border
                      border-white/50
                      bg-white/30
                      p-6
                      shadow-[0_15px_45px_rgba(23,37,84,0.10)]
                      backdrop-blur-xl
                      md:p-8
                    "
                  >

                    <h3
                      className="
                        text-xl
                        font-bold
                        text-[#172554]
                      "
                    >
                      Write Your Review
                    </h3>

                    {/* RATING */}

                    <div className="mt-5">

                      <p
                        className="
                          mb-2
                          text-sm
                          font-semibold
                          text-gray-700
                        "
                      >
                        Your Rating
                      </p>

                      <div className="flex gap-2">

                        {[1, 2, 3, 4, 5].map(
                          (star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() =>
                                setRating(star)
                              }
                              aria-label={`Rate ${star} out of 5 stars`}
                              className="
                                transition
                                hover:scale-110
                              "
                            >
                              <Star
                                size={28}
                                fill={
                                  star <= rating
                                    ? "currentColor"
                                    : "none"
                                }
                                className={
                                  star <= rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }
                              />
                            </button>
                          )
                        )}

                      </div>

                    </div>

                    {/* COMMENT */}

                    <form
                      onSubmit={handleSubmitReview}
                      className="mt-5"
                    >

                      <label
                        htmlFor="review-comment"
                        className="
                          text-sm
                          font-semibold
                          text-gray-700
                        "
                      >
                        Your Review
                      </label>

                      <textarea
                        id="review-comment"
                        value={comment}
                        onChange={(e) =>
                          setComment(
                            e.target.value
                          )
                        }
                        placeholder="Tell other travelers about your experience..."
                        maxLength={1000}
                        rows={5}
                        className="
                          mt-2
                          w-full
                          resize-none
                          rounded-2xl
                          border
                          border-white/60
                          bg-white/30
                          p-4
                          text-gray-700
                          outline-none
                          backdrop-blur-md
                          placeholder:text-gray-400
                          transition
                          focus:border-[#172554]/30
                          focus:bg-white/50
                          focus:ring-2
                          focus:ring-[#172554]/10
                        "
                      />

                      <div
                        className="
                          mt-4
                          flex
                          items-center
                          justify-between
                          gap-4
                        "
                      >

                        <span className="text-xs text-gray-400">
                          {comment.length}/1000
                        </span>

                        <button
                          type="submit"
                          disabled={reviewSubmitting}
                          className="
                            rounded-xl
                            bg-gradient-to-r
                            from-[#172554]
                            to-[#3730a3]
                            px-6
                            py-3
                            font-semibold
                            text-white
                            shadow-md
                            transition
                            hover:-translate-y-0.5
                            hover:shadow-lg
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                          "
                        >
                          {reviewSubmitting
                            ? "Submitting..."
                            : "Submit Review"}
                        </button>

                      </div>

                    </form>

                  </div>
                )}

                {/* ==================================
                    AVERAGE RATING
                ================================== */}

                <div
                  className="
                    mb-6
                    rounded-3xl
                    border
                    border-white/50
                    bg-white/30
                    p-6
                    shadow-md
                    backdrop-blur-xl
                  "
                >

                  <div className="flex items-center gap-3">

                    <div
                      className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-full
                        bg-yellow-400/15
                      "
                    >
                      <Star
                        size={30}
                        fill="currentColor"
                        className="text-yellow-400"
                      />
                    </div>

                    <div>

                      <p
                        className="
                          text-2xl
                          font-bold
                          text-[#172554]
                        "
                      >
                        {averageRating.toFixed(1)} / 5
                      </p>

                      <p className="text-sm text-gray-500">
                        Based on {reviewCount}{" "}
                        {reviewCount === 1
                          ? "review"
                          : "reviews"}
                      </p>

                    </div>

                  </div>

                </div>

                {/* ==================================
                    REVIEWS LIST
                ================================== */}

                {reviewsLoading ? (
                  <div
                    className="
                      rounded-3xl
                      border
                      border-white/50
                      bg-white/30
                      p-8
                      text-center
                      backdrop-blur-xl
                    "
                  >
                    <p className="text-gray-500">
                      Loading reviews...
                    </p>
                  </div>
                ) : reviews.length === 0 ? (
                  <div
                    className="
                      rounded-3xl
                      border
                      border-white/50
                      bg-white/30
                      p-8
                      text-center
                      backdrop-blur-xl
                    "
                  >

                    <p className="text-gray-500">
                      No reviews yet.
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      Be the first traveler to
                      review this destination!
                    </p>

                  </div>
                ) : (
                  <div className="space-y-5">

                    {reviews.map((review) => (
                      <article
                        key={review.id}
                        className="
                          rounded-3xl
                          border
                          border-white/50
                          bg-white/30
                          p-6
                          shadow-md
                          backdrop-blur-xl
                          transition
                          duration-300
                          hover:bg-white/45
                          hover:shadow-lg
                        "
                      >

                        {/* REVIEW HEADER */}

                        <div
                          className="
                            flex
                            items-start
                            justify-between
                            gap-4
                          "
                        >

                          <div>

                            <h4
                              className="
                                font-bold
                                text-[#172554]
                              "
                            >
                              {review.user?.name ||
                                "Traveler"}
                            </h4>

                            {/* STARS */}

                            <div
                              className="
                                mt-1
                                flex
                                gap-1
                              "
                              aria-label={`${review.rating} out of 5 stars`}
                            >
                              {[1, 2, 3, 4, 5].map(
                                (star) => (
                                  <Star
                                    key={star}
                                    size={18}
                                    fill={
                                      star <=
                                      review.rating
                                        ? "currentColor"
                                        : "none"
                                    }
                                    className={
                                      star <=
                                      review.rating
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                    }
                                  />
                                )
                              )}
                            </div>

                          </div>

                          {/* EDIT / DELETE */}

                          {(() => {
                            const storedUser =
                              localStorage.getItem(
                                "user"
                              );

                            if (!storedUser) {
                              return null;
                            }

                            const currentUser =
                              JSON.parse(
                                storedUser
                              );

                            if (
                              currentUser?.id !==
                              review.user?.id
                            ) {
                              return null;
                            }

                            return (
                              <div className="flex gap-2">

                                <button
                                  type="button"
                                  onClick={() =>
                                    startEditingReview(
                                      review
                                    )
                                  }
                                  className="
                                    rounded-lg
                                    px-3
                                    py-1
                                    text-sm
                                    font-semibold
                                    text-blue-600
                                    transition
                                    hover:bg-blue-50
                                  "
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteReview(
                                      review.id
                                    )
                                  }
                                  className="
                                    rounded-lg
                                    px-3
                                    py-1
                                    text-sm
                                    font-semibold
                                    text-red-500
                                    transition
                                    hover:bg-red-50
                                  "
                                >
                                  Delete
                                </button>

                              </div>
                            );
                          })()}

                        </div>

                        {/* ==================================
                            EDIT MODE
                        ================================== */}

                        {editingReviewId ===
                        review.id ? (
                          <div className="mt-4">

                            {/* EDIT RATING */}

                            <div className="flex gap-2">

                              {[1, 2, 3, 4, 5].map(
                                (star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() =>
                                      setEditRating(
                                        star
                                      )
                                    }
                                    aria-label={`Rate ${star} out of 5 stars`}
                                    className="
                                      transition
                                      hover:scale-110
                                    "
                                  >
                                    <Star
                                      size={26}
                                      fill={
                                        star <=
                                        editRating
                                          ? "currentColor"
                                          : "none"
                                      }
                                      className={
                                        star <=
                                        editRating
                                          ? "text-yellow-400"
                                          : "text-gray-300"
                                      }
                                    />
                                  </button>
                                )
                              )}

                            </div>

                            {/* EDIT COMMENT */}

                            <textarea
                              value={editComment}
                              onChange={(e) =>
                                setEditComment(
                                  e.target.value
                                )
                              }
                              maxLength={1000}
                              rows={4}
                              className="
                                mt-4
                                w-full
                                resize-none
                                rounded-2xl
                                border
                                border-white/60
                                bg-white/30
                                p-4
                                text-gray-700
                                outline-none
                                backdrop-blur-md
                                transition
                                focus:border-[#172554]/30
                                focus:bg-white/50
                                focus:ring-2
                                focus:ring-[#172554]/10
                              "
                            />

                            {/* EDIT BUTTONS */}

                            <div className="mt-4 flex gap-3">

                              <button
                                type="button"
                                onClick={() =>
                                  handleEditReview(
                                    review.id
                                  )
                                }
                                disabled={
                                  editSubmitting
                                }
                                className="
                                  rounded-xl
                                  bg-[#172554]
                                  px-5
                                  py-2
                                  font-semibold
                                  text-white
                                  transition
                                  hover:bg-[#1e3a8a]
                                  disabled:cursor-not-allowed
                                  disabled:opacity-60
                                "
                              >
                                {editSubmitting
                                  ? "Saving..."
                                  : "Save Changes"}
                              </button>

                              <button
                                type="button"
                                onClick={
                                  cancelEditingReview
                                }
                                disabled={
                                  editSubmitting
                                }
                                className="
                                  rounded-xl
                                  border
                                  border-white/60
                                  bg-white/35
                                  px-5
                                  py-2
                                  font-semibold
                                  text-gray-700
                                  backdrop-blur-md
                                  transition
                                  hover:bg-white/60
                                  disabled:cursor-not-allowed
                                  disabled:opacity-60
                                "
                              >
                                Cancel
                              </button>

                            </div>

                          </div>
                        ) : (
                          /* ==================================
                             NORMAL REVIEW
                          ================================== */

                          <p
                            className="
                              mt-4
                              leading-7
                              text-gray-600
                            "
                          >
                            {review.comment}
                          </p>
                        )}

                      </article>
                    ))}

                  </div>
                )}

              </section>

            </div>

          </div>

        </section>

      </div>

      {/* ======================================
          FOOTER
      ====================================== */}

      <div className="relative z-10">
        <Footer />
      </div>

    </main>
  );
}

export default DestinationDetails;