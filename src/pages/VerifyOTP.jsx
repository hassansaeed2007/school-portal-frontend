import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function VerifyOTP() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const email     = location.state?.email || "";
  const [otp, setOtp]         = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputs = useRef([]);

  useEffect(() => {
    if (!email) navigate("/signup");
  }, [email]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
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
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) { toast.error("Enter the complete 6-digit code."); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/verify-otp", { email, otp: code });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Email verified! Welcome to School Portal.");
      const role = data.user.role;
      if (role === "Admin")   navigate("/admin");
      if (role === "Teacher") navigate("/teacher");
      if (role === "Student") navigate("/student");
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed.");
      setOtp(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
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
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={styles.page}>
      <video autoPlay muted loop playsInline style={styles.video}>
        <source src="https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4" type="video/mp4" />
      </video>
      <div style={styles.overlay} />

      <div style={styles.card} className="otp-card">
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h2 style={styles.title}>Verify Your Email</h2>
          <p style={styles.subtitle}>We sent a 6-digit code to</p>
          <p style={{ color: "#a78bfa", fontWeight: 700, fontSize: 15, margin: "4px 0 0" }}>{email}</p>
        </div>

        {/* OTP Boxes */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 28 }} onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input key={i} ref={(el) => (inputs.current[i] = el)}
              type="text" inputMode="numeric" maxLength={1} value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              style={{
                width: 50, height: 58, textAlign: "center", fontSize: 26, fontWeight: 800,
                background: digit ? "rgba(108,99,255,0.3)" : "rgba(255,255,255,0.08)",
                border: digit ? "2px solid #6c63ff" : "2px solid rgba(255,255,255,0.2)",
                borderRadius: 12, color: "#fff", outline: "none", transition: "all 0.2s",
              }} />
          ))}
        </div>

        <button onClick={handleVerify} disabled={loading} style={styles.btn}>
          {loading ? "Verifying..." : "Verify & Continue →"}
        </button>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
          Didn't receive the code?{" "}
          {countdown > 0 ? (
            <span style={{ color: "rgba(255,255,255,0.3)" }}>Resend in {countdown}s</span>
          ) : (
            <button onClick={handleResend} disabled={resending}
              style={{ background: "none", border: "none", color: "#a78bfa", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
              {resending ? "Sending..." : "Resend Code"}
            </button>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: 14 }}>
          <a href="/signup" style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, textDecoration: "none" }}>← Back to Sign Up</a>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
        @keyframes bounce { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }
        .otp-card { animation: fadeSlideUp 0.7s ease forwards; }
        button:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
      `}</style>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", background: "#0a0a1a" },
  video: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 },
  overlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(135deg, rgba(10,10,40,0.88), rgba(30,10,60,0.85))", zIndex: 1 },
  card: { position: "relative", zIndex: 2, background: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 24, padding: "40px 36px", width: "100%", maxWidth: 420, boxShadow: "0 25px 50px rgba(0,0,0,0.5)" },
  title: { color: "#fff", fontSize: 24, fontWeight: 800, margin: "10px 0 6px" },
  subtitle: { color: "rgba(255,255,255,0.5)", fontSize: 14, margin: 0 },
  btn: { width: "100%", background: "linear-gradient(135deg, #6c63ff, #a855f7)", color: "#fff", border: "none", borderRadius: 12, padding: "14px", fontSize: 16, fontWeight: 700, cursor: "pointer", transition: "all 0.3s", boxShadow: "0 4px 15px rgba(108,99,255,0.4)" },
};
