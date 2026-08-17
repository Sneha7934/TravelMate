import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import travelmateLogo from "../assets/images/travelmate-logo.png";
import homeBg from "../assets/images/bg.png";

import {
  Search,
  MapPin,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import api from "../api/api";
import Footer from "./Footer";

const shuffleDestinations = (items) => {
  const shuffled = [...items];

  for (
    let index = shuffled.length - 1;
    index > 0;
    index -= 1
  ) {
    const randomIndex =
      Math.floor(Math.random() * (index + 1));

    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled;
};


function Home() {
  const navigate = useNavigate();


  // ==========================================
  // USER / LOGIN STATUS
  // ==========================================

  const getCurrentUser = () => {
    try {
      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        return null;
      }

      return JSON.parse(storedUser);

    } catch (error) {

      console.error(
        "Invalid user data in localStorage:",
        error
      );

      localStorage.removeItem("user");

      return null;
    }
  };


  const [user, setUser] = useState(
    getCurrentUser()
  );

  const isLoggedIn = user !== null;


  // ==========================================
  // STATES
  // ==========================================

  const [destinations, setDestinations] =
    useState([]);

  const [destinationOffset, setDestinationOffset] =
    useState(0);

  const [slideDirection, setSlideDirection] =
    useState("next");

  const [search, setSearch] =
    useState("");

  const [isSearchFocused, setIsSearchFocused] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==========================================
  // GET DESTINATIONS
  // ==========================================

  useEffect(() => {

    const fetchDestinations = async () => {

      try {

        setLoading(true);
        setError("");

        const response =
          await api.get("/destinations");

        setDestinations(
          shuffleDestinations(response.data)
        );

        setDestinationOffset(0);

      } catch (error) {

        console.error(
          "Error loading destinations:",
          error
        );

        setError(
          "Unable to load destinations. Please make sure the server is running."
        );

      } finally {

        setLoading(false);

      }
    };


    fetchDestinations();

  }, []);


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    localStorage.removeItem("user");

    setUser(null);

    navigate("/");

  };


  // ==========================================
  // OPEN LOGIN
  // ==========================================

  const openLogin = () => {
    navigate("/login");
  };


  // ==========================================
  // OPEN DESTINATION
  // ==========================================

  const openDestination = (id) => {

    if (!isLoggedIn) {

      alert(
        "Please login to explore destinations."
      );

      navigate("/login");

      return;
    }

    navigate(`/destinations/${id}`);

  };


  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearch = (e) => {

    e.preventDefault();

    const searchText =
      search.trim().toLowerCase();

    if (!searchText) {
      return;
    }


    const destination =
      destinations.find(
        (item) =>
          item.name
            ?.toLowerCase()
            .includes(searchText)

          ||

          item.state
            ?.toLowerCase()
            .includes(searchText)
      );


    if (destination) {

      openDestination(destination.id);

    } else {

      alert(
        "Destination not found."
      );

    }

  };


  // ==========================================
  // SEARCH SUGGESTIONS
  // ==========================================

  const searchText =
    search.trim().toLowerCase();


  const searchSuggestions =
    searchText
      ? destinations
          .filter(
            (destination) =>
              destination.name
                ?.toLowerCase()
                .includes(searchText)

              ||

              destination.state
                ?.toLowerCase()
                .includes(searchText)
          )
          .slice(0, 5)

      : [];


  const selectSuggestion = (
    destination
  ) => {

    setSearch("");

    setIsSearchFocused(false);

    openDestination(destination.id);

  };


  // ==========================================
  // DESTINATION SLIDER
  // ==========================================

  const visibleDestinations =
    destinations.slice(
      destinationOffset,
      destinationOffset + 4
    );


  const showNextDestinations = () => {

    setSlideDirection("next");

    setDestinationOffset(
      (currentOffset) => {

        const nextOffset =
          currentOffset + 4;

        return nextOffset >=
          destinations.length
          ? 0
          : nextOffset;

      }
    );

  };


  const showPreviousDestinations = () => {

    setSlideDirection("previous");

    setDestinationOffset(
      (currentOffset) => {

        if (currentOffset > 0) {
          return currentOffset - 4;
        }

        return (
          Math.floor(
            (destinations.length - 1) / 4
          ) * 4
        );

      }
    );

  };


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <main className="
      relative
      min-h-screen
      overflow-hidden
      isolate
    ">


      {/* ======================================
          BACKGROUND
      ====================================== */}

      <div
        className="
          absolute
          inset-0
          z-0
          bg-cover
          bg-center
          bg-no-repeat
        "
        style={{
          backgroundImage: `url(${homeBg})`,
        }}
      />

      {/* Soft cream overlay */}
      <div className="
        absolute
        inset-0
        z-0
        bg-[#f6eadb]/65
      " />

      {/* Soft glass effect over background */}
      <div className="
        pointer-events-none
        absolute
        inset-0
        z-0
        bg-white/10
      " />


      {/* ======================================
          NAVBAR
      ====================================== */}

      <nav className="
        relative
        z-50
        flex
        items-center
        justify-between
        border-b
        border-white/20
        bg-gradient-to-r from-blue-800/30 via-blue-600/20 to-blue-400/10
        backdrop-blur-3xl
        shadow-[0_12px_40px_rgba(2,6,23,0.35)]
        ring-1 ring-blue-900/10
        px-6
        py-4
        md:px-12
      ">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/4 to-white/2 mix-blend-overlay rounded-md" />


        {/* LOGO */}

        <button
          onClick={() => navigate("/")}
          className="
            inline-flex
            cursor-pointer
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

          <h1 className="
            text-4xl
            font-bold
            tracking-tight
            text-[#172554]
          ">
            TravelMate
          </h1>

        </button>


        {/* NAVIGATION */}

        <div className="
          flex
          items-center
          gap-3
          md:gap-6
        ">


          {/* HOME */}

          <button
            onClick={() => navigate("/")}
            className="
              text-sm
              font-semibold
              text-[#172554]
              transition
              hover:text-[#f97316]
            "
          >
            Home
          </button>


          {/* LOGGED IN */}

          {isLoggedIn ? (

            <>

              {/* FAVORITES */}

              <button
                onClick={() =>
                  navigate("/favorites")
                }
                className="
                  text-sm
                  font-semibold
                  text-[#172554]
                  transition
                  hover:text-[#f97316]
                "
              >
                ❤️ Favorites
              </button>


              {/* PROFILE */}

              <button
                onClick={() =>
                  navigate("/profile")
                }
                className="
                  text-sm
                  font-semibold
                  text-[#172554]
                  transition
                  hover:text-[#f97316]
                "
              >
                👤 Profile
              </button>


              {/* LOGOUT */}

              <button
                onClick={handleLogout}
                className="
                  rounded-full
                  border
                  border-red-200/70
                  bg-white/40
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-red-500
                  backdrop-blur-md
                  transition
                  hover:bg-red-50/70
                "
              >
                Logout
              </button>

            </>

          ) : (

            /* LOGGED OUT */

            <button
              onClick={openLogin}
              className="
                rounded-full
                border
                border-white/30
                bg-[#172554]/95
                px-5
                py-2
                text-sm
                font-semibold
                text-white
                shadow-md
                transition
                hover:bg-[#1e3a8a]
              "
            >
              Login
            </button>

          )}

        </div>

      </nav>


      {/* ======================================
          HERO
      ====================================== */}

      <section
  className={`
    relative
    z-30
    px-6
    pt-12
    md:px-12
    md:pt-16
    ${
      isSearchFocused && searchText
        ? "pb-[340px] md:pb-[360px]"
        : "pb-12 md:pb-16"
    }
  `}
>

        <div className="
          mx-auto
          max-w-6xl
        ">


          {/* WELCOME */}

          <p className="
            text-sm
            font-semibold
            uppercase
            tracking-wider
            text-[#f97316]
          ">
            Explore India
          </p>


          <h1 className="
            mt-3
            max-w-3xl
            text-4xl
            font-bold
            leading-tight
            text-[#172554]
            md:text-6xl
          ">

            Hello,{" "}

            {user?.name || "Traveller"}

            ! 👋

            <br />

            Where will you go next?

          </h1>


          <p className="
            mt-5
            max-w-2xl
            text-base
            leading-7
            text-gray-600
            md:text-lg
          ">
            Discover amazing destinations across
            India, explore their attractions and
            find the perfect place for your next
            adventure.
          </p>


          {/* ==================================
              SEARCH
          ================================== */}

          <div
  className="
    relative
    z-[100]
    mt-8
    w-full
    max-w-2xl
  "
>


            <form
              onSubmit={handleSearch}
              className="
                flex
                w-full
                items-center
                rounded-2xl
                border
                border-white/60
                bg-white/50
                p-2
                shadow-[0_15px_40px_rgba(23,37,84,0.12)]
                backdrop-blur-xl
              "
            >

              <Search
                size={22}
                className="
                  ml-3
                  shrink-0
                  text-gray-500
                "
              />


              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                onFocus={() =>
                  setIsSearchFocused(true)
                }
                onBlur={() =>
                  setIsSearchFocused(false)
                }
                placeholder="
                  Search a destination or state...
                "
                className="
                  h-12
                  flex-1
                  bg-transparent
                  px-4
                  text-sm
                  text-gray-800
                  outline-none
                  placeholder:text-gray-500
                "
              />


              <button
                type="submit"
                className="
                  flex
                  h-12
                  items-center
                  gap-2
                  rounded-xl
                  bg-[#172554]
                  px-5
                  text-sm
                  font-semibold
                  text-white
                  shadow-md
                  transition
                  hover:bg-[#1e3a8a]
                  active:scale-[0.98]
                "
              >

                Search

                <ArrowRight size={17} />

              </button>

            </form>


            {/* ==================================
                SEARCH SUGGESTIONS
            ================================== */}

            {isSearchFocused &&
              searchText && (

                <div
  className="
    absolute
    left-0
    right-0
    top-full
    z-[100]
    mt-2
    max-h-[320px]
    w-full
    overflow-y-auto
    overflow-hidden
    rounded-2xl
    border
    border-white/60
    bg-white/75
    py-1
    shadow-[0_20px_50px_rgba(23,37,84,0.20)]
    backdrop-blur-xl
  "
>

                  {searchSuggestions.length > 0 ? (

                    searchSuggestions.map(
                      (destination) => (

                        <button
                          key={destination.id}
                          type="button"
                          onMouseDown={(e) =>
                            e.preventDefault()
                          }
                          onClick={() =>
                            selectSuggestion(
                              destination
                            )
                          }
                          className="
                            flex
                            w-full
                            items-center
                            gap-3
                            px-4
                            py-3
                            text-left
                            transition
                            hover:bg-white/60
                          "
                        >

                          <MapPin
                            size={17}
                            className="
                              shrink-0
                              text-[#f97316]
                            "
                          />


                          <span className="
                            min-w-0
                          ">

                            <span className="
                              block
                              truncate
                              font-semibold
                              text-[#172554]
                            ">
                              {destination.name}
                            </span>


                            <span className="
                              block
                              truncate
                              text-sm
                              text-gray-500
                            ">
                              {destination.state}
                            </span>

                          </span>

                        </button>

                      )
                    )

                  ) : (

                    <p className="
                      px-4
                      py-3
                      text-sm
                      text-gray-500
                    ">
                      No destinations found.
                    </p>

                  )}

                </div>

              )}

          </div>

        </div>

      </section>


      {/* ======================================
          DESTINATIONS
      ====================================== */}

      <section className="
        relative
        z-10
        px-6
        pb-20
        md:px-12
      ">

        <div className="
          mx-auto
          max-w-6xl
        ">


          {/* SECTION TITLE */}

          <div className="
            mb-7
            flex
            items-end
            justify-between
          ">

            <div>

              <p className="
                text-sm
                font-semibold
                text-[#f97316]
              ">
                Discover
              </p>


              <h2 className="
                mt-1
                text-3xl
                font-bold
                text-[#172554]
              ">
                Popular Destinations
              </h2>

            </div>

          </div>


          {/* ==================================
              LOADING
          ================================== */}

          {loading && (

            <div className="
              rounded-[24px]
              border
              border-white/50
              bg-white/45
              p-10
              text-center
              shadow-lg
              backdrop-blur-xl
            ">

              <p className="
                text-gray-600
              ">
                Loading destinations...
              </p>

            </div>

          )}


          {/* ==================================
              ERROR
          ================================== */}

          {!loading && error && (

            <div className="
              rounded-[24px]
              border
              border-red-200/60
              bg-red-50/60
              p-6
              text-center
              shadow-lg
              backdrop-blur-xl
            ">

              <p className="
                text-red-600
              ">
                {error}
              </p>

            </div>

          )}


          {/* ==================================
              EMPTY
          ================================== */}

          {!loading &&
            !error &&
            destinations.length === 0 && (

              <div className="
                rounded-[24px]
                border
                border-white/50
                bg-white/45
                p-10
                text-center
                shadow-lg
                backdrop-blur-xl
              ">

                <p className="
                  text-gray-600
                ">
                  No destinations available yet.
                </p>

              </div>

            )}


          {/* ==================================
              DESTINATION CARDS
          ================================== */}

          {!loading &&
            !error &&
            destinations.length > 0 && (

              <div className="
                flex
                items-center
                gap-3
                md:gap-5
              ">


                {/* PREVIOUS */}

                {destinations.length > 4 && (

                  <button
                    type="button"
                    onClick={
                      showPreviousDestinations
                    }
                    aria-label="
                      Show previous destinations
                    "
                    title="
                      Show previous destinations
                    "
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/30
                      bg-[#172554]/90
                      text-white
                      shadow-md
                      backdrop-blur-md
                      transition
                      hover:bg-[#1e3a8a]
                      focus:outline-none
                    "
                  >

                    <ArrowLeft size={20} />

                  </button>

                )}


                {/* CARDS */}

                <div
                  className="
                    destination-card-slider
                    grid
                    flex-1
                    grid-cols-1
                    gap-6
                    sm:grid-cols-2
                    lg:grid-cols-4
                  "
                  key={`${destinationOffset}-${slideDirection}`}
                  style={{
                    animationName:
                      slideDirection === "next"
                        ? "destination-slide-in-next"
                        : "destination-slide-in-previous",
                  }}
                >

                  {visibleDestinations.map(
                    (destination) => (

                      <article
                        key={destination.id}
                        onClick={() =>
                          openDestination(
                            destination.id
                          )
                        }
                        className="
                          group
                          relative
                          cursor-pointer
                          overflow-hidden
                          rounded-[24px]
                          border
                          border-white/25
                          bg-gradient-to-b from-white/10 to-white/5
                          shadow-[0_15px_40px_rgba(2,6,23,0.12)]
                          backdrop-blur-2xl
                          transition
                          duration-300
                          hover:-translate-y-2
                          hover:shadow-[0_22px_60px_rgba(2,6,23,0.18)]
                        "
                      >

                        {/* Sheen overlay */}
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/6 to-white/3 mix-blend-overlay" />


                        {/* IMAGE */}

                        <div className="
                          relative
                          h-56
                          overflow-hidden
                          bg-gray-200/50
                        ">

                          <img
                            src={
                              destination.imageUrl
                                ? (
                                    destination.imageUrl
                                      .startsWith("/")
                                      ? destination.imageUrl
                                      : `/${destination.imageUrl}`
                                  )
                                : "/images/default-destination.jpg"
                            }
                            alt={destination.name}
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
                                "/images/default-destination.jpg";

                            }}
                          />


                          {/* STATE */}

                          <div className="
                            absolute
                            left-4
                            top-4
                            flex
                            items-center
                            gap-1
                            rounded-full
                            border
                            border-white/50
                            bg-white/75
                            px-3
                            py-1.5
                            text-xs
                            font-semibold
                            text-[#172554]
                            shadow-sm
                            backdrop-blur-xl
                          ">

                            <MapPin size={13} />

                            {destination.state}

                          </div>

                        </div>


                        {/* CARD CONTENT */}

                        <div className="
                          border-t
                          border-white/20
                          bg-white/10
                          p-5
                          backdrop-blur-md
                        ">

                          <h3 className="
                            text-xl
                            font-bold
                            text-[#172554]
                          ">
                            {destination.name}
                          </h3>


                          <p className="
                            mt-2
                            line-clamp-2
                            text-sm
                            leading-6
                            text-gray-600
                          ">

                            {destination.description ||
                              "Discover this amazing destination in India."}

                          </p>


                          <div className="
                            mt-4
                            flex
                            items-center
                            justify-between
                          ">

                            <span className="
                              text-sm
                              font-semibold
                              text-[#f97316]
                            ">

                              {isLoggedIn
                                ? "Explore destination"
                                : "Login to explore"}

                            </span>


                            <ArrowRight
                              size={18}
                              className="
                                text-[#172554]
                                transition
                                group-hover:translate-x-1
                              "
                            />

                          </div>

                        </div>

                      </article>

                    )
                  )}

                </div>


                {/* NEXT */}

                {destinations.length > 4 && (

                  <button
                    type="button"
                    onClick={
                      showNextDestinations
                    }
                    aria-label="
                      Show next destinations
                    "
                    title="
                      Show next destinations
                    "
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/30
                      bg-[#172554]/90
                      text-white
                      shadow-md
                      backdrop-blur-md
                      transition
                      hover:bg-[#1e3a8a]
                      focus:outline-none
                    "
                  >

                    <ArrowRight size={20} />

                  </button>

                )}

              </div>

            )}

        </div>

      </section>

      <Footer/>
    </main>
  );
}
export default Home;