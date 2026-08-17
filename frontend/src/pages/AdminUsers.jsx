import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Users,
  Trash2,
  RefreshCw,
  UserCircle,
} from "lucide-react";

import api from "../api/api";
import travelmateLogo from "../assets/images/travelmate-logo.png";


function AdminUsers() {

  const navigate = useNavigate();


  // ==========================================
  // STATE
  // ==========================================

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");


  // ==========================================
  // GET LOGGED-IN ADMIN
  // ==========================================

  const getLoggedInUser = () => {

    try {

      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        return null;
      }

      return JSON.parse(storedUser);

    } catch (error) {

      console.error(
        "Invalid user data:",
        error
      );

      return null;
    }
  };


  // ==========================================
  // LOAD USERS
  // ==========================================

  const fetchUsers = async () => {

    try {

      setLoading(true);

      setError("");


      const admin =
        getLoggedInUser();


      // ======================================
      // CHECK LOGIN
      // ======================================

      if (!admin?.id) {

        navigate("/login");

        return;
      }


      // ======================================
      // CHECK ADMIN ROLE
      // ======================================

      if (
        admin.role?.toUpperCase() !==
        "ADMIN"
      ) {

        setError(
          "Access denied. Admin only."
        );

        return;
      }


      // ======================================
      // GET ALL USERS
      // ======================================

      const response =
        await api.get(
          "/users",
          {
            headers: {
              userId: admin.id,
            },
          }
        );


      setUsers(
        Array.isArray(response.data)
          ? response.data
          : []
      );

    } catch (error) {

      console.error(
        "Error loading users:",
        error
      );


      if (
        error.response?.status === 403
      ) {

        setError(
          "Access denied. Admin only."
        );

        return;
      }


      if (
        error.response?.status === 401
      ) {

        setError(
          "Your admin session is invalid. Please login again."
        );

        return;
      }


      const backendMessage =
        typeof error.response?.data ===
        "string"
          ? error.response.data
          : error.response?.data?.message;


      setError(
        backendMessage ||
        "Unable to load users."
      );

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // LOAD ON PAGE OPEN
  // ==========================================

  useEffect(() => {fetchUsers();}, []);


  // DELETE USER
  // ==========================================

  const handleDeleteUser = async (user) => {

    const admin =
      getLoggedInUser();


    if (!admin?.id) {

      navigate("/login");

      return;
    }


    // ======================================
    // PREVENT ADMIN SELF DELETE
    // ======================================

    if (
      Number(admin.id) ===
      Number(user.id)
    ) {

      alert(
        "You cannot delete your own admin account."
      );

      return;
    }


    // ======================================
    // CONFIRM DELETE
    // ======================================

    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${user.name}?`
      );


    if (!confirmed) {
      return;
    }


    try {

      setDeletingId(user.id);


      // ====================================
      // DELETE REQUEST
      // ====================================

      await api.delete(
        `/users/${user.id}`,
        {
          headers: {
            userId: admin.id,
          },
        }
      );


      // ====================================
      // REMOVE FROM SCREEN
      // ====================================

      setUsers(
        (previousUsers) =>
          previousUsers.filter(
            (currentUser) =>
              currentUser.id !== user.id
          )
      );


      alert(
        "User deleted successfully."
      );

    } catch (error) {

      console.error(
        "Error deleting user:",
        error
      );


      const backendMessage =
        typeof error.response?.data ===
        "string"
          ? error.response.data
          : error.response?.data?.message;


      alert(
        backendMessage ||
        "Unable to delete user."
      );

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
            size={32}
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
            Loading users...
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

          Back to Dashboard

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
            TravelMate
          </p>


          <h1
            className="
              mt-1
              text-4xl
              font-bold
              text-[#172554]
              md:text-5xl
            "
          >
            User Management
          </h1>


          <p
            className="
              mt-3
              max-w-2xl
              text-gray-600
            "
          >
            View registered TravelMate users
            and remove user accounts when
            necessary.
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

          </div>

        )}


        {/* ====================================
            TOP BAR
        ==================================== */}

        {!error && (

          <div
            className="
              mt-8
              flex
              flex-col
              gap-4
              rounded-3xl
              bg-white
              p-6
              shadow-md
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <div
              className="
                flex
                items-center
                gap-4
              "
            >

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#f6eadb]
                "
              >

                <Users
                  size={27}
                  className="
                    text-[#f97316]
                  "
                />

              </div>


              <div>

                <p
                  className="
                    text-sm
                    text-gray-500
                  "
                >
                  Registered Users
                </p>

                <p
                  className="
                    text-3xl
                    font-bold
                    text-[#172554]
                  "
                >
                  {users.length}
                </p>

              </div>

            </div>


            {/* REFRESH */}

            <button
              onClick={fetchUsers}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-[#172554]/15
                bg-white
                px-5
                py-3
                text-sm
                font-semibold
                text-[#172554]
                transition
                hover:bg-[#f6eadb]
              "
            >

              <RefreshCw size={17} />

              Refresh

            </button>

          </div>

        )}


        {/* ====================================
            EMPTY STATE
        ==================================== */}

        {!error &&
          users.length === 0 && (

            <div
              className="
                mt-6
                rounded-3xl
                bg-white
                p-12
                text-center
                shadow-md
              "
            >

              <UserCircle
                size={60}
                className="
                  mx-auto
                  text-gray-300
                "
              />

              <h2
                className="
                  mt-5
                  text-2xl
                  font-bold
                  text-[#172554]
                "
              >
                No users found
              </h2>

              <p
                className="
                  mt-2
                  text-gray-500
                "
              >
                There are currently no
                registered users.
              </p>

            </div>

          )}


        {/* ====================================
            USER LIST
        ==================================== */}

        {!error &&
          users.length > 0 && (

            <div
              className="
                mt-6
                overflow-hidden
                rounded-3xl
                bg-white
                shadow-md
              "
            >

              {/* DESKTOP TABLE */}

              <div
                className="
                  hidden
                  overflow-x-auto
                  md:block
                "
              >

                <table
                  className="
                    w-full
                    border-collapse
                  "
                >

                  <thead>

                    <tr
                      className="
                        border-b
                        border-gray-200
                        bg-gray-50
                      "
                    >

                      <th
                        className="
                          px-6
                          py-4
                          text-left
                          text-xs
                          font-bold
                          uppercase
                          tracking-wide
                          text-gray-500
                        "
                      >
                        ID
                      </th>

                      <th
                        className="
                          px-6
                          py-4
                          text-left
                          text-xs
                          font-bold
                          uppercase
                          tracking-wide
                          text-gray-500
                        "
                      >
                        User
                      </th>

                      <th
                        className="
                          px-6
                          py-4
                          text-left
                          text-xs
                          font-bold
                          uppercase
                          tracking-wide
                          text-gray-500
                        "
                      >
                        Email
                      </th>

                      <th
                        className="
                          px-6
                          py-4
                          text-left
                          text-xs
                          font-bold
                          uppercase
                          tracking-wide
                          text-gray-500
                        "
                      >
                        Role
                      </th>

                      <th
                        className="
                          px-6
                          py-4
                          text-right
                          text-xs
                          font-bold
                          uppercase
                          tracking-wide
                          text-gray-500
                        "
                      >
                        Action
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {users.map((user) => {

                      const isCurrentAdmin =
                        Number(
                          getLoggedInUser()?.id
                        ) ===
                        Number(user.id);


                      return (

                        <tr
                          key={user.id}
                          className="
                            border-b
                            border-gray-100
                            last:border-b-0
                            hover:bg-gray-50
                          "
                        >

                          {/* ID */}

                          <td
                            className="
                              px-6
                              py-5
                              text-sm
                              font-medium
                              text-gray-500
                            "
                          >
                            #{user.id}
                          </td>


                          {/* USER */}

                          <td
                            className="
                              px-6
                              py-5
                            "
                          >

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
                                  h-10
                                  w-10
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-full
                                  bg-[#f6eadb]
                                "
                              >

                                <UserCircle
                                  size={23}
                                  className="
                                    text-[#f97316]
                                  "
                                />

                              </div>


                              <span
                                className="
                                  font-semibold
                                  text-[#172554]
                                "
                              >
                                {user.name}
                              </span>

                            </div>

                          </td>


                          {/* EMAIL */}

                          <td
                            className="
                              px-6
                              py-5
                              text-sm
                              text-gray-600
                            "
                          >
                            {user.email}
                          </td>


                          {/* ROLE */}

                          <td
                            className="
                              px-6
                              py-5
                            "
                          >

                            <span
                              className={`
                                inline-flex
                                rounded-full
                                px-3
                                py-1
                                text-xs
                                font-bold
                                ${
                                  user.role
                                    ?.toUpperCase() ===
                                  "ADMIN"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-600"
                                }
                              `}
                            >
                              {user.role || "USER"}
                            </span>

                          </td>


                          {/* DELETE */}

                          <td
                            className="
                              px-6
                              py-5
                              text-right
                            "
                          >

                            <button
                              disabled={isCurrentAdmin || deletingId === user.id}
                              onClick={() => handleDeleteUser(user)}
                              className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Trash2 size={16} />
                              {deletingId === user.id
                                ? "Deleting..."
                                : isCurrentAdmin
                                ? "Current Admin"
                                : "Delete"}
                            </button>

                          </td>

                        </tr>

                      );

                    })}

                  </tbody>

                </table>

              </div>


              {/* MOBILE LIST */}

              <div
                className="
                  divide-y
                  divide-gray-100
                  md:hidden
                "
              >

                {users.map((user) => {

                  const isCurrentAdmin =
                    Number(
                      getLoggedInUser()?.id
                    ) ===
                    Number(user.id);


                  return (

                    <div
                      key={user.id}
                      className="
                        p-5
                      "
                    >

                      <div
                        className="
                          flex
                          items-start
                          justify-between
                          gap-4
                        "
                      >

                        <div
                          className="
                            flex
                            min-w-0
                            items-center
                            gap-3
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
                              bg-[#f6eadb]
                            "
                          >

                            <UserCircle
                              size={24}
                              className="
                                text-[#f97316]
                              "
                            />

                          </div>


                          <div
                            className="
                              min-w-0
                            "
                          >

                            <p
                              className="
                                truncate
                                font-bold
                                text-[#172554]
                              "
                            >
                              {user.name}
                            </p>

                            <p
                              className="
                                truncate
                                text-sm
                                text-gray-500
                              "
                            >
                              {user.email}
                            </p>

                          </div>

                        </div>


                        <span
                          className={`
                            shrink-0
                            rounded-full
                            px-3
                            py-1
                            text-xs
                            font-bold
                            ${
                              user.role
                                ?.toUpperCase() ===
                              "ADMIN"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-600"
                            }
                          `}
                        >
                          {user.role || "USER"}
                        </span>

                      </div>


                      <div
                        className="
                          mt-4
                          flex
                          items-center
                          justify-between
                          gap-4
                        "
                      >

                        <span
                          className="
                            text-xs
                            text-gray-400
                          "
                        >
                          User ID: #{user.id}
                        </span>


                        <button
                          disabled={isCurrentAdmin || deletingId === user.id}
                          onClick={() => handleDeleteUser(user)}
                          className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Trash2 size={16} />
                          {deletingId === user.id
                            ? "Deleting..."
                            : isCurrentAdmin
                            ? "Current Admin"
                            : "Delete"}
                        </button>

                      </div>

                    </div>

                  );

                })}

              </div>

            </div>

          )}

      </section>

    </main>
  );
}


export default AdminUsers;

