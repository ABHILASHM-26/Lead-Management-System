
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LeadsPage from "./pages/LeadsPage";
import CreateEditLeadPage from "./pages/CreateEditLeadPage";
import Navbar from "./components/Navbar";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <Router>
      {}
      <Navbar />

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Navigate to="/register" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/leads/create" element={<CreateEditLeadPage />} />
          <Route path="/leads/edit/:id" element={<CreateEditLeadPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;