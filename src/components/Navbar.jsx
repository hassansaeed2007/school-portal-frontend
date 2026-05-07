import { useNavigate } from "react-router-dom";

const roleConfig = {
  Admin:   { gradient: "linear-gradient(135deg, #1e3a8a, #3730a3)" },
  Teacher: { gradient: "linear-gradient(135deg, #064e3b, #065f46)" },
  Student: { gradient: "linear-gradient(135deg, #7c2d12, #92400e)" },
};

export default function Navbar({ user }) {
  const navigate = useNavigate();
  const cfg = roleConfig[user?.role] || roleConfig.Admin;

  return (
    <nav style={{
      background: cfg.gradient,
      padding: "0 24px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      height: 60, position: "sticky", top: 0, zIndex: 100,
      boxShadow: "0 2px 20px rgba(0,0,0,0.3)",
      backdropFilter: "blur(10px)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9,
          background: "rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 800, color: "#fff", fontSize: 16,
        }}>S</div>
        <div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>School Portal</div>
          <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 11 }}>{user?.role} Dashboard</div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ textAlign: "right" }} className="hide-mobile">
          <div style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>{user?.name}</div>
          <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 11 }}>{user?.email}</div>
        </div>
        <div style={{
          width: 34, height: 34, borderRadius: "50%",
          background: "rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 800, color: "#fff", fontSize: 15,
        }}>
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <button onClick={() => { localStorage.clear(); navigate("/"); }} style={{
          background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.25)",
          color: "#fff", padding: "6px 14px",
          borderRadius: 8, cursor: "pointer",
          fontWeight: 600, fontSize: 12,
        }}>
          Logout
        </button>
      </div>
    </nav>
  );
}
