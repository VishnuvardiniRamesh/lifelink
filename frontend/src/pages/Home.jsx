import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container">
      <div className="card">
        <h2>Real-Time Emergency Blood Donor Network</h2>
        <p style={{ color: "var(--muted)" }}>
          LifeLink connects donors, hospitals, and recipients through real-time donor
          search, eligibility verification, emergency alerts, and location-based services.
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <Link to="/donor/register"><button className="primary">Register as Donor</button></Link>
          <Link to="/hospital/request"><button className="primary" style={{ background: "var(--navy)" }}>Raise Emergency Request</button></Link>
        </div>
      </div>
    </div>
  );
}
