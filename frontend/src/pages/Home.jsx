import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";
import ListingCard from "../components/ListingCard";

const QUICK = [
  { type: "JOB", label: "Jobs", icon: "💼" },
  { type: "TASK", label: "Tasks", icon: "🛠️" },
  { type: "SERVICE", label: "Services", icon: "🧰" },
  { type: "PRODUCT", label: "Buy & Sell", icon: "🛍️" },
  { type: "REQUEST", label: "Requests", icon: "📣" },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/listings", { params: { pageSize: 10 } }).then((res) => setListings(res.data.listings));
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <div className="min-h-screen bg-ivory page-scroll">
      <TopBar />
      <div className="px-4 py-4">
        <form onSubmit={handleSearch}>
          <input
            value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search jobs, services, products..."
            className="w-full border border-black/10 rounded-xl2 px-4 py-3 bg-white shadow-sm"
          />
        </form>

        <div className="grid grid-cols-5 gap-2 mt-4">
          {QUICK.map((q) => (
            <button
              key={q.type}
              onClick={() => navigate(`/explore?type=${q.type}`)}
              className="flex flex-col items-center gap-1 bg-white rounded-xl2 py-3 shadow-sm"
            >
              <span className="text-xl">{q.icon}</span>
              <span className="text-[11px] font-medium text-ink/70">{q.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mt-6 mb-3">
          <h2 className="font-display font-semibold text-ink">Recommended near you</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
      </div>

             <button
        onClick={() => navigate("/post")}
        className="fixed bottom-24 right-5 brand-mark text-white font-bold w-14 h-14 rounded-full shadow-lg text-2xl z-20"
        aria-label="Post a listing"
      >
        +
      </button>
      <BottomNav />
    </div>
  );
}