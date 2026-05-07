// Shared UI components - glassmorphism style for inner pages

export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.92)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderRadius: 16,
      padding: 24,
      boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
      border: "1px solid rgba(255,255,255,0.6)",
      ...style
    }}>
      {children}
    </div>
  );
}

export function PageTitle({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: 0 }}>{title}</h2>
      {subtitle && <p style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>{subtitle}</p>}
    </div>
  );
}

export function StyledTable({ headers, rows, emptyMsg = "No data found." }) {
  return (
    <div style={{ overflowX: "auto", borderRadius: 10, overflow: "hidden" }}>
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
            <tr key={i} className="table-row" style={{ background: i % 2 === 0 ? "#f8faff" : "#fff" }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: "11px 16px", fontSize: 13, borderBottom: "1px solid #f0f0f0", color: "#374151" }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StatCard({ label, value, color = "#4f46e5" }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.92)",
      backdropFilter: "blur(16px)",
      borderRadius: 14, padding: "18px 22px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
      borderLeft: `4px solid ${color}`,
      minWidth: 140, flex: 1,
    }}>
      <div style={{ fontSize: 26, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3 }}>{label}</div>
    </div>
  );
}

export function Badge({ text, color = "#4f46e5" }) {
  return (
    <span style={{ background: color + "18", color, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
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
      whiteSpace: "nowrap",
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
        fontSize: 14, boxSizing: "border-box", background: "#f9fafb",
        transition: "all 0.2s",
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
        fontSize: 14, boxSizing: "border-box", background: "#f9fafb", cursor: "pointer",
      }} {...props}>
        {children}
      </select>
    </div>
  );
}

export function TabBar({ tabs, active, onChange, color = "#4f46e5" }) {
  return (
    <div style={{
      display: "flex",
      background: "rgba(255,255,255,0.85)",
      backdropFilter: "blur(12px)",
      borderRadius: 12,
      padding: 4, gap: 2,
      overflowX: "auto",
      boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
    }}>
      {tabs.map((tab) => {
        const key = tab.key || tab;
        const label = tab.label || tab;
        const isActive = active === key;
        return (
          <button key={key} type="button" onClick={() => onChange(key)} style={{
            padding: "9px 18px", border: "none", borderRadius: 9,
            background: isActive ? color : "transparent",
            color: isActive ? "#fff" : "#6b7280",
            fontWeight: isActive ? 700 : 500,
            fontSize: 13, cursor: "pointer", whiteSpace: "nowrap",
            boxShadow: isActive ? `0 2px 10px ${color}44` : "none",
            transition: "all 0.2s",
          }}>
            {label}
          </button>
        );
      })}
    </div>
  );
}
