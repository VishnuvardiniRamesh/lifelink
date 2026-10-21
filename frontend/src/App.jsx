import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import DonorRegister from "./pages/DonorRegister.jsx";
import HospitalRegister from "./pages/HospitalRegister.jsx";
import HospitalRequest from "./pages/HospitalRequest.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import Login from "./pages/Login.jsx";

export default function App() {
  return (
    <>
      <nav className="navbar">
        <h1>🩸 LIFELINK</h1>
        <div>
          <Link to="/">Home</Link>
          <Link to="/donor/register">Become a Donor</Link>
          <Link to="/hospital/register">Register Hospital</Link>
          <Link to="/login">Log In</Link>
          <Link to="/hospital/request">Raise Emergency Request</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/donor/register" element={<DonorRegister />} />
        <Route path="/hospital/register" element={<HospitalRegister />} />
        <Route path="/hospital/request" element={<HospitalRequest />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}
