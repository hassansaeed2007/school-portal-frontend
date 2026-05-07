import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function MyResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/tests/student")
      .then((r) => setResults(r.data))
      .finally(() => setLoading(false));
  }, []);

  const gradeColor = (g) => {
    if (!g || g === "N/A") return "#888";
    if (g === "F") return "#c0392b";
    if (g === "D") return "#e67e22";
    if (g === "C") return "#f39c12";
    return "#1a7a4a";
  };

  if (loading) return <p style={{ padding: 24, color: "#888" }}>Loading results...</p>;

  return (
    <div style={cardStyle}>
      <h3 style={headingStyle}>My Test Results</h3>

      {results.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: "#888" }}>
          <p>No results announced yet.</p>
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
            {[
              { label: "Tests Taken",  value: results.length,                                          color: "#1e50a0" },
              { label: "Average %",    value: Math.round(results.reduce((a, r) => a + (r.percentage || 0), 0) / results.length) + "%", color: "#1a7a4a" },
              { label: "Highest",      value: Math.max(...results.map((r) => r.percentage || 0)) + "%", color: "#7a3a1a" },
            ].map((item) => (
              <div key={item.label} style={{ background: "#f9f9f9", border: `2px solid ${item.color}`, borderRadius: 8, padding: "12px 20px", textAlign: "center", minWidth: 110 }}>
                <div style={{ fontSize: 22, fontWeight: "bold", color: item.color }}>{item.value}</div>
                <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>{item.label}</div>
              </div>
            ))}
          </div>

          <table style={tableStyle}>
            <thead>
              <tr style={{ background: "#7a3a1a", color: "#fff" }}>
                {["Test Title", "Subject", "Date", "Marks", "Percentage", "Grade"].map((h) => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={r._id} style={{ background: i % 2 === 0 ? "#fff8f0" : "#fff" }}>
                  <td style={tdStyle}>{r.title}</td>
                  <td style={tdStyle}>{r.subject}</td>
                  <td style={tdStyle}>{r.date}</td>
                  <td style={tdStyle}>{r.marksObtained} / {r.totalMarks}</td>
                  <td style={tdStyle}>{r.percentage}%</td>
                  <td style={{ ...tdStyle, fontWeight: "bold", fontSize: 16, color: gradeColor(r.grade) }}>
                    {r.grade}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

const cardStyle    = { background: "#fff", borderRadius: 10, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" };
const headingStyle = { margin: "0 0 20px", color: "#7a3a1a", fontSize: 18 };
const tableStyle   = { width: "100%", borderCollapse: "collapse" };
const thStyle      = { padding: "11px 14px", textAlign: "left", fontWeight: "600", fontSize: 13 };
const tdStyle      = { padding: "10px 14px", fontSize: 13, borderBottom: "1px solid #eee" };
