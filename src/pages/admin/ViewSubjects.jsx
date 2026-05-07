import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Card, PageTitle, StyledTable } from "../../components/UI";

export default function ViewSubjects() {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => { api.get("/admin/subjects").then((r) => setSubjects(r.data)); }, []);

  return (
    <Card>
      <PageTitle title={`All Subjects (${subjects.length})`} />
      <StyledTable
        headers={["Subject Name", "Teacher", "Department", "Credit Hours", "Enrolled"]}
        rows={subjects.map((s) => [
          s.name, s.teacherId?.name || "Unknown",
          s.teacherId?.department || "—", s.creditHours,
          <span style={{ fontWeight: 700, color: "#4f46e5" }}>{s.enrolledStudentIds?.length || 0}</span>
        ])}
        emptyMsg="No subjects added yet."
      />
    </Card>
  );
}
