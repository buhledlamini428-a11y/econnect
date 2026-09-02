import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { identifier, password });
      login(res.data.token, res.data.user);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-ivory px-6 py-10">
      <h1 className="font-display font-bold text-2xl text-ink mb-1">Welcome back</h1>
      <p className="text-ink/60 mb-6">Log in to continue to E-connect</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-ink/70">Phone, email, or username</label>
          <input
            value={identifier} onChange={(e) => setIdentifier(e.target.value)}
            className="w-full mt-1 border border-black/10 rounded-xl px-4 py-3 bg-white" required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink/70">Password</label>
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 border border-black/10 rounded-xl px-4 py-3 bg-white" required
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-teal text-white font-semibold py-3.5 rounded-xl2 disabled:opacity-60">
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="text-center text-sm text-ink/60 mt-6">
        No account? <Link to="/register" className="text-teal font-semibold">Sign up</Link>
      </p>
    </div>
  );
}