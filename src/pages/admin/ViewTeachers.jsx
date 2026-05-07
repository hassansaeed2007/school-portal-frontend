import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Card, PageTitle, StyledTable } from "../../components/UI";

export default function ViewTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch]     = useState("");

  useEffect(() => { api.get("/admin/teachers").then((r) => setTeachers(r.data)); }, []);

  const filtered = teachers.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card>
      <PageTitle title={`All Teachers (${teachers.length})`} />
      <input value={search} onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or email..."
        style={{ width: "100%", maxWidth: 320, padding: "9px 14px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, marginBottom: 16, boxSizing: "border-box" }} />
      <StyledTable
        headers={["Name", "Email", "Phone", "Qualification", "Department"]}
        rows={filtered.map((t) => [t.name, t.email, t.phone || "—", t.qualification || "—", t.department || "—"])}
        emptyMsg="No teachers added yet."
      />
    </Card>
  );
}
