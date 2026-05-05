import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function MyStudents() {
  const [subjects, setSubjects]   = useState([]);
  const [selected, setSelected]   = useState("");
  const [students, setStudents]   = useState([]);

  useEffect(() => {
    api.get("/teacher/subjects").then((r) => {
      setSubjects(r.data);
      if (r.data.length > 0) setSelected(r.data[0]._id);
    });
  }, []);

  useEffect(() => {
    if (!selected) return;
    api.get(`/teacher/subjects/${selected}/students`).then((r) => setStudents(r.data));
  }, [selected]);

  return (
    <div style={cardStyle}>
      <h3 style={headingStyle}>Enrolled Students</h3>
      <div style={{ marginBottom: 18 }}>
        <label style={labelStyle}>Select Subject</label>
        <select style={selectStyle} value={selected} onChange={(e) => setSelected(e.target.value)}>
          {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
      </div>
      <p style={{ color: "#555", fontSize: 13, marginBottom: 12 }}>Total enrolled: <strong>{students.length}</strong></p>
      <table style={tableStyle}>
        <thead>
          <tr style={{ background: "#1a7a4a", color: "#fff" }}>
            {["Name", "Email", "Roll Number", "Semester", "Department"].map((h) => (
              <th key={h} style={thStyle}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((s, i) => (
            <tr key={s._id} style={{ background: i % 2 === 0 ? "#f4fff8" : "#fff" }}>
              <td style={tdStyle}>{s.name}</td>
              <td style={tdStyle}>{s.email}</td>
              <td style={tdStyle}>{s.rollNumber}</td>
              <td style={tdStyle}>{s.semester || "—"}</td>
              <td style={tdStyle}>{s.department || "—"}</td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr><td colSpan={5} style={{ textAlign: "center", padding: 24, color: "#888" }}>No students enrolled yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const cardStyle    = { background: "#fff", borderRadius: 10, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" };
const headingStyle = { margin: "0 0 18px", color: "#1a7a4a", fontSize: 18 };
const labelStyle   = { display: "block", fontWeight: "600", marginBottom: 5, fontSize: 13 };
const selectStyle  = { padding: "9px 12px", border: "1px solid #ddd", borderRadius: 6, fontSize: 14, minWidth: 220 };
const tableStyle   = { width: "100%", borderCollapse: "collapse" };
const thStyle      = { padding: "11px 14px", textAlign: "left", fontWeight: "600", fontSize: 13 };
const tdStyle      = { padding: "10px 14px", fontSize: 13, borderBottom: "1px solid #eee" };
