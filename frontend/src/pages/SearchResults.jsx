import { useState } from "react";
import client from "../api/client.js";

export default function SearchResults() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = (bloodType) => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { data } = await client.get("/donors/search", {
        params: { bloodType, lat: pos.coords.latitude, lng: pos.coords.longitude, radiusKm: 10 },
      });
      setDonors(data.donors);
      setLoading(false);
    });
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Nearby Donors</h2>
        {loading && <p>Searching...</p>}
        {donors.map((d) => (
          <div className="donor-row" key={d._id}>
            <div>
              <strong>{d.name}</strong> — {d.bloodType}
            </div>
            <span className={`badge ${d.eligibility.eligible ? "ok" : "no"}`}>
              {d.eligibility.eligible ? "Eligible" : d.eligibility.reason}
            </span>
          </div>
        ))}
        <button className="primary" onClick={() => search("O+")}>Search O+ Donors (demo)</button>
      </div>
    </div>
  );
}
