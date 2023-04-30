import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  Dashboard,
  Home,
  Login,
  NotFound,
  Signup,
} from "../pages";
import { RootAppShell } from "./app";

export const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RootAppShell />}>
          <Route path="" element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
};
