import { useState } from "react";
import client from "../api/client.js";

export default function Login() {
  const [role, setRole] = useState("hospital");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await client.post("/auth/login", { email, password, role });
      localStorage.setItem("lifelink_token", data.token);
      setStatus(`Logged in as ${role}. You can now use the ${role === "hospital" ? "'Raise Emergency Request'" : "donor"} features.`);
    } catch (err) {
      setStatus(err.response?.data?.message || "Login failed");
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
          <button className="primary" type="submit">Log In</button>
        </form>
        {status && <p style={{ marginTop: 12 }}>{status}</p>}
      </div>
    </div>
  );
}
