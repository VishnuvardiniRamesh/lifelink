import { useState } from "react";
import { Link } from "react-router-dom";
import client from "../api/client.js";

export default function Login() {
  const [role, setRole] = useState("hospital");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const { data } = await client.post("/auth/login", { email, password, role });
      localStorage.setItem("lifelink_token", data.token);
      setStatus(`Logged in as ${role}. You can now use the ${role === "hospital" ? "'Raise Emergency Request'" : "donor"} features.`);
    } catch (err) {
      if (err.response?.data?.message) {
        setStatus(err.response.data.message);
      } else if (err.code === "ERR_NETWORK" || !err.response) {
        setStatus("Cannot reach backend server. Please make sure the backend is running on port 5000.");
      } else {
        setStatus("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Log In</h2>
        <form onSubmit={submit}>
          <label>Account Type</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="hospital">Hospital</option>
            <option value="donor">Donor</option>
          </select>
          <label>Email</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label>Password</label>
          <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="primary" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
        {status && <p style={{ marginTop: 12, color: status.startsWith("Logged in") ? "green" : "#e53e3e" }}>{status}</p>}
        <p style={{ marginTop: 16, fontSize: "0.9rem" }}>
          Don't have an account?{" "}
          <Link to={role === "hospital" ? "/hospital/register" : "/donor/register"}>
            Register as {role === "hospital" ? "Hospital" : "Donor"}
          </Link>
        </p>
      </div>
    </div>
  );
}

