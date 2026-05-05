import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import AddTeacher from "./AddTeacher";
import AddStudent from "./AddStudent";
import ViewSubjects from "./ViewSubjects";
import ViewTeachers from "./ViewTeachers";
import ViewStudents from "./ViewStudents";
import api from "../../api/axios";

const tabs = ["Add Teacher", "Add Student", "Teachers", "Students", "Subjects"];

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [active, setActive] = useState("Add Teacher");
  const [school, setSchool] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.get("/admin/school").then((r) => setSchool(r.data));
  }, []);

  const copyCode = () => {
    navigator.clipboard.writeText(school._id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4ff" }}>
      <Navbar user={user} />

      {/* School Code Banner */}
      {school && (
        <div style={{ background: "#e8f0fe", borderBottom: "1px solid #c5d5f5", padding: "10px 24px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, color: "#444" }}>
            🏫 <strong>{school.name}</strong> — Share this code with teachers & students to join your school:
          </span>
          <code style={{ background: "#fff", border: "1px solid #aac", padding: "4px 12px", borderRadius: 6, fontSize: 13, letterSpacing: 1 }}>
            {school._id}
          </code>
          <button onClick={copyCode}
            style={{ padding: "4px 14px", background: copied ? "#1a7a4a" : "#1e50a0", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer", fontSize: 12, fontWeight: "bold" }}>
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}

      {/* Tab Bar */}
      <div style={{ background: "#fff", borderBottom: "2px solid #e0e8ff", display: "flex", padding: "0 24px" }}>
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActive(tab)}
            style={{ padding: "14px 20px", border: "none", background: "none", cursor: "pointer",
              fontWeight: active === tab ? "bold" : "normal",
              color: active === tab ? "#1e50a0" : "#555",
              borderBottom: active === tab ? "3px solid #1e50a0" : "3px solid transparent",
              fontSize: 14 }}>
            {tab}
          </button>
        ))}
      </div>

      <div style={{ padding: 28 }}>
        {active === "Add Teacher"  && <AddTeacher />}
        {active === "Add Student"  && <AddStudent />}
        {active === "Teachers"     && <ViewTeachers />}
        {active === "Students"     && <ViewStudents />}
        {active === "Subjects"     && <ViewSubjects />}
      </div>
    </div>
  );
}
