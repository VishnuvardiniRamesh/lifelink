import { useState } from "react";
import client from "../api/client.js";

export default function HospitalRegister() {
  const [form, setForm] = useState({
    name: "", email: "", password: "", phone: "", address: "",
  });
  const [status, setStatus] = useState(null);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setStatus("Getting hospital location...");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { data } = await client.post("/auth/hospital/register", {
            ...form,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          localStorage.setItem("lifelink_token", data.token);
          setStatus("Hospital registered and logged in. You can now raise emergency requests.");
        } catch (err) {
          setStatus(err.response?.data?.message || "Registration failed");
        }
      },
      () => setStatus("Location permission is needed to register a hospital.")
    );
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Register a Hospital</h2>
        <form onSubmit={submit}>
          <label>Hospital Name</label>
          <input required value={form.name} onChange={update("name")} />
          <label>Email</label>
          <input required type="email" value={form.email} onChange={update("email")} />
          <label>Password</label>
          <input required type="password" value={form.password} onChange={update("password")} />
          <label>Phone</label>
          <input required value={form.phone} onChange={update("phone")} />
          <label>Address</label>
          <input value={form.address} onChange={update("address")} />
          <button className="primary" type="submit">Register Hospital</button>
        </form>
        {status && <p style={{ marginTop: 12 }}>{status}</p>}
      </div>
    </div>
  );
}
