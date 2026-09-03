import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/client";
import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";
import ListingCard from "../components/ListingCard";

const TABS = ["JOB", "TASK", "SERVICE", "PRODUCT", "REQUEST"];
const LABEL = { JOB: "Jobs", TASK: "Tasks", SERVICE: "Services", PRODUCT: "Buy & Sell", REQUEST: "Requests" };

export default function Explore() {
  const [params, setParams] = useSearchParams();
  const type = params.get("type") || "JOB";
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get("/listings", { params: { type } }).then((res) => setListings(res.data.listings)).finally(() => setLoading(false));
  }, [type]);

  return (
    <div className="min-h-screen bg-ivory page-scroll">
      <TopBar title="Explore" />
      <div className="flex gap-2 px-4 py-3 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setParams({ type: t })}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              type === t ? "bg-teal text-white" : "bg-white text-ink/70 border border-black/10"
            }`}
          >
            {LABEL[t]}
          </button>
        ))}
      </div>

      <div className="px-4">
        {loading && <p className="text-ink/50 text-sm">Loading...</p>}
        {!loading && listings.length === 0 && (
          <p className="text-ink/50 text-sm mt-6">No {LABEL[type].toLowerCase()} yet. Be the first to post one.</p>
        )}
                 <div className="space-y-3">
          {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}