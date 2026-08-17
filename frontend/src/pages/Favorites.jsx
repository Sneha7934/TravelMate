import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Heart,
  Trash2,
  MapPin,
  Bookmark,
} from "lucide-react";

import api from "../api/api";
import natureBg from "../assets/images/login-bg.png";
import Footer from "./Footer";
import Header from "./Header";

function Favorites() {
  const navigate = useNavigate();

  // ==========================================
  // FAVORITES STATE
  // ==========================================

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD USER FAVORITES
  // ==========================================

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);

        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          navigate("/");
          return;
        }

        const user = JSON.parse(storedUser);

        if (!user?.id) {
          navigate("/");
          return;
        }

        const response = await api.get(
          `/favorites/user/${user.id}`
        );

        setFavorites(
          Array.isArray(response.data)
            ? response.data
            : []
        );
      } catch (error) {
        console.error(
          "Error loading favorites:",
          error
        );

        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [navigate]);

  // ==========================================
  // REMOVE FAVORITE
  // ==========================================

  const removeFavorite = async (destinationId) => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        navigate("/");
        return;
      }

      const user = JSON.parse(storedUser);

      if (!user?.id) {
        navigate("/");
        return;
      }

      await api.delete(
        `/favorites/user/${user.id}/destination/${destinationId}`
      );

      setFavorites((currentFavorites) =>
        currentFavorites.filter((favorite) => {
          const favoriteDestinationId =
            favorite.destination?.id ??
            favorite.destinationId ??
            favorite.destination?.destinationId;

          return (
            Number(favoriteDestinationId) !==
            Number(destinationId)
          );
        })
      );
    } catch (error) {
      console.error(
        "Error removing favorite:",
        error
      );

      alert("Unable to remove favorite.");
    }
  };

  // ==========================================
  // IMAGE URL HELPER
  // ==========================================

  const getImageUrl = (imageUrl, fallback) => {
    if (!imageUrl) {
      return fallback;
    }

    return imageUrl.startsWith("/")
      ? imageUrl
      : `/${imageUrl}`;
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-gradient-to-br
          from-purple-100
          via-blue-50
          to-indigo-100
        "
      >
        <div
          className="
            rounded-3xl
            border
            border-white/70
            bg-white/60
            px-10
            py-7
            text-center
            shadow-[0_20px_60px_rgba(79,70,229,0.15)]
            backdrop-blur-2xl
          "
        >
          <div
            className="
              mx-auto
              mb-4
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              bg-purple-100/80
            "
          >
            <Heart
              size={23}
              className="text-purple-600"
            />
          </div>

          <p
            className="
              font-semibold
              text-[#172554]
            "
          >
            Loading your favorites...
          </p>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Please wait a moment.
          </p>
        </div>
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
        bg-[#f3efff]
      "
    >

      {/* ==========================================
          BACKGROUND IMAGE
      ========================================== */}

      <div
        className="
          fixed
          inset-0
          z-0
          bg-cover
          bg-center
          bg-no-repeat
        "
        style={{
          backgroundImage: `url(${natureBg})`,
          backgroundAttachment: "fixed",
        }}
      />

      {/* ==========================================
          PURPLE + BLUE GLASS OVERLAY
      ========================================== */}

      <div
        className="
          pointer-events-none
          fixed
          inset-0
          z-0
          bg-gradient-to-br
          from-purple-200/70
          via-blue-100/50
          to-indigo-200/65
          backdrop-blur-[3px]
        "
      />

      {/* ==========================================
          ATMOSPHERIC PURPLE GLOW
      ========================================== */}

      <div
        className="
          pointer-events-none
          fixed
          -left-40
          top-20
          z-0
          h-[30rem]
          w-[30rem]
          rounded-full
          bg-purple-400/20
          blur-3xl
        "
      />

      {/* ==========================================
          ATMOSPHERIC BLUE GLOW
      ========================================== */}

      <div
        className="
          pointer-events-none
          fixed
          -right-40
          top-40
          z-0
          h-[32rem]
          w-[32rem]
          rounded-full
          bg-blue-400/20
          blur-3xl
        "
      />

      {/* ==========================================
          BOTTOM INDIGO GLOW
      ========================================== */}

      <div
        className="
          pointer-events-none
          fixed
          -bottom-40
          left-1/3
          z-0
          h-[30rem]
          w-[30rem]
          rounded-full
          bg-indigo-400/15
          blur-3xl
        "
      />

      {/* ==========================================
          SHARED HEADER
      ========================================== */}

      <Header />

      {/* ==========================================
          PAGE CONTENT
      ========================================== */}

      <section
        className="
          relative
          z-10
          mx-auto
          max-w-7xl
          px-5
          py-8
          md:px-8
          md:py-12
          lg:px-10
        "
      >

        {/* ==========================================
            MAIN GLASS CONTAINER
        ========================================== */}

        <div
          className="
            relative
            overflow-hidden
            rounded-[2rem]
            border
            border-white/75
            bg-gradient-to-br
            from-purple-100/60
            via-white/40
            to-blue-100/60
            p-5
            shadow-[0_25px_80px_rgba(79,70,229,0.14)]
            backdrop-blur-2xl
            md:rounded-[2.5rem]
            md:p-8
            lg:p-10
          "
        >

          {/* Main purple glow */}

          <div
            className="
              pointer-events-none
              absolute
              -right-28
              -top-28
              h-80
              w-80
              rounded-full
              bg-purple-400/20
              blur-3xl
            "
          />

          {/* Main blue glow */}

          <div
            className="
              pointer-events-none
              absolute
              -bottom-32
              -left-28
              h-80
              w-80
              rounded-full
              bg-blue-400/20
              blur-3xl
            "
          />

          {/* Glass shine */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-br
              from-white/40
              via-transparent
              to-purple-100/20
            "
          />

          {/* ==========================================
              INNER CONTENT
          ========================================== */}

          <div className="relative z-10">

            {/* ======================================
                FAVORITES HEADER CARD
            ====================================== */}

            <div
              className="
                relative
                mb-8
                overflow-hidden
                rounded-[1.75rem]
                border
                border-white/80
                bg-gradient-to-r
                from-purple-100/65
                via-white/55
                to-blue-100/65
                p-5
                shadow-[0_15px_40px_rgba(79,70,229,0.10)]
                backdrop-blur-2xl
                md:p-7
              "
            >

              {/* Purple glow */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-16
                  -top-20
                  h-48
                  w-48
                  rounded-full
                  bg-purple-400/20
                  blur-3xl
                "
              />

              {/* Blue glow */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -bottom-20
                  -left-16
                  h-44
                  w-44
                  rounded-full
                  bg-blue-400/20
                  blur-3xl
                "
              />

              <div
                className="
                  relative
                  flex
                  flex-col
                  gap-5
                  md:flex-row
                  md:items-center
                  md:justify-between
                "
              >

                {/* ==================================
                    TITLE
                ================================== */}

                <div className="flex items-center gap-4">

                  <div
                    className="
                      flex
                      h-14
                      w-14
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      border-purple-200/70
                      bg-purple-100/70
                      shadow-sm
                      backdrop-blur-md
                      md:h-16
                      md:w-16
                    "
                  >
                    <Heart
                      size={30}
                      className="text-purple-600"
                      fill="currentColor"
                    />
                  </div>

                  <div>

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        text-sm
                        font-semibold
                        text-[#7c3aed]
                      "
                    >
                      <Bookmark size={15} />

                      Saved Places
                    </div>

                    <h1
                      className="
                        mt-1
                        text-3xl
                        font-bold
                        tracking-tight
                        text-[#172554]
                        md:text-4xl
                      "
                    >
                      My Favorites
                    </h1>

                    <p
                      className="
                        mt-1
                        text-sm
                        leading-6
                        text-gray-500
                        md:text-base
                      "
                    >
                      Your saved destinations, all in one place.
                    </p>

                  </div>

                </div>

                {/* ==================================
                    FAVORITE COUNT
                ================================== */}

                <div
                  className="
                    flex
                    w-fit
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-white/80
                    bg-white/55
                    px-4
                    py-3
                    shadow-sm
                    backdrop-blur-xl
                  "
                >

                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-blue-100/70
                    "
                  >
                    <Heart
                      size={19}
                      className="text-[#172554]"
                    />
                  </div>

                  <div>

                    <p
                      className="
                        text-xl
                        font-bold
                        leading-none
                        text-[#172554]
                      "
                    >
                      {favorites.length}
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        font-medium
                        text-gray-500
                      "
                    >
                      {favorites.length === 1
                        ? "Saved destination"
                        : "Saved destinations"}
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* ======================================
                NO FAVORITES
            ====================================== */}

            {favorites.length === 0 && (
              <div
                className="
                  relative
                  overflow-hidden
                  rounded-[2rem]
                  border
                  border-white/75
                  bg-gradient-to-br
                  from-purple-200/40
                  via-white/35
                  to-blue-200/40
                  px-6
                  py-16
                  text-center
                  shadow-[0_20px_60px_rgba(79,70,229,0.10)]
                  backdrop-blur-2xl
                  md:py-20
                "
              >

                {/* Purple glow */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    -left-20
                    -top-20
                    h-64
                    w-64
                    rounded-full
                    bg-purple-400/20
                    blur-3xl
                  "
                />

                {/* Blue glow */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    -bottom-20
                    -right-20
                    h-64
                    w-64
                    rounded-full
                    bg-blue-400/20
                    blur-3xl
                  "
                />

                <div className="relative z-10">

                  <div
                    className="
                      mx-auto
                      flex
                      h-20
                      w-20
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/80
                      bg-white/60
                      shadow-md
                      backdrop-blur-xl
                    "
                  >
                    <Heart
                      size={38}
                      className="text-purple-400/60"
                    />
                  </div>

                  <h2
                    className="
                      mt-6
                      text-2xl
                      font-bold
                      text-[#172554]
                      md:text-3xl
                    "
                  >
                    No favorites yet
                  </h2>

                  <p
                    className="
                      mx-auto
                      mt-2
                      max-w-md
                      leading-7
                      text-gray-500
                    "
                  >
                    Start exploring destinations and save
                    the places you'd love to visit.
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate("/home")}
                    className="
                      mt-7
                      rounded-xl
                      bg-[#172554]
                      px-7
                      py-3
                      font-semibold
                      text-white
                      shadow-lg
                      shadow-[#172554]/15
                      transition
                      duration-300
                      hover:-translate-y-0.5
                      hover:bg-[#1e3a8a]
                      hover:shadow-xl
                      active:scale-[0.98]
                    "
                  >
                    Explore Destinations
                  </button>

                </div>

              </div>
            )}

            {/* ======================================
                FAVORITE CARDS
            ====================================== */}

            {favorites.length > 0 && (
              <div
                className="
                  grid
                  grid-cols-1
                  gap-6
                  md:grid-cols-2
                  lg:grid-cols-3
                "
              >

                {favorites.map((favorite) => {

                  const destination =
                    favorite.destination;

                  if (!destination) {
                    return null;
                  }

                  return (
                    <article
                      key={favorite.id}
                      className="
                        group
                        relative
                        overflow-hidden
                        rounded-[1.75rem]
                        border
                        border-white/80
                        bg-gradient-to-br
                        from-purple-100/55
                        via-white/45
                        to-blue-100/60
                        shadow-[0_18px_50px_rgba(79,70,229,0.12)]
                        backdrop-blur-2xl
                        transition
                        duration-300
                        hover:-translate-y-2
                        hover:shadow-[0_28px_65px_rgba(79,70,229,0.18)]
                      "
                    >

                      {/* ==================================
                          CARD PURPLE GLOW
                      ================================== */}

                      <div
                        className="
                          pointer-events-none
                          absolute
                          -right-20
                          -top-20
                          z-10
                          h-40
                          w-40
                          rounded-full
                          bg-purple-400/15
                          blur-3xl
                        "
                      />

                      {/* ==================================
                          CARD BLUE GLOW
                      ================================== */}

                      <div
                        className="
                          pointer-events-none
                          absolute
                          -bottom-20
                          -left-20
                          z-10
                          h-40
                          w-40
                          rounded-full
                          bg-blue-400/15
                          blur-3xl
                        "
                      />

                      {/* ==================================
                          IMAGE
                      ================================== */}

                      <div
                        className="
                          relative
                          h-56
                          overflow-hidden
                          bg-gray-200
                        "
                      >

                        <img
                          src={getImageUrl(
                            destination.imageUrl,
                            "/default-destination.jpg"
                          )}
                          alt={destination.name}
                          className="
                            h-full
                            w-full
                            object-cover
                            transition
                            duration-700
                            group-hover:scale-105
                          "
                          onError={(e) => {
                            e.currentTarget.src =
                              "/default-destination.jpg";
                          }}
                        />

                        {/* Image gradient */}

                        <div
                          className="
                            pointer-events-none
                            absolute
                            inset-0
                            bg-gradient-to-t
                            from-[#172554]/65
                            via-transparent
                            to-purple-200/10
                          "
                        />

                        {/* Favorite badge */}

                        <div
                          className="
                            absolute
                            right-4
                            top-4
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-white/60
                            bg-white/75
                            text-red-500
                            shadow-lg
                            backdrop-blur-md
                          "
                        >
                          <Heart
                            size={18}
                            fill="currentColor"
                          />
                        </div>

                        {/* Destination name */}

                        <div
                          className="
                            absolute
                            bottom-4
                            left-5
                            right-5
                          "
                        >
                          <p
                            className="
                              text-xl
                              font-bold
                              text-white
                              drop-shadow-md
                            "
                          >
                            {destination.name}
                          </p>
                        </div>

                      </div>

                      {/* ==================================
                          CARD CONTENT
                      ================================== */}

                      <div
                        className="
                          relative
                          z-20
                          border-t
                          border-white/50
                          bg-gradient-to-br
                          from-purple-100/30
                          via-white/25
                          to-blue-100/35
                          p-5
                          backdrop-blur-xl
                        "
                      >

                        {/* STATE */}

                        {destination.state && (
                          <div
                            className="
                              flex
                              items-center
                              gap-2
                              text-sm
                              font-semibold
                              text-[#7c3aed]
                            "
                          >
                            <MapPin size={15} />

                            {destination.state}
                          </div>
                        )}

                        {/* DESCRIPTION */}

                        <p
                          className="
                            mt-3
                            line-clamp-3
                            text-sm
                            leading-6
                            text-gray-500
                          "
                        >
                          {destination.description ||
                            "Explore this beautiful destination and discover what makes it special."}
                        </p>

                        {/* BUTTONS */}

                        <div
                          className="
                            mt-5
                            flex
                            gap-3
                          "
                        >

                          {/* VIEW DESTINATION */}

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/destinations/${destination.id}`
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
                              shadow-md
                              shadow-[#172554]/10
                              transition
                              duration-300
                              hover:-translate-y-0.5
                              hover:bg-[#1e3a8a]
                              hover:shadow-lg
                              active:scale-[0.98]
                            "
                          >
                            View Destination
                          </button>

                          {/* REMOVE */}

                          <button
                            type="button"
                            onClick={() =>
                              removeFavorite(
                                destination.id
                              )
                            }
                            className="
                              flex
                              items-center
                              justify-center
                              rounded-xl
                              border
                              border-red-200
                              bg-red-50/70
                              px-4
                              text-red-500
                              shadow-sm
                              backdrop-blur-md
                              transition
                              duration-300
                              hover:-translate-y-0.5
                              hover:border-red-300
                              hover:bg-red-100
                              hover:shadow-md
                              active:scale-[0.98]
                            "
                            title="Remove favorite"
                            aria-label={`Remove ${destination.name} from favorites`}
                          >
                            <Trash2 size={18} />
                          </button>

                        </div>

                      </div>

                    </article>
                  );
                })}

              </div>
            )}

          </div>

        </div>

      </section>

      {/* ==========================================
          FOOTER
      ========================================== */}

      <div className="relative z-10">
        <Footer />
      </div>

    </main>
  );
}

export default Favorites;