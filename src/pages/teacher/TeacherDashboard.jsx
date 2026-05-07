import { useState } from "react";
import Navbar from "../../components/Navbar";
import { TabBar } from "../../components/UI";
import AddSubject from "./AddSubject";
import MyStudents from "./MyStudents";
import TakeAttendance from "./TakeAttendance";
import TeacherProfile from "./TeacherProfile";
import ManageTests from "./ManageTests";

const TABS = [
  { key: "My Subjects",     label: "My Subjects" },
  { key: "My Students",     label: "My Students" },
  { key: "Take Attendance", label: "Attendance" },
  { key: "Tests & Marks",   label: "Tests & Marks" },
  { key: "Profile",         label: "Profile" },
];

export default function TeacherDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [active, setActive] = useState("My Subjects");

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      <Navbar user={user} />
      <div style={{ margin: "20px 28px 0" }}>
        <TabBar tabs={TABS} active={active} onChange={setActive} color="#065f46" />
      </div>
      <div style={{ padding: "20px 28px" }} className="fade-in">
        {active === "My Subjects"     && <AddSubject />}
        {active === "My Students"     && <MyStudents />}
        {active === "Take Attendance" && <TakeAttendance />}
        {active === "Tests & Marks"   && <ManageTests />}
        {active === "Profile"         && <TeacherProfile />}
      </div>
    </div>
  );
}
