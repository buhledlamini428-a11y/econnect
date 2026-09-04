import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";
import ListingCard from "../components/ListingCard";
import { ListingCardSkeletonList } from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import { LISTING_TYPE_LIST } from "../constants/listingTypes";

export default function Explore() {
  const [params, setParams] = useSearchParams();
  const type = params.get("type") || "JOB";
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.get("/listings", { params: { type } }).then((res) => setListings(res.data.listings)).finally(() => setLoading(false));
  }, [type]);

  const activeMeta = LISTING_TYPE_LIST.find((t) => t.value === type);

  return (
    <div className="min-h-screen bg-ivory page-scroll">
      <TopBar title="Explore" />
      <div className="sticky top-[56px] z-10 bg-ivory flex gap-2 px-4 py-3 overflow-x-auto shadow-sm">
        {LISTING_TYPE_LIST.map((t) => (
          <button
            key={t.value}
            onClick={() => setParams({ type: t.value })}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
              ${type === t.value ? "bg-teal text-white shadow-sm" : "bg-white text-ink/70 border border-black/10 hover:border-teal/30"}`}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      <div className="px-4">
        {loading ? (
          <div className="mt-3"><ListingCardSkeletonList count={4} /></div>
        ) : listings.length === 0 ? (
          <EmptyState
            icon={activeMeta?.icon || "📭"}
            title={`No ${activeMeta?.label.toLowerCase() || "listings"} yet`}
            description="Be the first to post one in your area."
            actionLabel="Post a listing"
            onAction={() => navigate("/post")}
          />
        ) : (
          <div className="space-y-3 mt-3">
            {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}