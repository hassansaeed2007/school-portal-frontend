import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState("Student");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "", phone: "",
    qualification: "", department: "",   // teacher
    rollNumber: "", semester: "",        // student
    schoolCode: "",                      // teacher & student
  });
  const [schoolName, setSchoolName] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Verify school code live
  const handleSchoolCode = async (e) => {
    const code = e.target.value;
    setForm({ ...form, schoolCode: code });
    if (code.length > 10) {
      try {
        const { data } = await api.get(`/auth/school/${code}`);
        setSchoolName(data.name);
      } catch {
        setSchoolName("Invalid school code");
      }
    } else {
      setSchoolName("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/signup", { ...form, role });
      toast.success(data.message);
      // Redirect to OTP verification page
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  const roleColor = { Admin: "#1e50a0", Teacher: "#1a7a4a", Student: "#7a3a1a" };
  const color = roleColor[role];

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4ff", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 4px 24px rgba(0,0,0,0.1)", width: "100%", maxWidth: 520, overflow: "hidden" }}>

        {/* Header */}
        <div style={{ background: color, padding: "24px 0", textAlign: "center" }}>
          <h2 style={{ color: "#fff", margin: 0, fontSize: 22 }}>Create Account</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", margin: "6px 0 0", fontSize: 13 }}>School Management Portal</p>
        </div>

        {/* Role Selector */}
        <div style={{ display: "flex", borderBottom: "2px solid #eee" }}>
          {["Admin", "Teacher", "Student"].map((r) => (
            <button key={r} onClick={() => setRole(r)}
              style={{ flex: 1, padding: "12px 0", border: "none", cursor: "pointer", fontWeight: role === r ? "bold" : "normal",
                background: role === r ? color : "#fff", color: role === r ? "#fff" : "#555",
                fontSize: 14, transition: "all 0.2s" }}>
              {r}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "24px 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

            {/* Common fields */}
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>{role === "Admin" ? "School Name *" : "Full Name *"}</label>
              <input style={inputStyle} name="name" value={form.name} onChange={handleChange} required
                placeholder={role === "Admin" ? "Enter school name" : "Enter your full name"} />
            </div>

            <div>
              <label style={labelStyle}>Email Address *</label>
              <input style={inputStyle} name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Enter email" />
            </div>

            <div>
              <label style={labelStyle}>Phone</label>
              <input style={inputStyle} name="phone" value={form.phone} onChange={handleChange} placeholder="03XX-XXXXXXX" />
            </div>

            <div>
              <label style={labelStyle}>Password *</label>
              <input style={inputStyle} name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Create password" />
            </div>

            <div>
              <label style={labelStyle}>Confirm Password *</label>
              <input style={inputStyle} name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required placeholder="Repeat password" />
            </div>

            {/* Teacher-specific fields */}
            {role === "Teacher" && (
              <>
                <div>
                  <label style={labelStyle}>Qualification</label>
                  <input style={inputStyle} name="qualification" value={form.qualification} onChange={handleChange} placeholder="e.g. PhD Computer Science" />
                </div>
                <div>
                  <label style={labelStyle}>Department</label>
                  <input style={inputStyle} name="department" value={form.department} onChange={handleChange} placeholder="e.g. CS Department" />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>School Code * <span style={{ fontWeight: "normal", color: "#888" }}>(get this from your Admin)</span></label>
                  <input style={inputStyle} name="schoolCode" value={form.schoolCode} onChange={handleSchoolCode} required placeholder="Paste school code here" />
                  {schoolName && <p style={{ marginTop: 5, fontSize: 12, color: schoolName === "Invalid school code" ? "#c0392b" : "#1a7a4a", fontWeight: "bold" }}>
                    {schoolName === "Invalid school code" ? "❌ " : "✅ "}{schoolName}
                  </p>}
                </div>
              </>
            )}

            {/* Student-specific fields */}
            {role === "Student" && (
              <>
                <div>
                  <label style={labelStyle}>Roll Number *</label>
                  <input style={inputStyle} name="rollNumber" value={form.rollNumber} onChange={handleChange} required placeholder="e.g. CS-2023-01" />
                </div>
                <div>
                  <label style={labelStyle}>Semester</label>
                  <input style={inputStyle} name="semester" value={form.semester} onChange={handleChange} placeholder="e.g. 2nd Semester" />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>School Code * <span style={{ fontWeight: "normal", color: "#888" }}>(get this from your Admin)</span></label>
                  <input style={inputStyle} name="schoolCode" value={form.schoolCode} onChange={handleSchoolCode} required placeholder="Paste school code here" />
                  {schoolName && <p style={{ marginTop: 5, fontSize: 12, color: schoolName === "Invalid school code" ? "#c0392b" : "#1a7a4a", fontWeight: "bold" }}>
                    {schoolName === "Invalid school code" ? "❌ " : "✅ "}{schoolName}
                  </p>}
                </div>
              </>
            )}

            {/* Submit */}
            <div style={{ gridColumn: "1 / -1", marginTop: 6 }}>
              <button type="submit" disabled={loading}
                style={{ width: "100%", padding: "12px", background: color, color: "#fff", border: "none",
                  borderRadius: 6, fontSize: 15, fontWeight: "bold", cursor: "pointer" }}>
                {loading ? "Creating Account..." : `Sign Up as ${role}`}
              </button>
            </div>

            {/* Email notice for Teacher/Student */}
            {(role === "Teacher" || role === "Student") && (
              <div style={{ gridColumn: "1 / -1", background: "#f0fff4", border: "1px solid #b2dfdb", borderRadius: 6, padding: "10px 14px", fontSize: 12, color: "#1a7a4a" }}>
                ✉ A welcome email with your credentials will be sent to your email address.
              </div>
            )}

          </div>
        </form>

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "0 0 24px", fontSize: 13, color: "#666" }}>
          Already have an account?{" "}
          <Link to="/" style={{ color: color, fontWeight: "bold", textDecoration: "none" }}>Login here</Link>
        </div>
      </div>
    </div>
  );
}

const labelStyle = { display: "block", fontWeight: "600", marginBottom: 5, fontSize: 13, color: "#444" };
const inputStyle = { width: "100%", padding: "9px 12px", border: "1px solid #ddd", borderRadius: 6, fontSize: 14, boxSizing: "border-box", outline: "none" };
