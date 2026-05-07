import { useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { Card, PageTitle, Input, PrimaryBtn } from "../../components/UI";

export default function AddStudent() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", rollNumber: "", semester: "", department: "" });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/admin/students", form);
      toast.success(data.message);
      setForm({ name: "", email: "", password: "", phone: "", rollNumber: "", semester: "", department: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed.");
    } finally { setLoading(false); }
  };

  return (
    <Card style={{ maxWidth: 680 }}>
      <PageTitle title="Add New Student" subtitle="Student will receive a welcome email with login credentials" />
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          {[
            { label: "Full Name *",   name: "name",       type: "text",     placeholder: "Ali Hassan" },
            { label: "Email *",       name: "email",      type: "email",    placeholder: "student@school.edu" },
            { label: "Password *",    name: "password",   type: "password", placeholder: "Create password" },
            { label: "Phone",         name: "phone",      type: "text",     placeholder: "03XX-XXXXXXX" },
            { label: "Roll Number *", name: "rollNumber", type: "text",     placeholder: "CS-2023-01" },
            { label: "Semester",      name: "semester",   type: "text",     placeholder: "2nd Semester" },
            { label: "Department",    name: "department", type: "text",     placeholder: "CS Department" },
          ].map((f) => (
            <Input key={f.name} label={f.label} name={f.name} type={f.type}
              value={form[f.name]} onChange={handleChange}
              required={["name","email","password","rollNumber"].includes(f.name)}
              placeholder={f.placeholder} />
          ))}
        </div>
        <PrimaryBtn type="submit" color="#7c2d12" disabled={loading}>
          {loading ? "Adding..." : "Add Student & Send Email"}
        </PrimaryBtn>
      </form>
    </Card>
  );
}
