import { useState, useEffect } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function BrowseSubjects() {
  const [subjects, setSubjects] = useState([]);

  const load = () => api.get("/student/subjects").then((r) => setSubjects(r.data));
  useEffect(() => { load(); }, []);

  const join = async (id, name) => {
    try {
      const { data } = await api.post(`/student/subjects/${id}/join`);
      toast.success(data.message);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed.");
    }
  };

  const leave = async (id, name) => {
    if (!window.confirm(`Leave "${name}"?`)) return;
    try {
      const { data } = await api.delete(`/student/subjects/${id}/leave`);
      toast.success(data.message);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed.");
    }
  };

  const joined = subjects.filter((s) => s.isJoined).length;

  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <h3 style={headingStyle}>Available Subjects</h3>
        <span style={{ background: "#fff3e0", color: "#7a3a1a", padding: "5px 14px", borderRadius: 20, fontWeight: "bold", fontSize: 13 }}>
          Enrolled: {joined} / 8
        </span>
      </div>
      <table style={tableStyle}>
        <thead>
          <tr style={{ background: "#7a3a1a", color: "#fff" }}>
            {["Subject Name", "Teacher", "Department", "Credit Hours", "Enrolled", "Action"].map((h) => (
              <th key={h} style={thStyle}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {subjects.map((s, i) => (
            <tr key={s._id} style={{ background: s.isJoined ? "#fff8f0" : i % 2 === 0 ? "#fafafa" : "#fff" }}>
              <td style={tdStyle}>{s.name}</td>
              <td style={tdStyle}>{s.teacherName}</td>
              <td style={tdStyle}>{s.department}</td>
              <td style={tdStyle}>{s.creditHours}</td>
              <td style={tdStyle}>{s.enrolledCount}</td>
              <td style={tdStyle}>
                {s.isJoined ? (
                  <button onClick={() => leave(s._id, s.name)} style={actionBtn("#c0392b")}>Leave</button>
                ) : (
                  <button onClick={() => join(s._id, s.name)} style={actionBtn("#1a7a4a")}>Join</button>
                )}
              </td>
            </tr>
          ))}
          {subjects.length === 0 && (
            <tr><td colSpan={6} style={{ textAlign: "center", padding: 24, color: "#888" }}>No subjects available yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const cardStyle    = { background: "#fff", borderRadius: 10, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" };
const headingStyle = { margin: 0, color: "#7a3a1a", fontSize: 18 };
const tableStyle   = { width: "100%", borderCollapse: "collapse" };
const thStyle      = { padding: "11px 14px", textAlign: "left", fontWeight: "600", fontSize: 13 };
const tdStyle      = { padding: "10px 14px", fontSize: 13, borderBottom: "1px solid #eee" };
const actionBtn    = (bg) => ({ padding: "5px 14px", background: bg, color: "#fff", border: "none", borderRadius: 5, cursor: "pointer", fontWeight: "bold", fontSize: 12 });
