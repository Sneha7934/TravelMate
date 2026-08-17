
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";


// ==========================================
// PUBLIC / USER PAGES
// ==========================================

import DestinationDetails from "./pages/DestinationDetails";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AttractionDetails from "./pages/AttractionDetails";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import TourPlan from "./pages/TourPlan";


// ==========================================
// ADMIN PAGES
// ==========================================

import AdminDestinations from "./pages/AdminDestinations";
import AdminAddDestination from "./pages/AdminAddDestination";
import AdminEditDestination from "./pages/AdminEditDestination";
import AdminUsers from "./pages/AdminUsers";
import AdminAttractions from "./pages/AdminAttractions";
import AdminEditAttraction from "./pages/AdminEditAttraction";
import AdminAddAttraction from "./pages/AdminAddAttraction";
import AdminReviews from "./pages/AdminReviews";
import AdminDashboard from "./pages/AdminDashboard";


// ==========================================
// ROUTE PROTECTION
// ==========================================

import AdminRoute from "./components/AdminRoute";


// ==========================================
// CHECK LOGIN
// ==========================================

function isLoggedIn() {

  try {

    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) {
      return false;
    }

    const user =
      JSON.parse(storedUser);

    return Boolean(user?.id);

  } catch (error) {

    console.error(
      "Invalid user data in localStorage:",
      error
    );

    localStorage.removeItem("user");

    return false;
  }
}


// ==========================================
// PROTECTED USER ROUTE
// ==========================================

function ProtectedRoute({ children }) {

  if (!isLoggedIn()) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }

  return children;
}


// ==========================================
// APP
// ==========================================

function App() {

  return (

    <BrowserRouter>

      <Routes>


        {/* ==================================
            HOME
        ================================== */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* ==================================
            LOGIN
        ================================== */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* ==================================
            REGISTER
        ================================== */}

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ==================================
            FORGOT PASSWORD
        ================================== */}

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />


        {/* ==================================
            DESTINATION DETAILS
        ================================== */}

        <Route
          path="/destinations/:id"
          element={
            <ProtectedRoute>
              <DestinationDetails />
            </ProtectedRoute>
          }
        />


        {/* ==================================
            TOUR PLAN
        ================================== */}

        <Route
          path="/destinations/:id/tour-plan"
          element={
            <ProtectedRoute>
              <TourPlan />
            </ProtectedRoute>
          }
        />


        {/* ==================================
            PROFILE
        ================================== */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />


        {/* ==================================
            ATTRACTION DETAILS
        ================================== */}

        <Route
          path="/attractions/:id"
          element={
            <ProtectedRoute>
              <AttractionDetails />
            </ProtectedRoute>
          }
        />


        {/* ==================================
            FAVORITES
        ================================== */}

        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />


        {/* ==================================
            ADMIN ROUTES
        ==================================
        
        Every route inside this group
        is protected by AdminRoute.

        AdminRoute checks:

        localStorage.user.role === "ADMIN"

        ================================== */}

        <Route element={<AdminRoute />}>


          {/* ================================
              ADMIN DASHBOARD
          ================================= */}

          <Route
            path="/admin"
            element={<AdminDashboard />}
          />


          {/* ================================
              ADMIN DESTINATIONS
          ================================= */}

          <Route
            path="/admin/destinations"
            element={<AdminDestinations />}
          />
          <Route
            path="/admin/reviews"
            element={<AdminReviews />}
          />

          {/* ADD DESTINATION */}

          <Route
            path="/admin/destinations/add"
            element={<AdminAddDestination />}
          />


          {/* EDIT DESTINATION */}

          <Route
            path="/admin/destinations/edit/:id"
            element={<AdminEditDestination />}
          />


          {/* ================================
              ADMIN ATTRACTIONS
          ================================= */}

          <Route
            path="/admin/attractions"
            element={<AdminAttractions />}
          />
          <Route
  path="/admin/users"
  element={<AdminUsers />}
/>

          {/* ADD ATTRACTION */}

          <Route
            path="/admin/attractions/add"
            element={<AdminAddAttraction />}
          />


          {/* EDIT ATTRACTION */}

          <Route
            path="/admin/attractions/edit/:id"
            element={<AdminEditAttraction />}
          />

        </Route>


        {/* ==================================
            OLD /home URL
        ================================== */}

        <Route
          path="/home"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />


        {/* ==================================
            UNKNOWN URL
        ================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />


      </Routes>

    </BrowserRouter>
  );
}


export default App;

