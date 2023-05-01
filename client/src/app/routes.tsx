import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  ChangePassword,
  Dashboard,
  Home,
  Login,
  NotFound,
  QRScan,
  Signup,
  VerifyOTP,
} from "../pages";
import { RootAppShell } from "./app";

export const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/qr-scan" element={<QRScan />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/" element={<RootAppShell />}>
          <Route path="" element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
};
