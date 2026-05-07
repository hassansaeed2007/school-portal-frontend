import { useState } from "react";

export default function PasswordInput({ name, value, onChange, placeholder = "Enter password", style = {} }) {
  const [show, setShow] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ width: "100%", padding: "10px 40px 10px 12px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14, boxSizing: "border-box", outline: "none", ...style }}
      />
      <button type="button" onClick={() => setShow(!show)}
        style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: 16, padding: 0 }}>
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
}
