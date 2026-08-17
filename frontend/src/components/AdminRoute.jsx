import { Navigate, Outlet } from "react-router-dom";

function AdminRoute() {

  // ==========================================
  // GET LOGGED-IN USER
  // ==========================================

  const storedUser = localStorage.getItem("user");

  // ==========================================
  // NOT LOGGED IN
  // ==========================================

  if (!storedUser) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }

  // ==========================================
  // READ USER
  // ==========================================

  let user;

  try {

    user = JSON.parse(storedUser);

  } catch (error) {

    console.error(
      "Invalid user data in localStorage:",
      error
    );

    localStorage.removeItem("user");

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }

  // ==========================================
  // CHECK ADMIN ROLE
  // ==========================================

  if (user.role !== "ADMIN") {

    return (
      <Navigate
        to="/"
        replace
      />
    );

  }

  // ==========================================
  // ADMIN VERIFIED
  // ==========================================

  return <Outlet />;
}

export default AdminRoute;