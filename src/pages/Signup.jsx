import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState("Student");
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

  const roleConfig = {
    Admin:   { color: "#6c63ff" },
    Teacher: { color: "#10b981" },
    Student: { color: "#f59e0b" },
  };
  const { color } = roleConfig[role];

  return (
    <div style={styles.page}>
      <div style={{ ...styles.shape, width: 350, height: 350, top: "-100px", left: "-100px" }} />
      <div style={{ ...styles.shape, width: 250, height: 250, bottom: "40px", right: "-80px" }} />

      <div style={styles.card} className="signup-card">
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>School Management Portal</p>
        </div>

        {/* Role Tabs */}
        <div style={styles.tabs}>
          {["Admin", "Teacher", "Student"].map((r) => (
            <button key={r} onClick={() => setRole(r)} style={{
              ...styles.tab,
              background: role === r ? roleConfig[r].color : "rgba(255,255,255,0.05)",
              color: role === r ? "#fff" : "rgba(255,255,255,0.5)",
              transform: role === r ? "scale(1.05)" : "scale(1)",
            }}>
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {/* Name */}
          <div style={{ gridColumn: "1 / -1" }}>
            <input style={styles.input} name="name" value={form.name} onChange={handleChange}
              required placeholder={role === "Admin" ? "School Name" : "Full Name"} />
          </div>

          <input style={styles.input} name="email" type="email" value={form.email}
            onChange={handleChange} required placeholder="Email" />

          <input style={styles.input} name="phone" value={form.phone}
            onChange={handleChange} placeholder="Phone" />

          <input style={styles.input} name="password" type="password" value={form.password}
            onChange={handleChange} required placeholder="Password" />

          <input style={styles.input} name="confirmPassword" type="password" value={form.confirmPassword}
            onChange={handleChange} required placeholder="Confirm Password" />

          {role === "Teacher" && (<>
            <input style={styles.input} name="qualification" value={form.qualification}
              onChange={handleChange} placeholder="Qualification" />
            <input style={styles.input} name="department" value={form.department}
              onChange={handleChange} placeholder="Department" />
            <div style={{ gridColumn: "1 / -1" }}>
              <input style={styles.input} name="schoolCode" value={form.schoolCode}
                onChange={handleSchoolCode} required placeholder="School Code (from Admin)" />
              {schoolName && <p style={{ margin: "4px 0 0 4px", fontSize: 12, color: schoolName === "Invalid school code" ? "#f87171" : "#34d399" }}>
                {schoolName === "Invalid school code" ? "Invalid" : "School: "}{schoolName !== "Invalid school code" && schoolName}
              </p>}
            </div>
          </>)}

          {role === "Student" && (<>
            <input style={styles.input} name="rollNumber" value={form.rollNumber}
              onChange={handleChange} required placeholder="Roll Number" />
            <input style={styles.input} name="semester" value={form.semester}
              onChange={handleChange} placeholder="Semester" />
            <div style={{ gridColumn: "1 / -1" }}>
              <input style={styles.input} name="schoolCode" value={form.schoolCode}
                onChange={handleSchoolCode} required placeholder="School Code (from Admin)" />
              {schoolName && <p style={{ margin: "4px 0 0 4px", fontSize: 12, color: schoolName === "Invalid school code" ? "#f87171" : "#34d399" }}>
                {schoolName === "Invalid school code" ? "Invalid" : "School: "}{schoolName !== "Invalid school code" && schoolName}
              </p>}
            </div>
          </>)}

          <div style={{ gridColumn: "1 / -1" }}>
            <button type="submit" disabled={loading}
              style={{ ...styles.btn, background: `linear-gradient(135deg, ${color}, ${color}cc)` }}>
              {loading ? "Creating Account..." : `Sign Up as ${role} →`}
            </button>
          </div>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/" style={{ color: "#a78bfa", fontWeight: 700, textDecoration: "none" }}>Login</Link>
        </p>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .signup-card { animation: fadeSlideUp 0.7s ease forwards; }
        input::placeholder { color: rgba(255,255,255,0.4); }
        input:focus { outline: none; border-color: ${color} !important; box-shadow: 0 0 0 3px ${color}33; }
        button:hover:not(:disabled) { transform: translateY(-2px); opacity: 0.95; }
      `}</style>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)", padding: 20 },
  card: { position: "relative", zIndex: 2, background: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 24, padding: "36px 32px", width: "100%", maxWidth: 520, boxShadow: "0 25px 50px rgba(0,0,0,0.5)" },
  title: { color: "#fff", fontSize: 24, fontWeight: 800, margin: "8px 0 4px" },
  subtitle: { color: "rgba(255,255,255,0.5)", fontSize: 13, margin: 0 },
  tabs: { display: "flex", gap: 8, marginBottom: 20 },
  tab: { flex: 1, padding: "10px 6px", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 13, transition: "all 0.3s" },
  input: { width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 13, boxSizing: "border-box", transition: "all 0.3s" },
  btn: { width: "100%", color: "#fff", border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "all 0.3s", boxShadow: "0 4px 15px rgba(0,0,0,0.3)" },
  footer: { textAlign: "center", color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 20 },
};
