import { useState } from "react";
import Navbar from "../../components/Navbar";
import { TabBar } from "../../components/UI";
import PageLayout from "../../components/PageLayout";
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
    <PageLayout>
      <Navbar user={user} />
      <div style={{ padding: "16px 24px 0" }}>
        <TabBar tabs={TABS} active={active} onChange={setActive} color="#065f46" />
      </div>
      <div style={{ padding: "16px 24px 24px" }} className="fade-in">
        {active === "My Subjects"     && <AddSubject />}
        {active === "My Students"     && <MyStudents />}
        {active === "Take Attendance" && <TakeAttendance />}
        {active === "Tests & Marks"   && <ManageTests />}
        {active === "Profile"         && <TeacherProfile />}
      </div>
    </PageLayout>
  );
}
