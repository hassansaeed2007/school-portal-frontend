import { useNavigate } from "react-router-dom";

const roleConfig = {
  Admin:   { color: "#1e3a8a", light: "#eff6ff" },
  Teacher: { color: "#065f46", light: "#f0fdf4" },
  Student: { color: "#7c2d12", light: "#fff7ed" },
};

export default function Navbar({ user }) {
  const navigate = useNavigate();
  const cfg = roleConfig[user?.role] || roleConfig.Admin;

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav style={{
      background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}dd)`,
      padding: "0 28px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      height: 64,
      boxShadow: "0 2px 20px rgba(0,0,0,0.15)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: "rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 800, color: "#fff", fontSize: 18
        }}>S</div>
        <div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 16, letterSpacing: -0.3 }}>
            School Portal
          </div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, marginTop: 1 }}>
            {user?.role} Dashboard
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{user?.name}</div>
          <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 11 }}>{user?.email}</div>
        </div>
        <div style={{
          width: 38, height: 38, borderRadius: "50%",
          background: "rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, fontWeight: 700, color: "#fff"
        }}>
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <button onClick={logout} style={{
          background: "rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.3)",
          color: "#fff", padding: "7px 16px",
          borderRadius: 8, cursor: "pointer",
          fontWeight: 600, fontSize: 13,
        }}>
          Logout
        </button>
      </div>
    </nav>
  );
}
