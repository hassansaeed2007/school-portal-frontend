// Shared UI components used across all portals

export function Card({ children, style = {} }) {
  return (
    <div className="card-hover" style={{
      background: "#fff", borderRadius: 14,
      padding: 24, boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
      border: "1px solid #f3f4f6", ...style
    }}>
      {children}
    </div>
  );
}

export function PageTitle({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 24 }} className="fade-in">
      <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>
        {title}
      </h2>
      {subtitle && <p style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>{subtitle}</p>}
    </div>
  );
}

export function StyledTable({ headers, rows, emptyMsg = "No data found." }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "linear-gradient(135deg, #1e3a8a, #4f46e5)" }}>
            {headers.map((h) => (
              <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#fff", fontWeight: 600, fontSize: 13, whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={headers.length} style={{ textAlign: "center", padding: 40, color: "#9ca3af", fontSize: 14 }}>
              {emptyMsg}
            </td></tr>
          ) : rows.map((row, i) => (
            <tr key={i} className="hoverable" style={{ background: i % 2 === 0 ? "#fafafa" : "#fff", transition: "background 0.15s" }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: "11px 16px", fontSize: 13, borderBottom: "1px solid #f3f4f6", color: "#374151" }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StatCard({ icon, label, value, color = "#4f46e5" }) {
  return (
    <div className="card-hover" style={{
      background: "#fff", borderRadius: 12, padding: "18px 22px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
      borderLeft: `4px solid ${color}`,
      display: "flex", alignItems: "center", gap: 16, minWidth: 160
    }}>
      <div style={{ fontSize: 32 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 800, color }}>{value}</div>
        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

export function Badge({ text, color = "#4f46e5" }) {
  const bg = color + "18";
  return (
    <span style={{ background: bg, color, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
      {text}
    </span>
  );
}

export function PrimaryBtn({ children, onClick, color = "#4f46e5", disabled = false, type = "button" }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      padding: "10px 22px",
      background: disabled ? "#d1d5db" : `linear-gradient(135deg, ${color}, ${color}cc)`,
      color: "#fff", border: "none", borderRadius: 9,
      fontWeight: 700, fontSize: 13, cursor: disabled ? "not-allowed" : "pointer",
      boxShadow: disabled ? "none" : `0 3px 12px ${color}44`,
      whiteSpace: "nowrap"
    }}>
      {children}
    </button>
  );
}

export function Input({ label, ...props }) {
  return (
    <div>
      {label && <label style={{ display: "block", fontWeight: 600, marginBottom: 5, fontSize: 13, color: "#374151" }}>{label}</label>}
      <input style={{
        width: "100%", padding: "10px 13px",
        border: "1.5px solid #e5e7eb", borderRadius: 8,
        fontSize: 14, boxSizing: "border-box", background: "#f9fafb"
      }} {...props} />
    </div>
  );
}

export function Select({ label, children, ...props }) {
  return (
    <div>
      {label && <label style={{ display: "block", fontWeight: 600, marginBottom: 5, fontSize: 13, color: "#374151" }}>{label}</label>}
      <select style={{
        width: "100%", padding: "10px 13px",
        border: "1.5px solid #e5e7eb", borderRadius: 8,
        fontSize: 14, boxSizing: "border-box", background: "#f9fafb", cursor: "pointer"
      }} {...props}>
        {children}
      </select>
    </div>
  );
}

export function TabBar({ tabs, active, onChange, color = "#4f46e5" }) {
  return (
    <div style={{ display: "flex", background: "#fff", borderBottom: "2px solid #f3f4f6", overflowX: "auto" }}>
      {tabs.map((tab) => (
        <button key={tab.key || tab} type="button"
          onClick={() => onChange(tab.key || tab)}
          style={{
            padding: "14px 20px", border: "none", background: "none", cursor: "pointer",
            fontWeight: (active === (tab.key || tab)) ? 700 : 500,
            color: (active === (tab.key || tab)) ? color : "#6b7280",
            borderBottom: (active === (tab.key || tab)) ? `3px solid ${color}` : "3px solid transparent",
            fontSize: 13, whiteSpace: "nowrap", transition: "all 0.2s",
            display: "flex", alignItems: "center", gap: 6
          }}>
          {tab.label || tab}
        </button>
      ))}
    </div>
  );
}
