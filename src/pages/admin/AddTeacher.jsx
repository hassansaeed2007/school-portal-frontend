import { useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function AddTeacher() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", qualification: "", department: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/admin/teachers", form);
      toast.success(data.message + " Welcome email sent!");
      setForm({ name: "", email: "", password: "", phone: "", qualification: "", department: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add teacher.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={cardStyle}>
      <h3 style={headingStyle}>Add New Teacher</h3>
      <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[
          { label: "Full Name",      name: "name",          type: "text" },
          { label: "Email",          name: "email",         type: "email" },
          { label: "Password",       name: "password",      type: "password" },
          { label: "Phone",          name: "phone",         type: "text" },
          { label: "Qualification",  name: "qualification", type: "text" },
          { label: "Department",     name: "department",    type: "text" },
        ].map((f) => (
          <div key={f.name}>
            <label style={labelStyle}>{f.label}</label>
            <input style={inputStyle} type={f.type} name={f.name} value={form[f.name]} onChange={handleChange}
              required={["name","email","password"].includes(f.name)} placeholder={`Enter ${f.label.toLowerCase()}`} />
          </div>
        ))}
        <div style={{ gridColumn: "1 / -1" }}>
          <button type="submit" disabled={loading} style={btnStyle("#1e50a0")}>
            {loading ? "Adding..." : "Add Teacher"}
          </button>
        </div>
      </form>
    </div>
  );
}

const cardStyle    = { background: "#fff", borderRadius: 10, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", maxWidth: 700 };
const headingStyle = { margin: "0 0 20px", color: "#1e50a0", fontSize: 18 };
const labelStyle   = { display: "block", fontWeight: "600", marginBottom: 5, fontSize: 13, color: "#444" };
const inputStyle   = { width: "100%", padding: "9px 12px", border: "1px solid #ddd", borderRadius: 6, fontSize: 14, boxSizing: "border-box" };
const btnStyle     = (bg) => ({ padding: "11px 28px", background: bg, color: "#fff", border: "none", borderRadius: 6, fontWeight: "bold", cursor: "pointer", fontSize: 14 });
