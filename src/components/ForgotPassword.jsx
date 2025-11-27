import { useState } from "react";
import api from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [userId, setUserId] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/reset/verify-email", { email });
      setUserId(res.data.userId);
      setMsg("Email verified! Enter your new password below.");
    } catch (err) {
      setMsg("Email not found.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Forgot Password</h2>

      {!userId && (
        <form onSubmit={handleVerify}>
          <input type="email" placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)} required />
          <button type="submit">Verify Email</button>
        </form>
      )}

      <p>{msg}</p>

      {userId && <ResetPasswordForm userId={userId} />}
    </div>
  );
}

const ResetPasswordForm = ({ userId }) => {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const updatePassword = async (e) => {
    e.preventDefault();

    const res = await api.post("/reset/reset-password", {
      userId,
      newPassword: password,
    });

    setMsg(res.data.message);
  };

  return (
    <form onSubmit={updatePassword}>
      <input type="password" placeholder="New Password"
        onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Update Password</button>
      <p>{msg}</p>
    </form>
  );
};
