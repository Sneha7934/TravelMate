import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  MessageSquare,
  Star,
  Trash2,
  RefreshCw,
  User,
  MapPin,
} from "lucide-react";

import api from "../api/api";
import travelmateLogo from "../assets/images/travelmate-logo.png";

function AdminReviews() {

  const navigate = useNavigate();

  // ==========================================
  // STATE
  // ==========================================

  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deletingId, setDeletingId] = useState(null);


  // ==========================================
  // GET LOGGED-IN ADMIN
  // ==========================================

  const getAdminUserId = () => {

    try {

      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        return null;
      }

      const user =
        JSON.parse(storedUser);

      return user?.id || null;

    } catch (error) {

      console.error(
        "Invalid user data:",
        error
      );

      return null;
    }
  };


  // ==========================================
  // LOAD REVIEWS
  // ==========================================

  const fetchReviews = async () => {

    try {

      setLoading(true);
      setError("");

      const userId =
        getAdminUserId();

      if (!userId) {

        setError(
          "Admin user information was not found. Please log in again."
        );

        return;
      }

      const response =
        await api.get("/reviews", {
          headers: {
            userId: userId,
          },
        });

      setReviews(
        response.data || []
      );

    } catch (error) {

      console.error(
        "Error loading reviews:",
        error
      );

      if (
        error.response?.status === 403
      ) {

        setError(
          "Access denied. Admin only."
        );

      } else {

        setError(
          "Unable to load reviews."
        );
      }

    } finally {

      setLoading(false);
    }
  };


  // ==========================================
  // LOAD ON PAGE OPEN
  // ==========================================

  useEffect(() => {

    fetchReviews();

  }, []);


  // ==========================================
  // DELETE REVIEW
  // ==========================================

  const handleDelete = async (review) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this review?"
      );

    if (!confirmed) {
      return;
    }


    const userId =
      getAdminUserId();


    if (!userId) {

      alert(
        "Admin user information was not found. Please log in again."
      );

      return;
    }


    try {

      setDeletingId(
        review.id
      );


      await api.delete(
        `/reviews/admin/${review.id}`,
        {
          headers: {
            userId: userId,
          },
        }
      );


      // Remove deleted review
      // immediately from UI

      setReviews((current) =>
        current.filter(
          (item) =>
            item.id !== review.id
        )
      );


      alert(
        "Review deleted successfully."
      );

    } catch (error) {

      console.error(
        "Error deleting review:",
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
          "Unable to delete review."
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

          <p
            className="
              mt-4
              text-gray-500
            "
          >
            Loading reviews...
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
            Manage Reviews
          </h1>


          <p
            className="
              mt-2
              text-gray-600
            "
          >
            View and manage reviews submitted
            by TravelMate users.
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

            <p
              className="
                font-semibold
              "
            >
              {error}
            </p>


            <button
              onClick={fetchReviews}
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

              <RefreshCw
                size={15}
              />

              Try Again

            </button>

          </div>
        )}


        {/* ====================================
            REVIEW COUNT
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
            Total Reviews
          </p>


          <p
            className="
              mt-1
              text-3xl
              font-bold
              text-[#172554]
            "
          >
            {reviews.length}
          </p>

        </div>


        {/* ====================================
            EMPTY STATE
        ==================================== */}

        {!error &&
          reviews.length === 0 && (

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

              <MessageSquare
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
                No reviews yet
              </h2>


              <p
                className="
                  mt-2
                  text-gray-500
                "
              >
                There are currently no reviews
                submitted by users.
              </p>

            </div>
          )}


        {/* ====================================
            REVIEWS GRID
        ==================================== */}

        {reviews.length > 0 && (

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

            {reviews.map(
              (review) => (

                <article
                  key={review.id}
                  className="
                    rounded-3xl
                    bg-white
                    p-6
                    shadow-md
                    transition
                    hover:-translate-y-1
                    hover:shadow-lg
                  "
                >

                  {/* ==================================
                      USER
                  ================================== */}

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <div
                      className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-full
                        bg-[#172554]
                        text-white
                      "
                    >

                      <User
                        size={20}
                      />

                    </div>


                    <div>

                      <p
                        className="
                          font-semibold
                          text-[#172554]
                        "
                      >
                        {review.user?.name ||
                          "Unknown User"}
                      </p>


                      <p
                        className="
                          text-xs
                          text-gray-500
                        "
                      >
                        {review.user?.email ||
                          "No email available"}
                      </p>

                    </div>

                  </div>


                  {/* ==================================
                      DESTINATION
                  ================================== */}

                  <div
                    className="
                      mt-5
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

                      {review.destination?.name ||
                        "Unknown Destination"}

                    </span>

                  </div>


                  {/* ==================================
                      RATING
                  ================================== */}

                  <div
                    className="
                      mt-5
                      flex
                      items-center
                      gap-1
                    "
                  >

                    {[
                      1,
                      2,
                      3,
                      4,
                      5,
                    ].map(
                      (star) => (

                        <Star
                          key={star}
                          size={18}
                          fill={
                            star <=
                            review.rating
                              ? "#f97316"
                              : "none"
                          }
                          className={
                            star <=
                            review.rating
                              ? "text-[#f97316]"
                              : "text-gray-300"
                          }
                        />

                      )
                    )}

                    <span
                      className="
                        ml-2
                        text-sm
                        font-semibold
                        text-gray-600
                      "
                    >
                      {review.rating}/5
                    </span>

                  </div>


                  {/* ==================================
                      COMMENT
                  ================================== */}

                  <div
                    className="
                      mt-5
                      rounded-2xl
                      bg-[#f6eadb]
                      p-4
                    "
                  >

                    <p
                      className="
                        text-sm
                        leading-6
                        text-gray-700
                      "
                    >
                      "{review.comment}"
                    </p>

                  </div>


                  {/* ==================================
                      DELETE
                  ================================== */}

                  <button
                    onClick={() =>
                      handleDelete(review)
                    }
                    disabled={
                      deletingId ===
                      review.id
                    }
                    className="
                      mt-5
                      flex
                      w-full
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
                    review.id
                      ? "Deleting..."
                      : "Delete Review"}

                  </button>

                </article>

              )
            )}

          </div>
        )}

      </section>

    </main>
  );
}

export default AdminReviews;

