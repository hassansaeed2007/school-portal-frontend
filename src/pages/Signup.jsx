import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import PasswordInput from "../components/PasswordInput";

export default function Signup() {
  const navigate = useNavigate();
  const [role, setRole]     = useState("Student");
  const [loading, setLoading] = useState(false);
  const [schoolName, setSchoolName] = useState("");
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "", phone: "",
    qualification: "", department: "", rollNumber: "", semester: "", schoolCode: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSchoolCode = async (e) => {
    const code = e.target.value;
    setForm({ ...form, schoolCode: code });
    if (code.length > 10) {
      try {
        const { data } = await api.get(`/auth/school/${code}`);
        setSchoolName(data.name);
      } catch { setSchoolName("Invalid school code"); }
    } else { setSchoolName(""); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error("Passwords do not match."); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/signup", { ...form, role });
      toast.success(data.message);
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed.");
    } finally { setLoading(false); }
  };

  const roleConfig = {
    Admin:   { color: "#1e50a0", gradient: "linear-gradient(135deg, #1a1a2e, #1e50a0)", icon: "👑" },
    Teacher: { color: "#1a7a4a", gradient: "linear-gradient(135deg, #0d3320, #1a7a4a)", icon: "👨‍🏫" },
    Student: { color: "#7a3a1a", gradient: "linear-gradient(135deg, #3a1a0d, #7a3a1a)", icon: "🎓" },
  };
  const rc = roleConfig[role];

  return (
    <div style={{ minHeight: "100vh", background: "#f8faff", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 10px 40px rgba(0,0,0,0.1)", width: "100%", maxWidth: 560, overflow: "hidden" }}>

        {/* Header */}
        <div style={{ background: rc.gradient, padding: "28px 32px", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 40 }}>{rc.icon}</div>
          <div>
            <h2 style={{ color: "#fff", margin: 0, fontSize: 22, fontWeight: 800 }}>Create Account</h2>
            <p style={{ color: "rgba(255,255,255,0.8)", margin: "4px 0 0", fontSize: 13 }}>School Management Portal</p>
          </div>
        </div>

        {/* Role Tabs */}
        <div style={{ display: "flex", background: "#f0f4ff" }}>
          {["Admin", "Teacher", "Student"].map((r) => (
            <button key={r} onClick={() => setRole(r)}
              style={{ flex: 1, padding: "13px 0", border: "none", cursor: "pointer", fontWeight: role === r ? 700 : 500,
                background: role === r ? "#fff" : "transparent",
                color: role === r ? roleConfig[r].color : "#888",
                fontSize: 14, borderBottom: role === r ? `3px solid ${roleConfig[r].color}` : "3px solid transparent",
                transition: "all 0.2s" }}>
              {roleConfig[r].icon} {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "24px 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>{role === "Admin" ? "School Name *" : "Full Name *"}</label>
              <input style={inputStyle} name="name" value={form.name} onChange={handleChange} required
                placeholder={role === "Admin" ? "Enter school name" : "Enter your full name"} />
            </div>

            <div>
              <label style={labelStyle}>Email *</label>
              <input style={inputStyle} name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Enter email" />
            </div>

            <div>
              <label style={labelStyle}>Phone</label>
              <input style={inputStyle} name="phone" value={form.phone} onChange={handleChange} placeholder="03XX-XXXXXXX" />
            </div>

            <div>
              <label style={labelStyle}>Password *</label>
              <PasswordInput name="password" value={form.password} onChange={handleChange} placeholder="Create password" />
            </div>

            <div>
              <label style={labelStyle}>Confirm Password *</label>
              <PasswordInput name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Repeat password" />
            </div>

            {role === "Teacher" && (<>
              <div>
                <label style={labelStyle}>Qualification</label>
                <input style={inputStyle} name="qualification" value={form.qualification} onChange={handleChange} placeholder="e.g. PhD CS" />
              </div>
              <div>
                <label style={labelStyle}>Department</label>
                <input style={inputStyle} name="department" value={form.department} onChange={handleChange} placeholder="e.g. CS Dept" />
              </div>
            </>)}

            {role === "Student" && (<>
              <div>
                <label style={labelStyle}>Roll Number *</label>
                <input style={inputStyle} name="rollNumber" value={form.rollNumber} onChange={handleChange} required placeholder="e.g. CS-2023-01" />
              </div>
              <div>
                <label style={labelStyle}>Semester</label>
                <input style={inputStyle} name="semester" value={form.semester} onChange={handleChange} placeholder="e.g. 2nd Semester" />
              </div>
            </>)}

            {(role === "Teacher" || role === "Student") && (
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>School Code * <span style={{ fontWeight: 400, color: "#999" }}>(get from your Admin)</span></label>
                <input style={inputStyle} name="schoolCode" value={form.schoolCode} onChange={handleSchoolCode} required placeholder="Paste school code here" />
                {schoolName && (
                  <p style={{ margin: "5px 0 0", fontSize: 12, fontWeight: 600, color: schoolName === "Invalid school code" ? "#e74c3c" : "#1a7a4a" }}>
                    {schoolName === "Invalid school code" ? "❌ " : "✅ "}{schoolName}
                  </p>
                )}
              </div>
            )}

            <div style={{ gridColumn: "1 / -1" }}>
              <button type="submit" disabled={loading}
                style={{ width: "100%", padding: "13px", background: rc.gradient, color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                {loading ? "Creating Account..." : `Sign Up as ${role} →`}
              </button>
            </div>

            {(role === "Teacher" || role === "Student") && (
              <div style={{ gridColumn: "1 / -1", background: "#f0fff4", border: "1px solid #b2dfdb", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#1a7a4a" }}>
                ✉️ A verification code will be sent to your email address.
              </div>
            )}
          </div>
        </form>

        <div style={{ textAlign: "center", padding: "0 0 24px", fontSize: 13, color: "#888" }}>
          Already have an account?{" "}
          <Link to="/" style={{ color: rc.color, fontWeight: 700, textDecoration: "none" }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
}

const labelStyle = { display: "block", fontWeight: 600, marginBottom: 5, fontSize: 13, color: "#444" };
const inputStyle = { width: "100%", padding: "10px 12px", border: "1.5px solid #e8e8e8", borderRadius: 8, fontSize: 14, boxSizing: "border-box", outline: "none", background: "#fafafa" };
