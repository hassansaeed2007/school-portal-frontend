import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function MySubjects() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get("/student/profile").then((r) => setProfile(r.data));
  }, []);

  const subjects = profile?.joinedSubjectIds || [];

  return (
    <div style={cardStyle}>
      <h3 style={headingStyle}>My Enrolled Subjects ({subjects.length} / 8)</h3>
      <table style={tableStyle}>
        <thead>
          <tr style={{ background: "#7a3a1a", color: "#fff" }}>
            {["Subject Name", "Credit Hours"].map((h) => <th key={h} style={thStyle}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {subjects.map((s, i) => (
            <tr key={s._id} style={{ background: i % 2 === 0 ? "#fff8f0" : "#fff" }}>
              <td style={tdStyle}>{s.name}</td>
              <td style={tdStyle}>{s.creditHours}</td>
            </tr>
          ))}
          {subjects.length === 0 && (
            <tr><td colSpan={2} style={{ textAlign: "center", padding: 24, color: "#888" }}>You have not joined any subjects yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const cardStyle    = { background: "#fff", borderRadius: 10, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" };
const headingStyle = { margin: "0 0 18px", color: "#7a3a1a", fontSize: 18 };
const tableStyle   = { width: "100%", borderCollapse: "collapse" };
const thStyle      = { padding: "11px 14px", textAlign: "left", fontWeight: "600", fontSize: 13 };
const tdStyle      = { padding: "10px 14px", fontSize: 13, borderBottom: "1px solid #eee" };
