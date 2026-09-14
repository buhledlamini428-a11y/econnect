 import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function HomeHeader() {
  const { user } = useAuth();
  const [unread, setUnread] = useState(0);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/notifications/unread-count").then((res) => setUnread(res.data.count)).catch(() => {});
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <div className="bg-teal text-white px-4 pt-5 pb-6 rounded-b-[1.75rem] shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
           <img src="/logo.png" alt="Netta" className="h-10 w-auto" />
           <div className="hidden sm:block leading-tight">
            <p className="text-sm font-semibold">People. Opportunities. Trust.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/notifications"
            className="relative w-9 h-9 rounded-full bg-white/10 flex items-center justify-center
                       transition-all duration-200 hover:bg-white/20 hover:scale-105"
          >
            <span className="text-lg">🔔</span>
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 bg-ochre text-teal-dark text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </Link>
          <Link
            to="/profile"
            className="flex items-center gap-1.5 bg-white/10 rounded-full pl-1 pr-3 py-1
                       transition-all duration-200 hover:bg-white/20"
          >
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
              {user?.fullName?.[0] || "U"}
            </span>
            <span className="text-sm font-semibold whitespace-nowrap">Hi, {user?.fullName?.split(" ")[0]}</span>
          </Link>
        </div>
      </div>

      <form onSubmit={handleSearch} className="mt-4">
        <div className="flex gap-2 bg-white rounded-2xl shadow-lg p-1.5
                         transition-all duration-200 focus-within:shadow-xl focus-within:ring-2 focus-within:ring-ochre/50">
          <span className="flex items-center pl-2 text-ink/40">🔍</span>
          <input
            value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search jobs, services, products..."
            className="flex-1 px-1 py-2 text-sm outline-none bg-transparent text-ink"
          />
          <button
            type="submit"
            className="bg-teal text-white text-sm font-semibold px-4 rounded-xl
                       transition-all duration-200 hover:bg-teal-light hover:shadow-md active:scale-95"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
}