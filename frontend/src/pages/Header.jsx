import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import travelmateLogo from "../assets/images/travelmate-logo.png";


function Header() {
  const navigate = useNavigate();

  // ==========================================
  // GET CURRENT USER
  // ==========================================

  const getCurrentUser = () => {
    try {
      const storedUser = localStorage.getItem("user");

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


  // ==========================================
  // USER STATE
  // ==========================================

  const [user, setUser] = useState(
    getCurrentUser()
  );

  const isLoggedIn = user !== null;


  // ==========================================
  // KEEP HEADER IN SYNC WITH LOGIN STATUS
  // ==========================================

  useEffect(() => {

    const checkUser = () => {
      setUser(getCurrentUser());
    };

    window.addEventListener(
      "storage",
      checkUser
    );

    return () => {
      window.removeEventListener(
        "storage",
        checkUser
      );
    };

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
  // HEADER
  // ==========================================

  return (

    <nav
      className="
        relative
        z-50
        flex
        items-center
        justify-between
        border-b
        border-white/20
        bg-gradient-to-r
        from-blue-800/30
        via-blue-600/20
        to-blue-400/10
        backdrop-blur-3xl
        shadow-[0_12px_40px_rgba(2,6,23,0.35)]
        ring-1
        ring-blue-900/10
        px-6
        py-4
        md:px-12
      "
    >

      {/* ==========================================
          GLASS SHINE
      ========================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          rounded-md
          bg-gradient-to-b
          from-white/4
          to-white/2
          mix-blend-overlay
        "
      />


      {/* ==========================================
          LOGO
      ========================================== */}

      <button
        type="button"
        onClick={() => navigate("/")}
        className="
          relative
          z-10
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


      {/* ==========================================
          NAVIGATION
      ========================================== */}

      <div
        className="
          relative
          z-10
          flex
          items-center
          gap-3
          md:gap-6
        "
      >

        {/* ========================================
            HOME
        ======================================== */}

        <button
          type="button"
          onClick={() => navigate("/")}
          className="
            text-sm
            font-semibold
            text-[#172554]
            transition
            duration-200
            hover:text-[#f97316]
          "
        >
          Home
        </button>


        {/* ========================================
            LOGGED IN
        ======================================== */}

        {isLoggedIn ? (

          <>

            {/* FAVORITES */}

            <button
              type="button"
              onClick={() =>
                navigate("/favorites")
              }
              className="
                text-sm
                font-semibold
                text-[#172554]
                transition
                duration-200
                hover:text-[#f97316]
              "
            >
              ❤️ Favorites
            </button>


            {/* PROFILE */}

            <button
              type="button"
              onClick={() =>
                navigate("/profile")
              }
              className="
                text-sm
                font-semibold
                text-[#172554]
                transition
                duration-200
                hover:text-[#f97316]
              "
            >
              👤 Profile
            </button>


            {/* LOGOUT */}

            <button
              type="button"
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
                duration-200
                hover:bg-red-50/70
                active:scale-[0.98]
              "
            >
              Logout
            </button>

          </>

        ) : (

          /* ======================================
             LOGGED OUT
          ====================================== */

          <button
            type="button"
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
              duration-200
              hover:bg-[#1e3a8a]
              active:scale-[0.98]
            "
          >
            Login
          </button>

        )}

      </div>

    </nav>
  );
}


export default Header;