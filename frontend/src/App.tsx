import { BrowserRouter, Route, Routes } from "react-router-dom";

import AppLayout from "./layouts/AppLayout";
import CitizenReportsPage from "./pages/CitizenReportsPage";
import DashboardPage from "./pages/DashboardPage";
import DecisionCenterPage from "./pages/DecisionCenterPage";
import EnvironmentPage from "./pages/EnvironmentPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import SmartMobilityPage from "./pages/SmartMobilityPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/decision-center" element={<DecisionCenterPage />} />
          <Route path="/mobility" element={<SmartMobilityPage />} />
          <Route path="/environment" element={<EnvironmentPage />} />
          <Route path="/citizen-reports" element={<CitizenReportsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;