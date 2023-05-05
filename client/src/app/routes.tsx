import { useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import {
  ChangePassword,
  Dashboard,
  Login,
  NotFound,
  PasswordLessConfirmation,
  QRScan,
  Signup,
  Users,
  VerifyOTP,
} from "../pages";
import { RootAppShell } from "./app";
import { NavigationContext } from "./context/Navigation";

interface RestrictedRouteProps {
  isForAdmin?: boolean;
  children: JSX.Element;
}

const ProtectedRoute = ({
  isForAdmin = false,
  children,
}: RestrictedRouteProps) => {
  const { isAdmin, isAuthenticated } = useContext(NavigationContext);

  const isAuthorized = isForAdmin
    ? isAuthenticated && isAdmin
    : isAuthenticated;

  return isAuthorized ? children : <Navigate to="/login" replace />;
};

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="confirm-login" element={<PasswordLessConfirmation />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/qr-scan" element={<QRScan />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/" element={<RootAppShell />}>
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="users"
            element={
              <ProtectedRoute isForAdmin>
                <Users />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
