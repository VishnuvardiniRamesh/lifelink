import { useState } from "react";
import client from "../api/client.js";

const BLOOD_TYPES = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

export default function DonorRegister() {
  const [form, setForm] = useState({
    name: "", email: "", password: "", phone: "", bloodType: "O+",
  });
  const [status, setStatus] = useState(null);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setStatus("Getting your location...");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { data } = await client.post("/auth/donor/register", {
            ...form,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          localStorage.setItem("lifelink_token", data.token);
          setStatus("Registered successfully. You're on the donor network!");
        } catch (err) {
          setStatus(err.response?.data?.message || "Registration failed");
        }
      },
      () => setStatus("Location permission is needed to match you to nearby requests.")
    );
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Register as a Donor</h2>
        <form onSubmit={submit}>
          <label>Full Name</label>
          <input required value={form.name} onChange={update("name")} />
          <label>Email</label>
          <input required type="email" value={form.email} onChange={update("email")} />
          <label>Password</label>
          <input required type="password" value={form.password} onChange={update("password")} />
          <label>Phone</label>
          <input required value={form.phone} onChange={update("phone")} />
          <label>Blood Type</label>
          <select value={form.bloodType} onChange={update("bloodType")}>
            {BLOOD_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
          <button className="primary" type="submit">Register</button>
        </form>
        {status && <p style={{ marginTop: 12 }}>{status}</p>}
      </div>
    </div>
  );
}
