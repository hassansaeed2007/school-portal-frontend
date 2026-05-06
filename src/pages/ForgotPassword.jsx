import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import PasswordInput from "../components/PasswordInput";

export default function ForgotPassword() {
  const [step, setStep]         = useState(1); // 1=email, 2=otp+newpass
  const [email, setEmail]       = useState("");
  const [otp, setOtp]           = useState("");
  const [newPassword, setNew]   = useState("");
  const [confirm, setConfirm]   = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      toast.success(data.message);
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed.");
    } finally { setLoading(false); }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirm) { toast.error("Passwords do not match."); return; }
    if (newPassword.length < 6)  { toast.error("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/reset-password", { email, otp, newPassword });
      toast.success(data.message);
      setTimeout(() => window.location.href = "/", 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed.");
    } finally { setLoading(false); }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🔐</div>
          <h2 style={{ color: "#fff", margin: 0, fontSize: 22 }}>Reset Password</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", margin: "6px 0 0", fontSize: 13 }}>
            {step === 1 ? "Enter your email to receive a reset code" : `Code sent to ${email}`}
          </p>
        </div>

        <div style={{ padding: "32px 36px" }}>
          {step === 1 ? (
            <form onSubmit={handleSendOTP}>
              <label style={labelStyle}>Email Address</label>
              <input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Enter your registered email" />
              <button type="submit" disabled={loading} style={{ ...btnStyle, marginTop: 20 }}>
                {loading ? "Sending..." : "Send Reset Code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleReset}>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Verification Code</label>
                <input style={{ ...inputStyle, letterSpacing: 6, textAlign: "center", fontSize: 20, fontWeight: "bold" }}
                  value={otp} onChange={e => setOtp(e.target.value)} required placeholder="000000" maxLength={6} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>New Password</label>
                <PasswordInput value={newPassword} onChange={e => setNew(e.target.value)} placeholder="Enter new password" />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Confirm Password</label>
                <PasswordInput value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat new password" />
              </div>
              <button type="submit" disabled={loading} style={btnStyle}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>
              <button type="button" onClick={() => setStep(1)} style={{ ...btnStyle, background: "#f0f0f0", color: "#555", marginTop: 10 }}>
                ← Back
              </button>
            </form>
          )}

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#888" }}>
            Remember it? <Link to="/" style={{ color: "#1e50a0", fontWeight: "bold", textDecoration: "none" }}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const pageStyle  = { minHeight: "100vh", background: "linear-gradient(135deg, #1e50a0 0%, #2d7dd2 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 };
const cardStyle  = { background: "#fff", borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", width: "100%", maxWidth: 420, overflow: "hidden" };
const headerStyle = { background: "linear-gradient(135deg, #1e50a0, #2d7dd2)", padding: "28px 0", textAlign: "center" };
const labelStyle = { display: "block", fontWeight: "600", marginBottom: 6, fontSize: 13, color: "#444" };
const inputStyle = { width: "100%", padding: "10px 12px", border: "1.5px solid #e0e0e0", borderRadius: 8, fontSize: 14, boxSizing: "border-box", outline: "none", marginBottom: 4 };
const btnStyle   = { width: "100%", padding: "12px", background: "linear-gradient(135deg, #1e50a0, #2d7dd2)", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: "bold", cursor: "pointer", display: "block" };
