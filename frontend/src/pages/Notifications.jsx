import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";
import EmptyState from "../components/EmptyState";
import { timeAgo } from "../utils/timeAgo";

const TYPE_META = {
  message: { icon: "💬", bg: "bg-gradient-to-br from-sky-400 to-blue-600", filter: "messages" },
  application: { icon: "📋", bg: "bg-gradient-to-br from-teal to-teal-dark", filter: "system" },
  account_status: { icon: "⚠️", bg: "bg-gradient-to-br from-amber-400 to-orange-600", filter: "system" },
  payment: { icon: "💳", bg: "bg-gradient-to-br from-emerald-400 to-emerald-600", filter: "system" },
  rating: { icon: "⭐", bg: "bg-gradient-to-br from-ochre to-ochre-dark", filter: "updates" },
  default: { icon: "🔔", bg: "bg-gradient-to-br from-purple-400 to-purple-600", filter: "updates" },
};

const FILTERS = [
  { key: "all", label: "All", icon: "☰" },
  { key: "messages", label: "Messages", icon: "✉️" },
  { key: "system", label: "System", icon: "🔔" },
  { key: "updates", label: "Updates", icon: "👥" },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/notifications").then((res) => setNotifications(res.data.notifications)).finally(() => setLoading(false));
    api.put("/notifications/read-all").catch(() => {});
  }, []);

  const filtered = notifications.filter((n) => {
    if (filter === "all") return true;
    const meta = TYPE_META[n.type] || TYPE_META.default;
    return meta.filter === filter;
  });

  function handleClick(n) {
    if (n.type === "message") navigate("/messages");
  }

  return (
    <div className="min-h-screen bg-ivory page-scroll">
      <TopBar title="Notifications" subtitle="Stay updated with your latest messages and activities" showBack />

      <div className="flex gap-2 px-4 py-4 overflow-x-auto">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200
              ${filter === f.key ? "bg-teal text-white shadow-md" : "bg-white text-ink/70 border border-black/10 hover:border-teal/30"}`}
          >
            <span>{f.icon}</span> {f.label}
          </button>
        ))}
      </div>

      <div className="px-4 space-y-3">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 bg-white rounded-xl2 border border-black/5" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon="🔔" title="No notifications yet" description="Updates about your listings, messages, and account will show up here." />
        ) : (
          filtered.map((n) => {
            const meta = TYPE_META[n.type] || TYPE_META.default;
            return (
              <button
                key={n.id}
                onClick={() => handleClick(n)}
                className={`w-full flex items-center gap-3 text-left rounded-xl2 p-4 border transition-all duration-200 hover:shadow-md
                  ${n.isRead ? "bg-white border-black/5" : "bg-teal/[0.06] border-l-4 border-l-teal border-y-black/5 border-r-black/5"}`}
              >
                <span className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center text-xl text-white ${meta.bg}`}>
                  {meta.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-ink text-base">{n.title}</p>
                  <p className="text-ink/60 text-sm mt-0.5 truncate">{n.body}</p>
                  <p className="text-ink/40 text-xs mt-1">{timeAgo(n.createdAt)}</p>
                </div>
                <div className="flex flex-col items-center gap-2 shrink-0">
                  {!n.isRead && <span className="w-2.5 h-2.5 rounded-full bg-teal" />}
                  <span className="text-ink/30 text-lg">›</span>
                </div>
              </button>
            );
          })
        )}
      </div>
      <BottomNav />
    </div>
  );
}