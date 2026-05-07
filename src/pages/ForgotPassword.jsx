import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import VideoBackground from "../components/VideoBackground";

export default function ForgotPassword() {
  const [step, setStep]       = useState(1);
  const [email, setEmail]     = useState("");
  const [otp, setOtp]         = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

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
    if (newPass !== confirm) { toast.error("Passwords do not match."); return; }
    if (newPass.length < 6)  { toast.error("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/reset-password", { email, otp, newPassword: newPass });
      toast.success(data.message);
      setTimeout(() => window.location.href = "/", 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: 20 }}>
      <VideoBackground src="/vedio 1.mp4" opacity={0.6} />

      <div className="glass fade-up" style={{
        position: "relative", zIndex: 2,
        width: "100%", maxWidth: 420,
        padding: "44px 40px",
        boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
      }}>
        <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Reset Password</h2>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginBottom: 28 }}>
          {step === 1 ? "Enter your email to receive a reset code" : `Code sent to ${email}`}
        </p>

        {step === 1 ? (
          <form onSubmit={handleSendOTP} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={labelStyle}>Email Address</label>
              <input style={inputStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your@email.com" />
            </div>
            <button type="submit" disabled={loading} style={btnStyle}>
              {loading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={labelStyle}>Verification Code</label>
              <input style={{ ...inputStyle, letterSpacing: 8, textAlign: "center", fontSize: 20, fontWeight: 800 }}
                value={otp} onChange={(e) => setOtp(e.target.value)} required placeholder="000000" maxLength={6} />
            </div>
            <div>
              <label style={labelStyle}>New Password</label>
              <input style={inputStyle} type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} required placeholder="Min 6 characters" />
            </div>
            <div>
              <label style={labelStyle}>Confirm Password</label>
              <input style={inputStyle} type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required placeholder="Repeat password" />
            </div>
            <button type="submit" disabled={loading} style={btnStyle}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
            <button type="button" onClick={() => setStep(1)}
              style={{ ...btnStyle, background: "rgba(255,255,255,0.1)", boxShadow: "none" }}>
              Back
            </button>
          </form>
        )}

        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 24 }}>
          Remember it?{" "}
          <Link to="/" style={{ color: "#a78bfa", fontWeight: 700, textDecoration: "none" }}>Login</Link>
        </p>
      </div>

      <style>{`input::placeholder { color: rgba(255,255,255,0.25); } input:focus { border-color: rgba(139,92,246,0.6) !important; box-shadow: 0 0 0 3px rgba(139,92,246,0.15); }`}</style>
    </div>
  );
}

const labelStyle = { display: "block", color: "rgba(255,255,255,0.65)", fontSize: 13, fontWeight: 600, marginBottom: 6 };
const inputStyle = { width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.13)", borderRadius: 10, color: "#fff", fontSize: 14, boxSizing: "border-box", transition: "all 0.2s" };
const btnStyle   = { width: "100%", padding: "14px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(99,102,241,0.4)" };
