import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import profileBg from "../assets/images/bg.png";

import {
  User,
  Mail,
  Save,
  X,
} from "lucide-react";

import api from "../api/api";
import Footer from "./Footer";
import Header from "./Header";

function Profile() {
  const navigate = useNavigate();

  // ==========================================
  // USER STATE
  // ==========================================

  const [user, setUser] = useState(null);

  // ==========================================
  // EDIT STATES
  // ==========================================

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // ==========================================
  // LOADING / ERROR
  // ==========================================

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // LOAD PROFILE
  // ==========================================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          navigate("/login");
          return;
        }

        const loggedInUser = JSON.parse(storedUser);

        if (!loggedInUser?.id) {
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }

        const response = await api.get(
          `/users/${loggedInUser.id}`
        );

        setUser(response.data);
        setName(response.data.name || "");
        setEmail(response.data.email || "");

      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Unable to load your profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  // ==========================================
  // START EDITING
  // ==========================================

  const handleEdit = () => {
    setSuccess("");
    setError("");

    setName(user?.name || "");
    setEmail(user?.email || "");

    setIsEditing(true);
  };

  // ==========================================
  // CANCEL EDITING
  // ==========================================

  const handleCancel = () => {
    setName(user?.name || "");
    setEmail(user?.email || "");

    setError("");
    setSuccess("");

    setIsEditing(false);
  };

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleSave = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError("Name cannot be empty.");
      return;
    }

    if (!trimmedEmail) {
      setError("Email cannot be empty.");
      return;
    }

    try {
      setSaving(true);

      const response = await api.put(
        `/users/${user.id}`,
        {
          name: trimmedName,
          email: trimmedEmail,
        }
      );

      setUser(response.data);
      setName(response.data.name || "");
      setEmail(response.data.email || "");

      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const localUser = JSON.parse(storedUser);

        const updatedLocalUser = {
          ...localUser,
          name: response.data.name,
          email: response.data.email,
        };

        localStorage.setItem(
          "user",
          JSON.stringify(updatedLocalUser)
        );
      }

      setIsEditing(false);
      setSuccess("Profile updated successfully.");

    } catch (err) {
      console.error("Error updating profile:", err);

      const backendMessage = err?.response?.data;

      if (typeof backendMessage === "string") {
        setError(backendMessage);
      } else {
        setError("Unable to update your profile.");
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
          bg-[#dbeafe]
        "
      >
        <p className="text-lg font-semibold text-[#172554]">
          Loading profile...
        </p>
      </main>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error && !user) {
    return (
      <main
        className="
          flex
          min-h-screen
          flex-col
          items-center
          justify-center
          gap-5
          bg-[#dbeafe]
          px-6
        "
      >
        <p className="text-center text-red-500">
          {error}
        </p>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="
            rounded-full
            bg-[#172554]
            px-5
            py-2
            font-semibold
            text-white
            transition
            hover:bg-[#1e3a8a]
          "
        >
          Back to Home
        </button>
      </main>
    );
  }

  // ==========================================
  // PROFILE PAGE
  // ==========================================

  return (
    <main className="relative min-h-screen overflow-hidden">

      {/* ======================================
          BACKGROUND IMAGE
      ====================================== */}

      <div
        className="
          fixed
          inset-0
          -z-20
          bg-cover
          bg-center
          bg-no-repeat
        "
        style={{
          backgroundImage: `url(${profileBg})`,
        }}
      />

      {/* ======================================
          LIGHT BLUE + ORANGE OVERLAY
      ====================================== */}

      <div
        className="
          fixed
          inset-0
          -z-10
          bg-gradient-to-br
          from-blue-100/65
          via-white/25
          to-orange-100/70
        "
      />

      {/* ======================================
          SOFT BLUR LAYER
      ====================================== */}

      <div
        className="
          fixed
          inset-0
          -z-10
          bg-white/15
          backdrop-blur-[2px]
        "
      />

      {/* ======================================
          HEADER
      ====================================== */}

      <Header />

      {/* ======================================
          PROFILE CONTENT
      ====================================== */}

      <section
        className="
          relative
          px-6
          py-12
          md:px-12
          md:py-16
        "
      >

        <div className="mx-auto max-w-3xl">

          {/* ======================================
              TITLE
          ====================================== */}

          <div className="mb-8">

            <p
              className="
                text-sm
                font-semibold
                uppercase
                tracking-wider
                text-orange-600
              "
            >
              Account
            </p>

            <h1
              className="
                mt-2
                text-4xl
                font-bold
                text-[#172554]
              "
            >
              My Profile
            </h1>

            <p className="mt-2 text-gray-700">
              Manage your TravelMate account information.
            </p>

          </div>

          {/* ======================================
              MAIN GLASS PROFILE CARD
          ====================================== */}

          <div
            className="
              overflow-hidden
              rounded-3xl
              border
              border-white/40
              bg-white/25
              shadow-[0_25px_70px_rgba(23,37,84,0.18)]
              backdrop-blur-2xl
            "
          >

            {/* ======================================
                PROFILE HEADER
            ====================================== */}

            <div
              className="
                relative
                overflow-hidden
                bg-gradient-to-r
                from-[#172554]/95
                via-[#1e3a8a]/90
                to-blue-600/85
                px-6
                py-8
                md:px-10
              "
            >

              {/* ORANGE GLOW */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-10
                  -top-16
                  h-44
                  w-44
                  rounded-full
                  bg-orange-400/35
                  blur-3xl
                "
              />

              {/* BLUE GLOW */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -bottom-20
                  -left-20
                  h-40
                  w-40
                  rounded-full
                  bg-blue-300/25
                  blur-3xl
                "
              />

              <div
                className="
                  relative
                  z-10
                  flex
                  items-center
                  justify-between
                  gap-5
                "
              >

                <div className="flex items-center gap-5">

                  {/* USER ICON */}

                  <div
                    className="
                      flex
                      h-20
                      w-20
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-white/90
                      text-[#172554]
                      shadow-lg
                    "
                  >
                    <User size={38} />
                  </div>

                  <div>

                    <h2
                      className="
                        text-2xl
                        font-bold
                        text-white
                      "
                    >
                      {user?.name}
                    </h2>

                    <p className="mt-1 text-white/70">
                      TravelMate Member
                    </p>

                  </div>

                </div>

                {/* EDIT BUTTON */}

                {!isEditing && (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="
                      shrink-0
                      rounded-full
                      bg-white/90
                      px-5
                      py-2
                      text-sm
                      font-semibold
                      text-[#172554]
                      transition
                      hover:bg-orange-50
                      hover:text-orange-600
                    "
                  >
                    Edit Profile
                  </button>
                )}

              </div>

            </div>

            {/* ======================================
                SUCCESS MESSAGE
            ====================================== */}

            {success && (
              <div
                className="
                  mx-6
                  mt-6
                  rounded-xl
                  border
                  border-green-200
                  bg-green-50/80
                  px-4
                  py-3
                  text-sm
                  font-medium
                  text-green-700
                  backdrop-blur-md
                  md:mx-10
                "
              >
                {success}
              </div>
            )}

            {/* ======================================
                ERROR MESSAGE
            ====================================== */}

            {error && (
              <div
                className="
                  mx-6
                  mt-6
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50/80
                  px-4
                  py-3
                  text-sm
                  font-medium
                  text-red-600
                  backdrop-blur-md
                  md:mx-10
                "
              >
                {error}
              </div>
            )}

            {/* ======================================
                DETAILS
            ====================================== */}

            <div className="p-6 md:p-10">

              {isEditing ? (

                /* ==================================
                   EDIT MODE
                ================================== */

                <form
                  onSubmit={handleSave}
                  className="space-y-6"
                >

                  {/* NAME */}

                  <div>

                    <label
                      htmlFor="profile-name"
                      className="
                        mb-2
                        block
                        text-sm
                        font-semibold
                        text-[#172554]
                      "
                    >
                      Name
                    </label>

                    <div
                      className="
                        flex
                        items-center
                        rounded-xl
                        border
                        border-white/50
                        bg-white/45
                        px-4
                        backdrop-blur-xl
                        focus-within:border-blue-400
                        focus-within:ring-2
                        focus-within:ring-blue-400/20
                      "
                    >

                      <User
                        size={20}
                        className="shrink-0 text-gray-500"
                      />

                      <input
                        id="profile-name"
                        type="text"
                        value={name}
                        onChange={(e) =>
                          setName(e.target.value)
                        }
                        className="
                          h-12
                          w-full
                          bg-transparent
                          px-3
                          text-sm
                          text-gray-800
                          outline-none
                        "
                        placeholder="Enter your name"
                      />

                    </div>

                  </div>

                  {/* EMAIL */}

                  <div>

                    <label
                      htmlFor="profile-email"
                      className="
                        mb-2
                        block
                        text-sm
                        font-semibold
                        text-[#172554]
                      "
                    >
                      Email
                    </label>

                    <div
                      className="
                        flex
                        items-center
                        rounded-xl
                        border
                        border-white/50
                        bg-white/45
                        px-4
                        backdrop-blur-xl
                        focus-within:border-orange-400
                        focus-within:ring-2
                        focus-within:ring-orange-400/20
                      "
                    >

                      <Mail
                        size={20}
                        className="shrink-0 text-gray-500"
                      />

                      <input
                        id="profile-email"
                        type="email"
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                        className="
                          h-12
                          w-full
                          bg-transparent
                          px-3
                          text-sm
                          text-gray-800
                          outline-none
                        "
                        placeholder="Enter your email"
                      />

                    </div>

                  </div>

                  {/* BUTTONS */}

                  <div
                    className="
                      flex
                      flex-col
                      gap-3
                      pt-2
                      sm:flex-row
                    "
                  >

                    <button
                      type="submit"
                      disabled={saving}
                      className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-gradient-to-r
                        from-[#172554]
                        to-blue-600
                        px-6
                        py-3
                        text-sm
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

                      <Save size={18} />

                      {saving
                        ? "Saving..."
                        : "Save Changes"}

                    </button>

                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={saving}
                      className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-white/50
                        bg-white/50
                        px-6
                        py-3
                        text-sm
                        font-semibold
                        text-gray-700
                        backdrop-blur-md
                        transition
                        hover:bg-orange-50/70
                        hover:text-orange-600
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >

                      <X size={18} />

                      Cancel

                    </button>

                  </div>

                </form>

              ) : (

                /* ==================================
                   VIEW MODE
                ================================== */

                <div className="space-y-6">

                  {/* NAME */}

                  <div
                    className="
                      flex
                      items-center
                      gap-4
                      rounded-2xl
                      border
                      border-white/40
                      bg-white/35
                      p-5
                      backdrop-blur-xl
                    "
                  >

                    <div
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-blue-100/80
                        text-[#172554]
                      "
                    >
                      <User size={20} />
                    </div>

                    <div>

                      <p
                        className="
                          text-xs
                          font-semibold
                          uppercase
                          tracking-wide
                          text-gray-500
                        "
                      >
                        Name
                      </p>

                      <p
                        className="
                          mt-1
                          font-semibold
                          text-[#172554]
                        "
                      >
                        {user?.name}
                      </p>

                    </div>

                  </div>

                  {/* EMAIL */}

                  <div
                    className="
                      flex
                      items-center
                      gap-4
                      rounded-2xl
                      border
                      border-white/40
                      bg-white/35
                      p-5
                      backdrop-blur-xl
                    "
                  >

                    <div
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-orange-100/80
                        text-orange-600
                      "
                    >
                      <Mail size={20} />
                    </div>

                    <div>

                      <p
                        className="
                          text-xs
                          font-semibold
                          uppercase
                          tracking-wide
                          text-gray-500
                        "
                      >
                        Email
                      </p>

                      <p
                        className="
                          mt-1
                          font-semibold
                          text-[#172554]
                        "
                      >
                        {user?.email}
                      </p>

                    </div>

                  </div>

                  {/* ADMIN */}

                  {user?.role?.toUpperCase() === "ADMIN" && (
                    <button
                      type="button"
                      onClick={() => navigate("/admin")}
                      className="
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-gradient-to-r
                        from-[#172554]
                        to-blue-600
                        px-5
                        py-3
                        text-sm
                        font-semibold
                        text-white
                        shadow-lg
                        transition
                        hover:-translate-y-0.5
                        hover:shadow-xl
                      "
                    >
                      Admin Dashboard
                    </button>
                  )}

                </div>

              )}

            </div>

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

export default Profile;