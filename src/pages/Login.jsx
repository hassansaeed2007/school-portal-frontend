import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import VideoBackground from "../components/VideoBackground";

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);
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
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: "20px" }}>
      <VideoBackground src="/vedio 1.mp4" opacity={0.6} />

      <div className="glass fade-up" style={{
        position: "relative", zIndex: 2,
        width: "100%", maxWidth: 420,
        padding: "44px 40px",
        boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
            fontSize: 28, fontWeight: 800, color: "#fff"
          }}>S</div>
          <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>School Portal</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginTop: 6 }}>Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Email */}
          <div>
            <label style={labelStyle}>Email Address</label>
            <input
              style={inputStyle}
              type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              required placeholder="you@school.edu"
            />
          </div>

          {/* Password */}
          <div>
            <label style={labelStyle}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                style={{ ...inputStyle, paddingRight: 48 }}
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required placeholder="Enter password"
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 13, padding: 0 }}>
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div style={{ textAlign: "right", marginTop: -8 }}>
            <Link to="/forgot-password" style={{ color: "#a78bfa", fontSize: 13, textDecoration: "none" }}>
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? <span style={spinnerStyle} /> : null}
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.45)", fontSize: 13, marginTop: 24 }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#a78bfa", fontWeight: 700, textDecoration: "none" }}>Sign Up</Link>
        </p>
      </div>

      <style>{`
        input::placeholder { color: rgba(255,255,255,0.3); }
        input:focus { border-color: rgba(139,92,246,0.7) !important; box-shadow: 0 0 0 3px rgba(139,92,246,0.2); }
        @media (max-width: 480px) {
          .glass { padding: 32px 24px !important; }
        }
      `}</style>
    </div>
  );
}

const labelStyle = { display: "block", color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600, marginBottom: 7 };
const inputStyle = {
  width: "100%", padding: "13px 16px",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 12, color: "#fff", fontSize: 14,
  boxSizing: "border-box", transition: "all 0.2s",
};
const btnStyle = {
  width: "100%", padding: "14px",
  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  color: "#fff", border: "none", borderRadius: 12,
  fontSize: 15, fontWeight: 700, cursor: "pointer",
  boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
  marginTop: 4,
};
const spinnerStyle = {
  width: 18, height: 18,
  border: "2px solid rgba(255,255,255,0.3)",
  borderTop: "2px solid #fff",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
  display: "inline-block",
};
