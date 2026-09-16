import { useEffect, useState } from "react";
import api from "../api/client";
import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";
import EmptyState from "../components/EmptyState";
import { timeAgo } from "../utils/timeAgo";

const ICONS = {
  message: "💬",
  application: "📋",
  account_status: "⚠️",
  payment: "💳",
  rating: "⭐",
  default: "🔔",
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/notifications").then((res) => setNotifications(res.data.notifications)).finally(() => setLoading(false));
    api.put("/notifications/read-all").catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-ivory page-scroll">
      <TopBar title="Notifications" showBack />
      <div className="px-4 py-3">
        {loading ? (
          <div className="space-y-2 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-white rounded-xl2 border border-black/5" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState icon="🔔" title="No notifications yet" description="Updates about your listings, messages, and account will show up here." />
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`flex gap-3 bg-white rounded-xl2 p-3 border transition-all duration-200 hover:shadow-md
                  ${n.isRead ? "border-black/5" : "border-teal/20 bg-teal/[0.03]"}`}
              >
                <span className="text-xl shrink-0">{ICONS[n.type] || ICONS.default}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-ink text-sm">{n.title}</p>
                    {!n.isRead && <span className="w-2 h-2 rounded-full bg-ochre shrink-0" />}
                  </div>
                  <p className="text-ink/60 text-sm mt-0.5">{n.body}</p>
                  <p className="text-ink/40 text-xs mt-1">{timeAgo(n.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}