import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import StepProgress from "../components/StepProgress";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "", username: "", phone: "", email: "", password: "", region: "", city: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      
           await api.post("/auth/register", form);
      navigate("/verify-otp", { state: { email: form.email } }); 
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-ivory px-6 py-8">
            <StepProgress step={1} total={2} labels={["Your details", "Verify email"]} />
      <h1 className="font-display font-bold text-2xl text-ink mb-1">Create your account</h1>
      <p className="text-ink/60 mb-6">Basic use of Netta is always free.</p> 

      <form onSubmit={handleSubmit} className="space-y-3">
        <input placeholder="Full name" value={form.fullName} onChange={(e) => update("fullName", e.target.value)}
          className="w-full border border-black/10 rounded-xl px-4 py-3 bg-white" required />
        <input placeholder="Username" value={form.username} onChange={(e) => update("username", e.target.value)}
          className="w-full border border-black/10 rounded-xl px-4 py-3 bg-white" required />
        <input placeholder="Phone (e.g. +268 76 000 000)" value={form.phone} onChange={(e) => update("phone", e.target.value)}
          className="w-full border border-black/10 rounded-xl px-4 py-3 bg-white" required />
               <input type="email" placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)}
          className="w-full border border-black/10 rounded-xl px-4 py-3 bg-white" required />
        <input type="password" placeholder="Password (min 8 characters)" value={form.password}
          onChange={(e) => update("password", e.target.value)}
          className="w-full border border-black/10 rounded-xl px-4 py-3 bg-white" required />
        <div className="flex gap-3">
          <input placeholder="Region" value={form.region} onChange={(e) => update("region", e.target.value)}
            className="w-1/2 border border-black/10 rounded-xl px-4 py-3 bg-white" />
          <input placeholder="City/Town" value={form.city} onChange={(e) => update("city", e.target.value)}
            className="w-1/2 border border-black/10 rounded-xl px-4 py-3 bg-white" />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-teal text-white font-semibold py-3.5 rounded-xl2 disabled:opacity-60">
          {loading ? "Creating account..." : "Continue"}
        </button>
      </form>
    </div>
  );
}