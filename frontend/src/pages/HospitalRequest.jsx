import { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client.js";

const BLOOD_TYPES = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

export default function HospitalRequest() {
  const [bloodType, setBloodType] = useState("O+");
  const [radiusKm, setRadiusKm] = useState(10);
  const [urgency, setUrgency] = useState("urgent");
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setStatus("Locating hospital...");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { data } = await client.post("/requests", {
            bloodType, radiusKm, urgency,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setStatus(`Alert sent — ${data.notified} eligible donor(s) notified.`);
        } catch (err) {
          setStatus(err.response?.data?.message || "Could not create request. Are you logged in as a hospital?");
        }
      },
      () => setStatus("Location permission is needed to find nearby donors.")
    );
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Raise an Emergency Blood Request</h2>
        <form onSubmit={submit}>
          <label>Blood Type Needed</label>
          <select value={bloodType} onChange={(e) => setBloodType(e.target.value)}>
            {BLOOD_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
          <label>Search Radius (km)</label>
          <input type="number" min="1" max="50" value={radiusKm} onChange={(e) => setRadiusKm(e.target.value)} />
          <label>Urgency</label>
          <select value={urgency} onChange={(e) => setUrgency(e.target.value)}>
            <option value="normal">Normal</option>
            <option value="urgent">Urgent</option>
            <option value="critical">Critical</option>
          </select>
          <button className="primary" type="submit">Send Emergency Alert</button>
        </form>
        {status && <p style={{ marginTop: 12 }}>{status}</p>}
      </div>
    </div>
  );
}
