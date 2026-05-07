import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import VideoBackground from "../components/VideoBackground";

export default function Signup() {
  const navigate = useNavigate();
  const [role, setRole]           = useState("Student");
  const [loading, setLoading]     = useState(false);
  const [schoolName, setSchoolName] = useState("");
  const [showPass, setShowPass]   = useState(false);
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
      } catch {
        setSchoolName("Invalid school code");
      }
    } else {
      setSchoolName("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error("Passwords do not match."); return; }
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/signup", { ...form, role });
      toast.success(data.message);
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { key: "Admin",   color: "#6366f1" },
    { key: "Teacher", color: "#10b981" },
    { key: "Student", color: "#f59e0b" },
  ];
  const activeColor = roles.find((r) => r.key === role)?.color || "#6366f1";

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: "20px" }}>
      <VideoBackground src="/vedio 1.mp4" opacity={0.6} />

      <div className="glass fade-up" style={{
        position: "relative", zIndex: 2,
        width: "100%", maxWidth: 540,
        padding: "40px 40px",
        boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 800 }}>Create Account</h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginTop: 5 }}>School Management Portal</p>
        </div>

        {/* Role selector */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: 4 }}>
          {roles.map((r) => (
            <button key={r.key} type="button" onClick={() => setRole(r.key)} style={{
              flex: 1, padding: "10px 0", border: "none", borderRadius: 9,
              background: role === r.key ? r.color : "transparent",
              color: role === r.key ? "#fff" : "rgba(255,255,255,0.45)",
              fontWeight: 700, fontSize: 13, cursor: "pointer",
              boxShadow: role === r.key ? `0 4px 12px ${r.color}55` : "none",
              transition: "all 0.25s",
            }}>
              {r.key}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>{role === "Admin" ? "School Name" : "Full Name"} *</label>
              <input style={inputStyle} name="name" value={form.name} onChange={handleChange} required
                placeholder={role === "Admin" ? "e.g. Prestige School" : "e.g. Ali Hassan"} />
            </div>

            <div>
              <label style={labelStyle}>Email *</label>
              <input style={inputStyle} name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@school.edu" />
            </div>

            <div>
              <label style={labelStyle}>Phone</label>
              <input style={inputStyle} name="phone" value={form.phone} onChange={handleChange} placeholder="03XX-XXXXXXX" />
            </div>

            <div style={{ position: "relative" }}>
              <label style={labelStyle}>Password *</label>
              <input style={{ ...inputStyle, paddingRight: 52 }} name="password" type={showPass ? "text" : "password"} value={form.password} onChange={handleChange} required placeholder="Min 6 characters" />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: "absolute", right: 12, bottom: 13, background: "none", border: "none", color: "rgba(255,255,255,0.45)", cursor: "pointer", fontSize: 12 }}>
                {showPass ? "Hide" : "Show"}
              </button>
            </div>

            <div>
              <label style={labelStyle}>Confirm Password *</label>
              <input style={inputStyle} name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required placeholder="Repeat password" />
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
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>School Code * <span style={{ fontWeight: 400, color: "rgba(255,255,255,0.35)" }}>(get from Admin)</span></label>
                <input style={inputStyle} name="schoolCode" value={form.schoolCode} onChange={handleSchoolCode} required placeholder="Paste school code here" />
                {schoolName && <p style={{ marginTop: 5, fontSize: 12, color: schoolName === "Invalid school code" ? "#f87171" : "#34d399", fontWeight: 600 }}>
                  {schoolName === "Invalid school code" ? "Invalid code" : `School: ${schoolName}`}
                </p>}
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
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>School Code * <span style={{ fontWeight: 400, color: "rgba(255,255,255,0.35)" }}>(get from Admin)</span></label>
                <input style={inputStyle} name="schoolCode" value={form.schoolCode} onChange={handleSchoolCode} required placeholder="Paste school code here" />
                {schoolName && <p style={{ marginTop: 5, fontSize: 12, color: schoolName === "Invalid school code" ? "#f87171" : "#34d399", fontWeight: 600 }}>
                  {schoolName === "Invalid school code" ? "Invalid code" : `School: ${schoolName}`}
                </p>}
              </div>
            </>)}

            <div style={{ gridColumn: "1 / -1", marginTop: 4 }}>
              <button type="submit" disabled={loading} style={{ ...btnStyle, background: `linear-gradient(135deg, ${activeColor}, ${activeColor}cc)`, boxShadow: `0 4px 20px ${activeColor}44` }}>
                {loading ? <span style={spinnerStyle} /> : null}
                {loading ? "Creating Account..." : `Sign Up as ${role}`}
              </button>
            </div>
          </div>
        </form>

        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 20 }}>
          Already have an account?{" "}
          <Link to="/" style={{ color: "#a78bfa", fontWeight: 700, textDecoration: "none" }}>Login</Link>
        </p>
      </div>

      <style>{`
        input::placeholder { color: rgba(255,255,255,0.25); }
        input:focus { border-color: rgba(139,92,246,0.6) !important; box-shadow: 0 0 0 3px rgba(139,92,246,0.15); }
        @media (max-width: 560px) {
          form > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

const labelStyle = { display: "block", color: "rgba(255,255,255,0.65)", fontSize: 13, fontWeight: 600, marginBottom: 6 };
const inputStyle = {
  width: "100%", padding: "12px 14px",
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.13)",
  borderRadius: 10, color: "#fff", fontSize: 13,
  boxSizing: "border-box", transition: "all 0.2s",
};
const btnStyle = {
  width: "100%", padding: "14px",
  color: "#fff", border: "none", borderRadius: 12,
  fontSize: 15, fontWeight: 700, cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
};
const spinnerStyle = {
  width: 17, height: 17,
  border: "2px solid rgba(255,255,255,0.3)",
  borderTop: "2px solid #fff",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
  display: "inline-block",
};
