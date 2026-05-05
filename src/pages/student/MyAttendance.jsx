import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function MyAttendance() {
  const [subjects, setSubjects]   = useState([]);
  const [selected, setSelected]   = useState("");
  const [data, setData]           = useState(null);

  useEffect(() => {
    api.get("/student/profile").then((r) => {
      const subs = r.data.joinedSubjectIds || [];
      setSubjects(subs);
      if (subs.length > 0) setSelected(subs[0]._id);
    });
  }, []);

  useEffect(() => {
    if (!selected) return;
    api.get(`/student/attendance/${selected}`).then((r) => setData(r.data));
  }, [selected]);

  const pct = data?.summary?.percentage ?? 0;
  const pctColor = pct >= 75 ? "#1a7a4a" : "#c0392b";

  return (
    <div style={cardStyle}>
      <h3 style={headingStyle}>My Attendance</h3>

      <div style={{ marginBottom: 18 }}>
        <label style={labelStyle}>Select Subject</label>
        <select style={selectStyle} value={selected} onChange={(e) => setSelected(e.target.value)}>
          {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
      </div>

      {data && (
        <>
          {/* Summary */}
          <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
            {[
              { label: "Total Classes", value: data.summary.total, color: "#1e50a0" },
              { label: "Present",       value: data.summary.present, color: "#1a7a4a" },
              { label: "Absent",        value: data.summary.absent,  color: "#c0392b" },
              { label: "Percentage",    value: pct + "%",            color: pctColor },
            ].map((item) => (
              <div key={item.label} style={{ background: "#f9f9f9", border: `2px solid ${item.color}`, borderRadius: 8, padding: "12px 20px", textAlign: "center", minWidth: 100 }}>
                <div style={{ fontSize: 22, fontWeight: "bold", color: item.color }}>{item.value}</div>
                <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>{item.label}</div>
              </div>
            ))}
          </div>

          {/* Records */}
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: "#7a3a1a", color: "#fff" }}>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.records.map((r, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "#fff8f0" : "#fff" }}>
                  <td style={tdStyle}>{r.date}</td>
                  <td style={{ ...tdStyle, color: r.present ? "#1a7a4a" : "#c0392b", fontWeight: "bold" }}>
                    {r.present ? "Present" : "Absent"}
                  </td>
                </tr>
              ))}
              {data.records.length === 0 && (
                <tr><td colSpan={2} style={{ textAlign: "center", padding: 24, color: "#888" }}>No attendance records yet.</td></tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

const cardStyle    = { background: "#fff", borderRadius: 10, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" };
const headingStyle = { margin: "0 0 18px", color: "#7a3a1a", fontSize: 18 };
const labelStyle   = { display: "block", fontWeight: "600", marginBottom: 5, fontSize: 13 };
const selectStyle  = { padding: "9px 12px", border: "1px solid #ddd", borderRadius: 6, fontSize: 14, minWidth: 220 };
const tableStyle   = { width: "100%", borderCollapse: "collapse" };
const thStyle      = { padding: "11px 14px", textAlign: "left", fontWeight: "600", fontSize: 13 };
const tdStyle      = { padding: "10px 14px", fontSize: 13, borderBottom: "1px solid #eee" };
