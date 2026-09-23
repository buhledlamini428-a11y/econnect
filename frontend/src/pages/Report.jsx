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

     const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

     async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/reports", {
        listingId: listingId || undefined,
        reportedUserId: reportedUserId || undefined,
        reason,
        details: details || undefined,
      });
      setDone(true);
      setTimeout(() => navigate(-1), 1500);
        } catch (err) {
      const fieldErrors = err.response?.data?.details?.fieldErrors;
      if (fieldErrors) {
        const firstField = Object.keys(fieldErrors)[0];
        const firstMessage = fieldErrors[firstField]?.[0];
        setError(firstMessage ? `${firstField}: ${firstMessage}` : "Could not submit report. Please try again.");
      } else {
        setError(err.response?.data?.error || "Could not submit report. Please try again.");
      }
    } finally {     
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-ivory">
            <TopBar title="Report" subtitle="Help us keep Netta safe" showBack />
      {done ? (
        <p className="p-6 text-center text-teal font-medium">Report submitted. Our team will review it.</p>
      ) : (
        <form onSubmit={handleSubmit} className="px-4 py-4 space-y-3">
                     <select
            value={reason} onChange={(e) => setReason(e.target.value)}
            className="w-full border border-black/10 rounded-xl pl-4 pr-10 py-3 bg-white appearance-none bg-no-repeat"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%231B1730' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundPosition: "right 12px center",
            }}
          >
            {REASONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <textarea placeholder="Additional details (optional)" rows={4} value={details} onChange={(e) => setDetails(e.target.value)}
            className="w-full border border-black/10 rounded-xl px-4 py-3 bg-white" />
               {error && <p className="text-red-600 text-sm">{error}</p>}
          <button disabled={loading} className="w-full bg-red-600 text-white font-semibold py-3.5 rounded-xl2 disabled:opacity-60">
            {loading ? "Submitting..." : "Submit report"}
          </button>
        </form>
      )}
    </div>
  );
}