import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import PasswordInput from "../components/PasswordInput";

export default function Login() {
  const [email, setEmail]     = useState("");
  const [password, setPass]   = useState("");
  const [loading, setLoading] = useState(false);
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
    } finally { setLoading(false); }
  };

  return (
    <div style={pageStyle}>
      {/* Left Panel */}
      <div style={leftPanel}>
        <div style={{ maxWidth: 400 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🏫</div>
          <h1 style={{ color: "#fff", fontSize: 32, fontWeight: 800, margin: "0 0 12px" }}>School Portal</h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, lineHeight: 1.6 }}>
            A complete school management system for Admins, Teachers, and Students.
          </p>
          <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 12 }}>
            {["📋 Manage attendance", "📝 Create tests & results", "📧 Email notifications", "🏫 Multi-school support"].map(f => (
              <div key={f} style={{ color: "rgba(255,255,255,0.9)", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={rightPanel}>
        <div style={formCard}>
          <h2 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 800, color: "#1a1a2e" }}>Welcome back</h2>
          <p style={{ margin: "0 0 28px", color: "#888", fontSize: 14 }}>Sign in to your account</p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Email Address</label>
              <input style={inputStyle} type="email" value={email}
                onChange={e => setEmail(e.target.value)} required placeholder="Enter your email" />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={labelStyle}>Password</label>
              <PasswordInput value={password} onChange={e => setPass(e.target.value)} placeholder="Enter your password" />
            </div>

            <div style={{ textAlign: "right", marginBottom: 22 }}>
              <Link to="/forgot-password" style={{ color: "#1e50a0", fontSize: 13, textDecoration: "none", fontWeight: 600 }}>
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={loading} style={btnStyle}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "#666" }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "#1e50a0", fontWeight: 700, textDecoration: "none" }}>Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const pageStyle  = { minHeight: "100vh", display: "flex", fontFamily: "'Segoe UI', sans-serif" };
const leftPanel  = { flex: 1, background: "linear-gradient(135deg, #1a1a2e 0%, #1e50a0 50%, #2d7dd2 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 48, minHeight: "100vh" };
const rightPanel = { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 32, background: "#f8faff" };
const formCard   = { background: "#fff", borderRadius: 20, padding: "44px 40px", boxShadow: "0 10px 40px rgba(0,0,0,0.08)", width: "100%", maxWidth: 420 };
const labelStyle = { display: "block", fontWeight: 600, marginBottom: 6, fontSize: 13, color: "#444" };
const inputStyle = { width: "100%", padding: "11px 14px", border: "1.5px solid #e8e8e8", borderRadius: 8, fontSize: 14, boxSizing: "border-box", outline: "none", transition: "border 0.2s", background: "#fafafa" };
const btnStyle   = { width: "100%", padding: "13px", background: "linear-gradient(135deg, #1e50a0, #2d7dd2)", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", letterSpacing: 0.5 };
