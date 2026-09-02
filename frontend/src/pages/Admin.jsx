import { useEffect, useState } from "react";
import api from "../api/client";
import TopBar from "../components/TopBar";

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [tab, setTab] = useState("stats");

  useEffect(() => {
    api.get("/admin/stats").then((res) => setStats(res.data));
    api.get("/admin/reports").then((res) => setReports(res.data.reports));
  }, []);

  async function resolveReport(id, status) {
    await api.put(`/admin/reports/${id}`, { status });
    setReports((r) => r.filter((rep) => rep.id !== id));
  }

  return (
    <div className="min-h-screen bg-ivory">
      <TopBar title="Admin dashboard" />
      <div className="flex gap-2 px-4 py-3">
        {["stats", "reports"].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${tab === t ? "bg-teal text-white" : "bg-white border border-black/10"}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "stats" && stats && (
        <div className="grid grid-cols-2 gap-3 px-4">
          {Object.entries(stats).filter(([k]) => k !== "currency").map(([key, value]) => (
            <div key={key} className="bg-white rounded-xl2 p-3 border border-black/5">
              <p className="text-xs text-ink/50 capitalize">{key.replace(/([A-Z])/g, " $1")}</p>
              <p className="font-display font-bold text-teal text-lg">
                {key === "revenue" ? `E${value.toLocaleString()}` : value}
              </p>
            </div>
          ))}
        </div>
      )}

      {tab === "reports" && (
        <div className="px-4 space-y-2">
          {reports.length === 0 && <p className="text-ink/50 text-sm">No pending reports.</p>}
          {reports.map((r) => (
            <div key={r.id} className="bg-white rounded-xl2 p-3 border border-black/5">
              <p className="text-sm font-semibold text-ink capitalize">{r.reason.replace("_", " ")}</p>
              <p className="text-xs text-ink/60">{r.details}</p>
              <p className="text-xs text-ink/40 mt-1">
                By {r.reporter.fullName} {r.reportedUser && `· against ${r.reportedUser.fullName}`} {r.listing && `· on "${r.listing.title}"`}
              </p>
              <div className="flex gap-2 mt-2">
                <button onClick={() => resolveReport(r.id, "actioned")} className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-full">Action</button>
                <button onClick={() => resolveReport(r.id, "dismissed")} className="text-xs bg-black/5 text-ink px-3 py-1.5 rounded-full">Dismiss</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}