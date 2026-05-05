import { useState } from "react";
import Navbar from "../../components/Navbar";
import BrowseSubjects from "./BrowseSubjects";
import MySubjects from "./MySubjects";
import MyAttendance from "./MyAttendance";
import StudentProfile from "./StudentProfile";
import MyResults from "./MyResults";

const tabs = ["Browse Subjects", "My Subjects", "My Results", "My Attendance", "Profile"];

export default function StudentDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [active, setActive] = useState("Browse Subjects");

  return (
    <div style={{ minHeight: "100vh", background: "#fff8f0" }}>
      <Navbar user={user} />
      <div style={{ background: "#fff", borderBottom: "2px solid #ffe0c0", display: "flex", padding: "0 24px" }}>
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActive(tab)}
            style={{ padding: "14px 20px", border: "none", background: "none", cursor: "pointer",
              fontWeight: active === tab ? "bold" : "normal",
              color: active === tab ? "#7a3a1a" : "#555",
              borderBottom: active === tab ? "3px solid #7a3a1a" : "3px solid transparent", fontSize: 14 }}>
            {tab}
          </button>
        ))}
      </div>
      <div style={{ padding: 28 }}>
        {active === "Browse Subjects" && <BrowseSubjects />}
        {active === "My Subjects"     && <MySubjects />}
        {active === "My Results"      && <MyResults />}
        {active === "My Attendance"   && <MyAttendance />}
        {active === "Profile"         && <StudentProfile />}
      </div>
    </div>
  );
}
