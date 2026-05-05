import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "Admin")   navigate("/admin");
      if (data.user.role === "Teacher") navigate("/teacher");
      if (data.user.role === "Student") navigate("/student");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 4px 24px rgba(0,0,0,0.1)", width: 400, overflow: "hidden" }}>
        {/* Header */}
        <div style={{ background: "#1e50a0", padding: "28px 0", textAlign: "center" }}>
          <h2 style={{ color: "#fff", margin: 0, fontSize: 22 }}>School Management Portal</h2>
          <p style={{ color: "#c0d4ff", margin: "6px 0 0", fontSize: 13 }}>Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={{ padding: "32px 36px" }}>
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Email Address</label>
            <input style={inputStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter your email" />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Password</label>
            <input style={inputStyle} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password" />
          </div>
          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? "Signing in..." : "Login"}
          </button>

          <p style={{ textAlign: "center", fontSize: 13, color: "#666", marginTop: 10 }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "#1e50a0", fontWeight: "bold", textDecoration: "none" }}>Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

const labelStyle = { display: "block", fontWeight: "600", marginBottom: 6, fontSize: 13, color: "#333" };
const inputStyle = { width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: 6, fontSize: 14, boxSizing: "border-box", outline: "none" };
const btnStyle   = { width: "100%", padding: "12px", background: "#1e50a0", color: "#fff", border: "none", borderRadius: 6, fontSize: 15, fontWeight: "bold", cursor: "pointer" };
