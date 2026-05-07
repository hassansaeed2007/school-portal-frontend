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
    <div style={styles.page}>
      {/* Floating animated shapes */}
      <div style={{ ...styles.shape, width: 300, height: 300, top: "-80px", left: "-80px", animationDuration: "8s" }} />
      <div style={{ ...styles.shape, width: 200, height: 200, bottom: "60px", right: "-60px", animationDuration: "6s" }} />

      {/* Card */}
      <div style={styles.card} className="login-card">
        {/* Logo / Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>School Portal</h2>
          <p style={styles.subtitle}>Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <input style={styles.input} type="email" value={email}
              onChange={(e) => setEmail(e.target.value)} required placeholder="Email Address" />
          </div>

          <div style={styles.inputGroup}>
            <input style={styles.input} type="password" value={password}
              onChange={(e) => setPassword(e.target.value)} required placeholder="Password" />
          </div>

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? <span style={styles.spinner} /> : null}
            {loading ? "Signing in..." : "Login →"}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{" "}
          <Link to="/signup" style={styles.link}>Sign Up</Link>
        </p>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .login-card {
          animation: fadeSlideUp 0.7s ease forwards;
        }
        input:focus {
          outline: none;
          border-color: #6c63ff !important;
          box-shadow: 0 0 0 3px rgba(108,99,255,0.2);
        }
        button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(108,99,255,0.5) !important;
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh", display: "flex", alignItems: "center",
    justifyContent: "center", position: "relative", overflow: "hidden",
    background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
  },
  shape: {
    position: "absolute", borderRadius: "50%",
    background: "rgba(108,99,255,0.15)",
    animation: "float 8s ease-in-out infinite",
    zIndex: 1,
  },
  card: {
    position: "relative", zIndex: 2,
    background: "rgba(255,255,255,0.07)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 24, padding: "40px 36px",
    width: "100%", maxWidth: 420,
    boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
  },
  header: { textAlign: "center", marginBottom: 32 },
  title: { color: "#fff", fontSize: 26, fontWeight: 800, margin: "0 0 6px" },
  subtitle: { color: "rgba(255,255,255,0.6)", fontSize: 14, margin: 0 },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  inputGroup: {
    display: "flex", alignItems: "center",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 12, padding: "0 16px", transition: "all 0.3s",
  },
  input: {
    flex: 1, background: "none", border: "none", color: "#fff",
    fontSize: 14, padding: "14px 0", outline: "none",
  },
  btn: {
    background: "linear-gradient(135deg, #6c63ff, #a855f7)",
    color: "#fff", border: "none", borderRadius: 12,
    padding: "14px", fontSize: 16, fontWeight: 700,
    cursor: "pointer", transition: "all 0.3s",
    boxShadow: "0 4px 15px rgba(108,99,255,0.4)",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
  },
  spinner: {
    width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid #fff", borderRadius: "50%",
    animation: "spin 0.8s linear infinite", display: "inline-block",
  },
  footer: { textAlign: "center", color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 24 },
  link: { color: "#a78bfa", fontWeight: 700, textDecoration: "none" },
};
