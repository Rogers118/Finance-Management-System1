import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("resetUserId");

  const handleReset = async () => {
    if (!password.trim()) return toast.error("Enter a new password");

    setLoading(true);
    try {
      await api.post("/reset/reset-password", {
        userId,
        newPassword: password,
      });

      toast.success("Password updated successfully!");

      localStorage.removeItem("resetUserId");
      window.location.href = "/login";
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <h2>Reset Password</h2>

      <input
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleReset} disabled={loading}>
        {loading ? "Updating..." : "Reset Password"}
      </button>
    </div>
  );
};

export default ResetPassword;
