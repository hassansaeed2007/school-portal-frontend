import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import VideoBackground from "../components/VideoBackground";

export default function VerifyOTP() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const email     = location.state?.email || "";
  const [otp, setOtp]         = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputs = useRef([]);

  useEffect(() => { if (!email) navigate("/signup"); }, [email]);
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputs.current[index - 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) { setOtp(pasted.split("")); inputs.current[5]?.focus(); }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) { toast.error("Enter the complete 6-digit code."); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/verify-otp", { email, otp: code });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Email verified! Welcome.");
      const role = data.user.role;
      if (role === "Admin")   navigate("/admin");
      if (role === "Teacher") navigate("/teacher");
      if (role === "Student") navigate("/student");
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed.");
      setOtp(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const { data } = await api.post("/auth/resend-otp", { email });
      toast.success(data.message);
      setCountdown(60);
      setOtp(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend.");
    } finally { setResending(false); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: 20 }}>
      <VideoBackground src="/vedio 1.mp4" opacity={0.6} />

      <div className="glass fade-up" style={{
        position: "relative", zIndex: 2,
        width: "100%", maxWidth: 420,
        padding: "44px 40px",
        boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
        textAlign: "center",
      }}>
        <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Verify Your Email</h2>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginBottom: 6 }}>We sent a 6-digit code to</p>
        <p style={{ color: "#a78bfa", fontWeight: 700, fontSize: 14, marginBottom: 32 }}>{email}</p>

        {/* OTP Boxes */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 28 }} onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input key={i} ref={(el) => (inputs.current[i] = el)}
              type="text" inputMode="numeric" maxLength={1} value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              style={{
                width: 52, height: 60, textAlign: "center",
                fontSize: 24, fontWeight: 800,
                background: digit ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.07)",
                border: digit ? "2px solid #6366f1" : "2px solid rgba(255,255,255,0.15)",
                borderRadius: 12, color: "#fff", outline: "none",
                transition: "all 0.2s",
              }} />
          ))}
        </div>

        <button onClick={handleVerify} disabled={loading} style={{
          width: "100%", padding: "14px",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          color: "#fff", border: "none", borderRadius: 12,
          fontSize: 15, fontWeight: 700, cursor: "pointer",
          boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          marginBottom: 20,
        }}>
          {loading && <span style={{ width: 17, height: 17, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />}
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>

        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
          Didn't receive the code?{" "}
          {countdown > 0 ? (
            <span style={{ color: "rgba(255,255,255,0.25)" }}>Resend in {countdown}s</span>
          ) : (
            <button onClick={handleResend} disabled={resending}
              style={{ background: "none", border: "none", color: "#a78bfa", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
              {resending ? "Sending..." : "Resend Code"}
            </button>
          )}
        </p>

        <div style={{ marginTop: 16 }}>
          <a href="/signup" style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, textDecoration: "none" }}>Back to Sign Up</a>
        </div>
      </div>
    </div>
  );
}
