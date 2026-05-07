import { useState } from "react";
import Navbar from "../../components/Navbar";
import { TabBar } from "../../components/UI";
import PageLayout from "../../components/PageLayout";
import BrowseSubjects from "./BrowseSubjects";
import MySubjects from "./MySubjects";
import MyAttendance from "./MyAttendance";
import StudentProfile from "./StudentProfile";
import MyResults from "./MyResults";

const TABS = [
  { key: "Browse Subjects", label: "Browse Subjects" },
  { key: "My Subjects",     label: "My Subjects" },
  { key: "My Results",      label: "My Results" },
  { key: "My Attendance",   label: "Attendance" },
  { key: "Profile",         label: "Profile" },
];

export default function StudentDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [active, setActive] = useState("Browse Subjects");

  return (
    <PageLayout>
      <Navbar user={user} />
      <div style={{ padding: "16px 24px 0" }}>
        <TabBar tabs={TABS} active={active} onChange={setActive} color="#7c2d12" />
      </div>
      <div style={{ padding: "16px 24px 24px" }} className="fade-in">
        {active === "Browse Subjects" && <BrowseSubjects />}
        {active === "My Subjects"     && <MySubjects />}
        {active === "My Results"      && <MyResults />}
        {active === "My Attendance"   && <MyAttendance />}
        {active === "Profile"         && <StudentProfile />}
      </div>
    </PageLayout>
  );
}
