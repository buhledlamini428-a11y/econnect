import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import HomeHeader from "../components/HomeHeader";
import BottomNav from "../components/BottomNav";
import ListingCard from "../components/ListingCard";

const QUICK = [
  { type: "JOB", label: "Jobs", subtitle: "Find opportunities", icon: "💼", bg: "bg-teal/10", hoverBg: "group-hover:bg-teal/20" },
  { type: "TASK", label: "Tasks", subtitle: "Get things done", icon: "🛠️", bg: "bg-blue-500/10", hoverBg: "group-hover:bg-blue-500/20" },
  { type: "SERVICE", label: "Services", subtitle: "Professional help", icon: "🧰", bg: "bg-pink-500/10", hoverBg: "group-hover:bg-pink-500/20" },
  { type: "PRODUCT", label: "Buy & Sell", subtitle: "Discover deals", icon: "🛍️", bg: "bg-sky-500/10", hoverBg: "group-hover:bg-sky-500/20" },
  { type: "REQUEST", label: "Requests", subtitle: "Post a request", icon: "📣", bg: "bg-ochre/10", hoverBg: "group-hover:bg-ochre/20" },
];

export default function Home() {
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/listings", { params: { pageSize: 10 } }).then((res) => setListings(res.data.listings));
  }, []);

  return (
    <div className="min-h-screen bg-ivory page-scroll">
      <HomeHeader />

      <div className="px-4 py-5">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {QUICK.map((q) => (
            <button
              key={q.type}
              onClick={() => navigate(`/explore?type=${q.type}`)}
              className="group flex flex-col items-center gap-2 bg-white rounded-xl2 py-4 px-2 shadow-sm text-center
                         border border-transparent transition-all duration-200
                         hover:shadow-md hover:-translate-y-1 hover:border-teal/10 active:translate-y-0"
            >
              <span className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-colors duration-200 ${q.bg} ${q.hoverBg}`}>
                {q.icon}
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink">{q.label}</span>
                <span className="block text-[11px] text-ink/50">{q.subtitle}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mt-6 mb-3">
          <h2 className="font-display font-semibold text-ink flex items-center gap-1.5">
            <span className="text-ochre-dark">★</span> Recommended near you
          </h2>
          <button
            onClick={() => navigate("/explore")}
            className="text-sm font-semibold text-teal transition-all duration-200 hover:text-teal-light hover:gap-2 flex items-center gap-1"
          >
            See all →
          </button>
        </div>
        <div className="space-y-3">
          {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
      </div>

      <button
        onClick={() => navigate("/post")}
        className="fixed bottom-24 right-5 brand-mark text-white font-bold w-14 h-14 rounded-full shadow-lg text-2xl z-20
                   transition-all duration-200 hover:shadow-xl hover:scale-110 active:scale-95"
        aria-label="Post a listing"
      >
        +
      </button>
      <BottomNav />
    </div>
  );
}