import { useState, useEffect } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function AddSubject() {
  const [name, setName]           = useState("");
  const [creditHours, setCreditHours] = useState("3");
  const [subjects, setSubjects]   = useState([]);
  const [loading, setLoading]     = useState(false);

  const loadSubjects = () => api.get("/teacher/subjects").then((r) => setSubjects(r.data));
  useEffect(() => { loadSubjects(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/teacher/subjects", { name, creditHours });
      toast.success(data.message);
      setName(""); setCreditHours("3");
      loadSubjects();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={cardStyle}>
        <h3 style={headingStyle}>Add New Subject</h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 16, alignItems: "flex-end" }}>
          <div style={{ flex: 2 }}>
            <label style={labelStyle}>Subject Name</label>
            <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Data Structures" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Credit Hours</label>
            <input style={inputStyle} value={creditHours} onChange={(e) => setCreditHours(e.target.value)} placeholder="3" />
          </div>
          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? "Adding..." : "Add Subject"}
          </button>
        </form>
      </div>

      <div style={{ ...cardStyle, marginTop: 20 }}>
        <h3 style={headingStyle}>My Subjects ({subjects.length})</h3>
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: "#1a7a4a", color: "#fff" }}>
              {["Subject Name", "Credit Hours", "Enrolled Students"].map((h) => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subjects.map((s, i) => (
              <tr key={s._id} style={{ background: i % 2 === 0 ? "#f4fff8" : "#fff" }}>
                <td style={tdStyle}>{s.name}</td>
                <td style={tdStyle}>{s.creditHours}</td>
                <td style={tdStyle}>{s.enrolledStudentIds?.length || 0}</td>
              </tr>
            ))}
            {subjects.length === 0 && (
              <tr><td colSpan={3} style={{ textAlign: "center", padding: 24, color: "#888" }}>No subjects yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const cardStyle    = { background: "#fff", borderRadius: 10, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" };
const headingStyle = { margin: "0 0 18px", color: "#1a7a4a", fontSize: 18 };
const labelStyle   = { display: "block", fontWeight: "600", marginBottom: 5, fontSize: 13 };
const inputStyle   = { width: "100%", padding: "9px 12px", border: "1px solid #ddd", borderRadius: 6, fontSize: 14, boxSizing: "border-box" };
const btnStyle     = { padding: "10px 24px", background: "#1a7a4a", color: "#fff", border: "none", borderRadius: 6, fontWeight: "bold", cursor: "pointer", fontSize: 14, whiteSpace: "nowrap" };
const tableStyle   = { width: "100%", borderCollapse: "collapse" };
const thStyle      = { padding: "11px 14px", textAlign: "left", fontWeight: "600", fontSize: 13 };
const tdStyle      = { padding: "10px 14px", fontSize: 13, borderBottom: "1px solid #eee" };
