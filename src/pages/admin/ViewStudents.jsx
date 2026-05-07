import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Card, PageTitle, StyledTable, Badge } from "../../components/UI";

export default function ViewStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch]     = useState("");

  useEffect(() => { api.get("/admin/students").then((r) => setStudents(r.data)); }, []);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card>
      <PageTitle title={`All Students (${students.length})`} />
      <input value={search} onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or roll number..."
        style={{ width: "100%", maxWidth: 320, padding: "9px 14px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, marginBottom: 16, boxSizing: "border-box" }} />
      <StyledTable
        headers={["Name", "Email", "Roll No", "Semester", "Department", "Subjects"]}
        rows={filtered.map((s) => [
          s.name, s.email, s.rollNumber,
          s.semester || "—", s.department || "—",
          <Badge text={`${s.joinedSubjectIds?.length || 0}/8`} color="#4f46e5" />
        ])}
        emptyMsg="No students added yet."
      />
    </Card>
  );
}
