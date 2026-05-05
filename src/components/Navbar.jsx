import { useNavigate } from "react-router-dom";

export default function Navbar({ user }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const roleColors = { Admin: "#1e50a0", Teacher: "#1a7a4a", Student: "#7a3a1a" };
  const bg = roleColors[user?.role] || "#1e50a0";

  return (
    <nav style={{ background: bg, color: "#fff", padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <span style={{ fontWeight: "bold", fontSize: 18 }}>
          {user?.role === "Admin" ? user?.name : "School Portal"}
        </span>
        <span style={{ marginLeft: 16, background: "rgba(255,255,255,0.2)", padding: "3px 10px", borderRadius: 12, fontSize: 13 }}>
          {user?.role}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 14 }}>{user?.name}</span>
        <button
          onClick={logout}
          style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", padding: "6px 16px", borderRadius: 6, cursor: "pointer", fontWeight: "bold" }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
