import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function ViewStudents() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    api.get("/admin/students").then((r) => setStudents(r.data));
  }, []);

  return (
    <div style={cardStyle}>
      <h3 style={headingStyle}>All Students ({students.length})</h3>
      <table style={tableStyle}>
        <thead>
          <tr style={{ background: "#1e50a0", color: "#fff" }}>
            {["Name", "Email", "Roll Number", "Semester", "Department", "Subjects"].map((h) => (
              <th key={h} style={thStyle}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((s, i) => (
            <tr key={s._id} style={{ background: i % 2 === 0 ? "#f8faff" : "#fff" }}>
              <td style={tdStyle}>{s.name}</td>
              <td style={tdStyle}>{s.email}</td>
              <td style={tdStyle}>{s.rollNumber}</td>
              <td style={tdStyle}>{s.semester || "—"}</td>
              <td style={tdStyle}>{s.department || "—"}</td>
              <td style={tdStyle}>{s.joinedSubjectIds?.length || 0} / 8</td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr><td colSpan={6} style={{ textAlign: "center", padding: 24, color: "#888" }}>No students added yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const cardStyle    = { background: "#fff", borderRadius: 10, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" };
const headingStyle = { margin: "0 0 20px", color: "#1e50a0", fontSize: 18 };
const tableStyle   = { width: "100%", borderCollapse: "collapse" };
const thStyle      = { padding: "11px 14px", textAlign: "left", fontWeight: "600", fontSize: 13 };
const tdStyle      = { padding: "10px 14px", fontSize: 13, borderBottom: "1px solid #eee" };
