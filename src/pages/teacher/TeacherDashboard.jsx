import { useState } from "react";
import Navbar from "../../components/Navbar";
import AddSubject from "./AddSubject";
import MyStudents from "./MyStudents";
import TakeAttendance from "./TakeAttendance";
import TeacherProfile from "./TeacherProfile";
import ManageTests from "./ManageTests";

const tabs = ["My Subjects", "My Students", "Take Attendance", "Tests & Marks", "Profile"];

export default function TeacherDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [active, setActive] = useState("My Subjects");

  return (
    <div style={{ minHeight: "100vh", background: "#f0fff4" }}>
      <Navbar user={user} />
      <div style={{ background: "#fff", borderBottom: "2px solid #d0f0e0", display: "flex", padding: "0 24px" }}>
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActive(tab)}
            style={{ padding: "14px 20px", border: "none", background: "none", cursor: "pointer",
              fontWeight: active === tab ? "bold" : "normal",
              color: active === tab ? "#1a7a4a" : "#555",
              borderBottom: active === tab ? "3px solid #1a7a4a" : "3px solid transparent", fontSize: 14 }}>
            {tab}
          </button>
        ))}
      </div>
      <div style={{ padding: 28 }}>
        {active === "My Subjects"     && <AddSubject />}
        {active === "My Students"     && <MyStudents />}
        {active === "Take Attendance" && <TakeAttendance />}
        {active === "Tests & Marks"   && <ManageTests />}
        {active === "Profile"         && <TeacherProfile />}
      </div>
    </div>
  );
}
