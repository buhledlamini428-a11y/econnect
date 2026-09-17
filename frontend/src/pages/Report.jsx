import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import TopBar from "../components/TopBar";

const REASONS = [
  ["scam", "Scam"], ["fraud", "Fraud"], ["fake_job", "Fake job"], ["fake_product", "Fake product"],
  ["harassment", "Harassment"], ["misleading", "Misleading information"], ["inappropriate", "Inappropriate content"],
  ["non_delivery", "Non-delivery"], ["abuse", "Abuse"], ["suspicious_account", "Suspicious account"], ["other", "Other"],
];

export default function Report() {
  const [params] = useSearchParams();
  const listingId = params.get("listingId");
  const reportedUserId = params.get("userId");
  const [reason, setReason] = useState("scam");
  const [details, setDetails] = useState("");
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    await api.post("/reports", { listingId, reportedUserId, reason, details });
    setDone(true);
    setTimeout(() => navigate(-1), 1500);
  }

  return (
    <div className="min-h-screen bg-ivory">
            <TopBar title="Report" subtitle="Help us keep Netta safe" showBack />
      {done ? (
        <p className="p-6 text-center text-teal font-medium">Report submitted. Our team will review it.</p>
      ) : (
        <form onSubmit={handleSubmit} className="px-4 py-4 space-y-3">
          <select value={reason} onChange={(e) => setReason(e.target.value)}
            className="w-full border border-black/10 rounded-xl px-4 py-3 bg-white">
            {REASONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <textarea placeholder="Additional details (optional)" rows={4} value={details} onChange={(e) => setDetails(e.target.value)}
            className="w-full border border-black/10 rounded-xl px-4 py-3 bg-white" />
          <button className="w-full bg-red-600 text-white font-semibold py-3.5 rounded-xl2">Submit report</button>
        </form>
      )}
    </div>
  );
}