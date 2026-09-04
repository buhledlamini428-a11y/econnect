import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";
import ListingCard from "../components/ListingCard";
import { ListingCardSkeletonList } from "../components/Skeleton";
import EmptyState from "../components/EmptyState";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const [region, setRegion] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  function runSearch() {
    setLoading(true);
    api.get("/listings", {
      params: { q, region: region || undefined, minPrice: minPrice || undefined, maxPrice: maxPrice || undefined, sort },
    }).then((res) => setResults(res.data.listings)).finally(() => setLoading(false));
  }

  useEffect(() => { runSearch(); }, [params]);

  return (
    <div className="min-h-screen bg-ivory page-scroll">
      <TopBar title="Search" showBack />
      <div className="sticky top-[56px] z-10 bg-ivory px-4 py-3 space-y-2 shadow-sm">
        <div className="flex gap-2">
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runSearch()}
            placeholder="Search jobs, services, products..."
            className="flex-1 border border-black/10 rounded-xl px-4 py-2.5 bg-white transition-all duration-200 focus:ring-2 focus:ring-ochre/40"
          />
          <button
            onClick={() => setShowFilters((s) => !s)}
            className="px-4 rounded-xl border border-black/10 bg-white text-sm transition-all duration-200 hover:border-teal/30"
          >
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="bg-white rounded-xl2 p-3 border border-black/10 space-y-2">
            <input value={region} onChange={(e) => setRegion(e.target.value)} placeholder="Region"
              className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm" />
            <div className="flex gap-2">
              <input value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min price (E)"
                className="w-1/2 border border-black/10 rounded-lg px-3 py-2 text-sm" />
              <input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max price (E)"
                className="w-1/2 border border-black/10 rounded-lg px-3 py-2 text-sm" />
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm">
              <option value="newest">Newest</option>
              <option value="price_low">Lowest price</option>
              <option value="price_high">Highest price</option>
            </select>
            <button
              onClick={runSearch}
              className="w-full bg-teal text-white py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-teal-light active:scale-95"
            >
              Apply filters
            </button>
          </div>
        )}
      </div>

      <div className="px-4">
        {loading ? (
          <div className="mt-3"><ListingCardSkeletonList count={4} /></div>
        ) : results.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No results found"
            description="Try a different keyword or clear your filters."
            actionLabel="Post a listing instead"
            onAction={() => navigate("/post")}
          />
        ) : (
          <div className="space-y-3 mt-3">
            {results.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}