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

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Redirect if no email passed
  useEffect(() => {
    if (!email) navigate("/signup");
  }, [email]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // only digits
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // only 1 digit per box
    setOtp(newOtp);
    // Auto-focus next box
    if (value && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
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
    if (code.length < 6) { toast.error("Please enter the complete 6-digit code."); return; }

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
    <div style={{ minHeight: "100vh", background: "#f0f4ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 4px 24px rgba(0,0,0,0.1)", width: 420, overflow: "hidden" }}>

        {/* Header */}
        <div style={{ background: "#1e50a0", padding: "28px 0", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>✉️</div>
          <h2 style={{ color: "#fff", margin: 0, fontSize: 20 }}>Verify Your Email</h2>
          <p style={{ color: "#c0d4ff", margin: "8px 0 0", fontSize: 13 }}>
            We sent a 6-digit code to
          </p>
          <p style={{ color: "#fff", margin: "4px 0 0", fontWeight: "bold", fontSize: 14 }}>{email}</p>
        </div>

        <div style={{ padding: "32px 36px" }}>
          <p style={{ textAlign: "center", color: "#555", fontSize: 13, marginBottom: 24 }}>
            Enter the verification code below. It expires in 10 minutes.
          </p>

          {/* OTP Input Boxes */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 28 }} onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                style={{
                  width: 48, height: 56, textAlign: "center", fontSize: 24, fontWeight: "bold",
                  border: digit ? "2px solid #1e50a0" : "2px solid #ddd",
                  borderRadius: 8, outline: "none", background: digit ? "#f0f4ff" : "#fff",
                  transition: "all 0.15s"
                }}
              />
            ))}
          </div>

          {/* Verify Button */}
          <button onClick={handleVerify} disabled={loading}
            style={{ width: "100%", padding: "12px", background: "#1e50a0", color: "#fff",
              border: "none", borderRadius: 6, fontSize: 15, fontWeight: "bold", cursor: "pointer", marginBottom: 16 }}>
            {loading ? "Verifying..." : "Verify & Create Account"}
          </button>

          {/* Resend */}
          <div style={{ textAlign: "center", fontSize: 13, color: "#666" }}>
            Didn't receive the code?{" "}
            {countdown > 0 ? (
              <span style={{ color: "#999" }}>Resend in {countdown}s</span>
            ) : (
              <button onClick={handleResend} disabled={resending}
                style={{ background: "none", border: "none", color: "#1e50a0", fontWeight: "bold", cursor: "pointer", fontSize: 13 }}>
                {resending ? "Sending..." : "Resend Code"}
              </button>
            )}
          </div>

          {/* Back to signup */}
          <div style={{ textAlign: "center", marginTop: 16, fontSize: 13 }}>
            <a href="/signup" style={{ color: "#888", textDecoration: "none" }}>← Back to Sign Up</a>
          </div>
        </div>
      </div>
    </div>
  );
}
