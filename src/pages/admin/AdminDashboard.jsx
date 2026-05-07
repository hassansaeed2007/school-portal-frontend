import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { TabBar } from "../../components/UI";
import AddTeacher from "./AddTeacher";
import AddStudent from "./AddStudent";
import ViewSubjects from "./ViewSubjects";
import ViewTeachers from "./ViewTeachers";
import ViewStudents from "./ViewStudents";
import api from "../../api/axios";

const TABS = [
  { key: "Add Teacher",  label: "Add Teacher" },
  { key: "Add Student",  label: "Add Student" },
  { key: "Teachers",     label: "Teachers" },
  { key: "Students",     label: "Students" },
  { key: "Subjects",     label: "Subjects" },
];

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [active, setActive] = useState("Add Teacher");
  const [school, setSchool] = useState(null);
  const [copied, setCopied] = useState(false);
  const [stats, setStats]   = useState({ teachers: 0, students: 0, subjects: 0 });

  useEffect(() => {
    api.get("/admin/school").then((r) => setSchool(r.data));
    Promise.all([
      api.get("/admin/teachers"),
      api.get("/admin/students"),
      api.get("/admin/subjects"),
    ]).then(([t, s, sub]) => setStats({ teachers: t.data.length, students: s.data.length, subjects: sub.data.length }));
  }, []);

  const copyCode = () => {
    navigator.clipboard.writeText(school._id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      <Navbar user={user} />

      {/* School Code Banner */}
      {school && (
        <div className="slide-in" style={{
          background: "linear-gradient(135deg, #1e3a8a, #4f46e5)",
          padding: "12px 28px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap"
        }}>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.9)" }}>
            <strong>{school.name}</strong> — Share school code with teachers & students:
          </span>
          <code style={{
            background: "rgba(255,255,255,0.15)", color: "#fff",
            padding: "4px 14px", borderRadius: 6, fontSize: 12,
            letterSpacing: 1, border: "1px solid rgba(255,255,255,0.3)"
          }}>
            {school._id}
          </code>
          <button onClick={copyCode} style={{
            padding: "4px 14px", background: copied ? "#10b981" : "rgba(255,255,255,0.2)",
            color: "#fff", border: "1px solid rgba(255,255,255,0.4)",
            borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 700
          }}>
            {copied ? "Copied!" : "Copy Code"}
          </button>
        </div>
      )}

      {/* Stats Row */}
      <div style={{ padding: "20px 28px 0", display: "flex", gap: 16, flexWrap: "wrap" }}>
        {[
          { label: "Teachers",  value: stats.teachers,  color: "#065f46" },
          { label: "Students",  value: stats.students,  color: "#7c2d12" },
          { label: "Subjects",  value: stats.subjects,  color: "#4f46e5" },
        ].map((s) => (
          <div key={s.label} className="card-hover" style={{
            background: "#fff", borderRadius: 12, padding: "16px 24px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)", borderLeft: `4px solid ${s.color}`,
            display: "flex", alignItems: "center", gap: 14, minWidth: 150
          }}>
            <div>
              <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ margin: "20px 28px 0" }}>
        <TabBar tabs={TABS} active={active} onChange={setActive} color="#1e3a8a" />
      </div>

      <div style={{ padding: "20px 28px" }} className="fade-in">
        {active === "Add Teacher" && <AddTeacher />}
        {active === "Add Student" && <AddStudent />}
        {active === "Teachers"    && <ViewTeachers />}
        {active === "Students"    && <ViewStudents />}
        {active === "Subjects"    && <ViewSubjects />}
      </div>
    </div>
  );
}
