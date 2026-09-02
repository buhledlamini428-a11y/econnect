import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function OtpVerify() {
  const { state } = useLocation();
  const [phone] = useState(state?.phone || "");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleVerify(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/verify-otp", { phone, code });
      login(res.data.token, res.data.user);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.error || "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    try {
      await api.post("/auth/resend-otp", { phone });
    } catch {}
  }

  return (
    <div className="min-h-screen bg-ivory px-6 py-10">
      <h1 className="font-display font-bold text-2xl text-ink mb-1">Verify your phone</h1>
      <p className="text-ink/60 mb-6">Enter the 6-digit code sent to {phone}</p>

      <form onSubmit={handleVerify} className="space-y-4">
        <input
          value={code} onChange={(e) => setCode(e.target.value)} maxLength={6}
          className="w-full text-center text-2xl tracking-[0.5em] border border-black/10 rounded-xl px-4 py-4 bg-white" required
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-teal text-white font-semibold py-3.5 rounded-xl2 disabled:opacity-60">
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>

      <button onClick={handleResend} className="text-teal text-sm font-semibold mt-4">Resend code</button>
    </div>
  );
}