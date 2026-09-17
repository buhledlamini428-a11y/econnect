import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";
import { MessageListSkeleton } from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import { timeAgo } from "../utils/timeAgo";
import { useAuth } from "../context/AuthContext";

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    api.get("/messages/conversations").then((res) => setConversations(res.data.conversations)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-ivory page-scroll">
            <TopBar title="Messages" subtitle="Chats with buyers, sellers and employers" />
      <div className="py-3">
        {loading ? (
          <MessageListSkeleton />
        ) : conversations.length === 0 ? (
          <EmptyState icon="💬" title="No conversations yet" description="Messages from buyers, sellers, and employers will show up here." />
        ) : (
          <div className="px-4">
            {conversations.map((c) => {
              const other = c.userAId === user.id ? c.userB : c.userA;
              const last = c.messages[0];
              return (
                <Link
                  key={c.id} to={`/messages/${c.id}`}
                  className="flex items-center gap-3 bg-white rounded-xl2 p-3 mb-2 border border-black/5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="w-11 h-11 rounded-full bg-teal/10 flex items-center justify-center font-display font-semibold text-teal shrink-0">
                    {other.fullName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-ink text-sm truncate">{other.fullName}</p>
                      {last && <span className="text-[11px] text-ink/40 shrink-0">{timeAgo(last.createdAt)}</span>}
                    </div>
                    {c.listing && <p className="text-xs text-ochre-dark">{c.listing.title}</p>}
                    <p className="text-xs text-ink/50 truncate">{last?.content}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}