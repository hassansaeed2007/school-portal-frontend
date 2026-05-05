import { useState, useEffect } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function ManageTests() {
  const [subjects, setSubjects]     = useState([]);
  const [tests, setTests]           = useState([]);
  const [view, setView]             = useState("list"); // list | create | marks
  const [selectedTest, setSelectedTest] = useState(null);
  const [students, setStudents]     = useState([]);
  const [marksData, setMarksData]   = useState({});

  // Create test form
  const [form, setForm] = useState({ title: "", subjectId: "", totalMarks: "", date: new Date().toISOString().split("T")[0] });

  useEffect(() => {
    api.get("/teacher/subjects").then((r) => setSubjects(r.data));
    loadTests();
  }, []);

  const loadTests = () => api.get("/tests/teacher").then((r) => setTests(r.data));

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/tests", form);
      toast.success(data.message);
      setForm({ title: "", subjectId: "", totalMarks: "", date: new Date().toISOString().split("T")[0] });
      loadTests();
      setView("list");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed.");
    }
  };

  const openMarks = async (test) => {
    setSelectedTest(test);
    const { data } = await api.get(`/tests/${test._id}/students`);
    setStudents(data.students);
    // Pre-fill existing marks
    const init = {};
    data.students.forEach((s) => { init[s._id] = s.marksObtained ?? ""; });
    setMarksData(init);
    setView("marks");
  };

  const handleSaveMarks = async () => {
    const marks = Object.entries(marksData).map(([studentId, marksObtained]) => ({ studentId, marksObtained }));
    try {
      const { data } = await api.post(`/tests/${selectedTest._id}/marks`, { marks });
      toast.success(data.message);
      setView("list");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed.");
    }
  };

  // ── List View ──────────────────────────────────────────
  if (view === "list") return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={headingStyle}>Tests & Results</h3>
        <button onClick={() => setView("create")} style={btnStyle("#1a7a4a")}>+ Create Test</button>
      </div>

      <div style={cardStyle}>
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: "#1a7a4a", color: "#fff" }}>
              {["Test Title", "Subject", "Total Marks", "Date", "Students Marked", "Action"].map((h) => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tests.map((t, i) => (
              <tr key={t._id} style={{ background: i % 2 === 0 ? "#f4fff8" : "#fff" }}>
                <td style={tdStyle}>{t.title}</td>
                <td style={tdStyle}>{t.subjectId?.name}</td>
                <td style={tdStyle}>{t.totalMarks}</td>
                <td style={tdStyle}>{t.date}</td>
                <td style={tdStyle}>{t.results?.length || 0}</td>
                <td style={tdStyle}>
                  <button onClick={() => openMarks(t)} style={actionBtn("#1e50a0")}>Enter Marks</button>
                </td>
              </tr>
            ))}
            {tests.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: 24, color: "#888" }}>No tests created yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ── Create Test View ───────────────────────────────────
  if (view === "create") return (
    <div style={{ ...cardStyle, maxWidth: 560 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={headingStyle}>Create New Test</h3>
        <button onClick={() => setView("list")} style={{ background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: 13 }}>← Back</button>
      </div>
      <form onSubmit={handleCreate} style={{ display: "grid", gap: 14 }}>
        <div>
          <label style={labelStyle}>Test Title *</label>
          <input style={inputStyle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="e.g. Mid Term Exam" />
        </div>
        <div>
          <label style={labelStyle}>Subject *</label>
          <select style={inputStyle} value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })} required>
            <option value="">-- Select Subject --</option>
            {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Total Marks *</label>
          <input style={inputStyle} type="number" min="1" value={form.totalMarks} onChange={(e) => setForm({ ...form, totalMarks: e.target.value })} required placeholder="e.g. 100" />
        </div>
        <div>
          <label style={labelStyle}>Date *</label>
          <input style={inputStyle} type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
        </div>
        <button type="submit" style={btnStyle("#1a7a4a")}>Create Test</button>
      </form>
    </div>
  );

  // ── Enter Marks View ───────────────────────────────────
  if (view === "marks") return (
    <div style={cardStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <h3 style={headingStyle}>Enter Marks — {selectedTest?.title}</h3>
        <button onClick={() => setView("list")} style={{ background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: 13 }}>← Back</button>
      </div>
      <p style={{ color: "#555", fontSize: 13, marginBottom: 18 }}>
        Total Marks: <strong>{selectedTest?.totalMarks}</strong> &nbsp;|&nbsp; Date: <strong>{selectedTest?.date}</strong>
        &nbsp;|&nbsp; Students will be notified via email automatically.
      </p>

      <table style={tableStyle}>
        <thead>
          <tr style={{ background: "#1a7a4a", color: "#fff" }}>
            {["Student Name", "Roll Number", `Marks (out of ${selectedTest?.totalMarks})`, "Grade Preview"].map((h) => (
              <th key={h} style={thStyle}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((s, i) => {
            const m = Number(marksData[s._id]);
            const pct = selectedTest && m >= 0 ? (m / selectedTest.totalMarks) * 100 : null;
            const grade = pct !== null ? (pct >= 90 ? "A+" : pct >= 80 ? "A" : pct >= 70 ? "B" : pct >= 60 ? "C" : pct >= 50 ? "D" : "F") : "—";
            const gradeColor = grade === "F" ? "#c0392b" : grade === "D" ? "#e67e22" : "#1a7a4a";
            return (
              <tr key={s._id} style={{ background: i % 2 === 0 ? "#f4fff8" : "#fff" }}>
                <td style={tdStyle}>{s.name}</td>
                <td style={tdStyle}>{s.rollNumber}</td>
                <td style={tdStyle}>
                  <input
                    type="number" min="0" max={selectedTest?.totalMarks}
                    value={marksData[s._id] ?? ""}
                    onChange={(e) => setMarksData({ ...marksData, [s._id]: e.target.value })}
                    style={{ width: 80, padding: "6px 10px", border: "1px solid #ddd", borderRadius: 5, fontSize: 14, textAlign: "center" }}
                    placeholder="0"
                  />
                </td>
                <td style={{ ...tdStyle, fontWeight: "bold", color: gradeColor, fontSize: 16 }}>{grade}</td>
              </tr>
            );
          })}
          {students.length === 0 && (
            <tr><td colSpan={4} style={{ textAlign: "center", padding: 24, color: "#888" }}>No students enrolled in this subject.</td></tr>
          )}
        </tbody>
      </table>

      {students.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <button onClick={handleSaveMarks} style={btnStyle("#1a7a4a")}>
            Save Marks & Notify Students via Email
          </button>
        </div>
      )}
    </div>
  );
}

const cardStyle    = { background: "#fff", borderRadius: 10, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" };
const headingStyle = { margin: 0, color: "#1a7a4a", fontSize: 18 };
const labelStyle   = { display: "block", fontWeight: "600", marginBottom: 5, fontSize: 13 };
const inputStyle   = { width: "100%", padding: "9px 12px", border: "1px solid #ddd", borderRadius: 6, fontSize: 14, boxSizing: "border-box" };
const btnStyle     = (bg) => ({ padding: "10px 24px", background: bg, color: "#fff", border: "none", borderRadius: 6, fontWeight: "bold", cursor: "pointer", fontSize: 14 });
const tableStyle   = { width: "100%", borderCollapse: "collapse" };
const thStyle      = { padding: "11px 14px", textAlign: "left", fontWeight: "600", fontSize: 13 };
const tdStyle      = { padding: "10px 14px", fontSize: 13, borderBottom: "1px solid #eee" };
const actionBtn    = (bg) => ({ padding: "5px 14px", background: bg, color: "#fff", border: "none", borderRadius: 5, cursor: "pointer", fontWeight: "bold", fontSize: 12 });
