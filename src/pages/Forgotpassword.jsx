import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!email.trim()) return toast.error("Email is required");

    setLoading(true);
    try {
      const res = await api.post("/reset/verify-email", { email });

      toast.success("Email verified. Enter new password.");
      localStorage.setItem("resetUserId", res.data.userId);

      window.location.href = "/reset-password";
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Forgot Password</h2>
      <p>Enter your email to reset your password</p>

      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={handleVerify} disabled={loading}>
        {loading ? "Checking..." : "Verify Email"}
      </button>
    </div>
  );
};

export default ForgotPassword;
