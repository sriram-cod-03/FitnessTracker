import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles/progress.css";

// ✅ LAZY LOAD PAGES (Splits massive JS bundles into smaller chunks)
const Dashboard = lazy(() => import("./pages/Dashboard"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const Nutrition = lazy(() => import("./pages/Nutrition"));
const SetupProfile = lazy(() => import("./pages/SetupProfile"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const DietPlan = lazy(() => import("./pages/DietPlan"));

// A clean neon fallback loader to show while pages load
const PageLoader = () => (
  <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#000" }}>
    <div className="spinner-border text-info" style={{ width: "3rem", height: "3rem" }}></div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      {/* Suspense is required when using React.lazy */}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* PROTECTED ROUTES */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nutrition"
            element={
              <ProtectedRoute>
                <Nutrition />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/setup-profile"
            element={
              <ProtectedRoute>
                <SetupProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/diet-plan"
            element={
              <ProtectedRoute>
                <DietPlan />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;