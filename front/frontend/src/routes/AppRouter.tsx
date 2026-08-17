import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login/Login";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import Dashboard from "../pages/Dashboard/Dashboard";
import Students from "../pages/Students/Students";
import Teachers from "../pages/Teachers/Teachers";
import Darasa from "../pages/Darasa/Darasa";
import Progress from "../pages/Progress/Progress";
import Reports from "../pages/Reports/Reports";
import Profile from "../pages/Profile/Profile";
import Settings from "../pages/Settings/Settings";
import Curriculum from "../pages/Curriculum/Curriculum";
import LevelValidation from "../pages/LevelValidation/LevelValidation";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/darasa" element={<Darasa />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/level-validation" element={<LevelValidation />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />

        {/* Route Curriculum - Admins only */}
        <Route
          path="/curriculum"
          element={
            <AdminRoute>
              <Curriculum />
            </AdminRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRouter;