import { Home } from "@pages/Home";
import { Links } from "@pages/Links";
import { Stats } from "@pages/Stats";
import { Route, Routes } from "react-router-dom";

/**
 * Application Routes Configuration
 * Centralized routing for the application
 */
export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/links" element={<Links />} />
      <Route path="/stats/:shortCode" element={<Stats />} />
    </Routes>
  );
};

export default AppRoutes;
