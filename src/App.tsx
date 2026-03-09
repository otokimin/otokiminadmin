import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "./components/Menu";
import DashBoardScreen from "./pages/DashBoardScreen";
import AdsManagement from "./pages/AdsManangement";
import PremiumManagement from "./pages/PremiumManangement";
import SupportScreen from "./pages/SupportScreen";
import UserManagement from "./pages/UserManagement";
import AdminLogin from "./pages/Login";
import ProtectedRoute from './../ProtectedRoute';
import LawyerAsks from "./pages/LawyerAsks";
import UserProfilePage from "./pages/UserProfilePage";

function App() {
  return (
    <Router>
      <Routes>

        {/* LOGIN */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* PUBLIC USER PROFILE PAGE (QR ile erişilen) */}
        <Route path="/user-profile" element={<UserProfilePage />} />

        {/* ADMIN PANEL (protected) */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="d-flex h-100" style={{ height: "100vh", overflow: "hidden" }}>
                <Menu />
                <div className="flex-grow-1 d-flex flex-column overflow-hidden">
                  <div className="flex-grow-1 overflow-auto hide-scroll mt-3">
                    <Routes>
                      <Route path="/" element={<DashBoardScreen />} />
                      <Route path="/ads" element={<AdsManagement />} />
                      <Route path="/premium" element={<PremiumManagement />} />
                      <Route path="/support" element={<SupportScreen />} />
                      <Route path="/user" element={<UserManagement />} />
                      <Route path="/lawyerAsk" element={<LawyerAsks />} />


                    </Routes>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
