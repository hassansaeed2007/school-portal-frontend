import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function TeacherProfile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get("/teacher/profile").then((r) => setProfile(r.data));
  }, []);

  if (!profile) return <p>Loading...</p>;

  const fields = [
    ["Name",          profile.name],
    ["Email",         profile.email],
    ["Phone",         profile.phone || "—"],
    ["Qualification", profile.qualification || "—"],
    ["Department",    profile.department || "—"],
    ["Role",          profile.role],
  ];

  return (
    <div style={{ ...cardStyle, maxWidth: 500 }}>
      <h3 style={headingStyle}>My Profile</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          {fields.map(([label, value]) => (
            <tr key={label}>
              <td style={{ padding: "10px 14px", fontWeight: "600", color: "#444", fontSize: 13, width: 140 }}>{label}</td>
              <td style={{ padding: "10px 14px", fontSize: 13, color: "#222" }}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const cardStyle    = { background: "#fff", borderRadius: 10, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" };
const headingStyle = { margin: "0 0 18px", color: "#1a7a4a", fontSize: 18 };
