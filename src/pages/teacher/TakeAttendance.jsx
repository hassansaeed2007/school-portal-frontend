import { useState, useEffect } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function TakeAttendance() {
  const [subjects, setSubjects]   = useState([]);
  const [selected, setSelected]   = useState("");
  const [date, setDate]           = useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents]   = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading]     = useState(false);

  useEffect(() => {
    api.get("/teacher/subjects").then((r) => {
      setSubjects(r.data);
      if (r.data.length > 0) setSelected(r.data[0]._id);
    });
  }, []);

  const loadStudents = async () => {
    if (!selected) return;
    const { data } = await api.get(`/teacher/subjects/${selected}/students`);
    setStudents(data);
    // Default all present
    const init = {};
    data.forEach((s) => (init[s._id] = true));
    setAttendance(init);
  };

  const toggle = (id) => setAttendance((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleSave = async () => {
    if (students.length === 0) { toast.error("Load students first."); return; }
    setLoading(true);
    try {
      const records = students.map((s) => ({ studentId: s._id, present: attendance[s._id] ?? true }));
      await api.post("/teacher/attendance", { subjectId: selected, date, records });
      toast.success("Attendance saved! Absent students notified via email.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={cardStyle}>
      <h3 style={headingStyle}>Take Attendance</h3>

      <div style={{ display: "flex", gap: 16, marginBottom: 18, flexWrap: "wrap" }}>
        <div>
          <label style={labelStyle}>Subject</label>
          <select style={selectStyle} value={selected} onChange={(e) => setSelected(e.target.value)}>
            {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Date</label>
          <input style={selectStyle} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <button onClick={loadStudents} style={btnStyle("#1a7a4a")}>Load Students</button>
        </div>
      </div>

      {students.length > 0 && (
        <>
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: "#1a7a4a", color: "#fff" }}>
                {["Name", "Roll Number", "Present"].map((h) => <th key={h} style={thStyle}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={s._id} style={{ background: i % 2 === 0 ? "#f4fff8" : "#fff" }}>
                  <td style={tdStyle}>{s.name}</td>
                  <td style={tdStyle}>{s.rollNumber}</td>
                  <td style={tdStyle}>
                    <input type="checkbox" checked={attendance[s._id] ?? true} onChange={() => toggle(s._id)}
                      style={{ width: 18, height: 18, cursor: "pointer" }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 18 }}>
            <button onClick={handleSave} disabled={loading} style={btnStyle("#1a7a4a")}>
              {loading ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const cardStyle    = { background: "#fff", borderRadius: 10, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" };
const headingStyle = { margin: "0 0 18px", color: "#1a7a4a", fontSize: 18 };
const labelStyle   = { display: "block", fontWeight: "600", marginBottom: 5, fontSize: 13 };
const selectStyle  = { padding: "9px 12px", border: "1px solid #ddd", borderRadius: 6, fontSize: 14 };
const btnStyle     = (bg) => ({ padding: "10px 22px", background: bg, color: "#fff", border: "none", borderRadius: 6, fontWeight: "bold", cursor: "pointer", fontSize: 14 });
const tableStyle   = { width: "100%", borderCollapse: "collapse" };
const thStyle      = { padding: "11px 14px", textAlign: "left", fontWeight: "600", fontSize: 13 };
const tdStyle      = { padding: "10px 14px", fontSize: 13, borderBottom: "1px solid #eee" };
