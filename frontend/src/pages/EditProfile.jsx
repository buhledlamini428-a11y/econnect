import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import TopBar from "../components/TopBar";
import { useAuth } from "../context/AuthContext";

export default function EditProfile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: user.fullName || "", bio: user.bio || "", region: user.region || "",
    city: user.city || "", area: user.area || "", languages: user.languages || "",
  });
  const [loading, setLoading] = useState(false);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put("/users/me", form);
      setUser(res.data.user);
      localStorage.setItem("econnect_user", JSON.stringify(res.data.user));
      navigate("/profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-ivory">
      <TopBar title="Edit profile" showBack />
      <form onSubmit={handleSubmit} className="px-4 py-4 space-y-3">
        <input placeholder="Full name" value={form.fullName} onChange={(e) => update("fullName", e.target.value)}
          className="w-full border border-black/10 rounded-xl px-4 py-3 bg-white" />
        <textarea placeholder="Bio" rows={3} value={form.bio} onChange={(e) => update("bio", e.target.value)}
          className="w-full border border-black/10 rounded-xl px-4 py-3 bg-white" />
        <div className="flex gap-2">
          <input placeholder="Region" value={form.region} onChange={(e) => update("region", e.target.value)}
            className="w-1/2 border border-black/10 rounded-xl px-4 py-3 bg-white" />
          <input placeholder="City/Town" value={form.city} onChange={(e) => update("city", e.target.value)}
            className="w-1/2 border border-black/10 rounded-xl px-4 py-3 bg-white" />
        </div>
        <input placeholder="Area" value={form.area} onChange={(e) => update("area", e.target.value)}
          className="w-full border border-black/10 rounded-xl px-4 py-3 bg-white" />
        <input placeholder="Languages (comma-separated)" value={form.languages} onChange={(e) => update("languages", e.target.value)}
          className="w-full border border-black/10 rounded-xl px-4 py-3 bg-white" />
        <button disabled={loading} className="w-full bg-teal text-white font-semibold py-3.5 rounded-xl2 disabled:opacity-60">
          {loading ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}