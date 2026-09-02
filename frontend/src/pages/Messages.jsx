import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";
import { useAuth } from "../context/AuthContext";

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    api.get("/messages/conversations").then((res) => setConversations(res.data.conversations));
  }, []);

  return (
    <div className="min-h-screen bg-ivory page-scroll">
      <TopBar title="Messages" />
      <div className="px-4 py-3">
        {conversations.length === 0 && <p className="text-ink/50 text-sm mt-6 text-center">No conversations yet.</p>}
        {conversations.map((c) => {
          const other = c.userAId === user.id ? c.userB : c.userA;
          const last = c.messages[0];
          return (
            <Link key={c.id} to={`/messages/${c.id}`} className="flex items-center gap-3 bg-white rounded-xl2 p-3 mb-2 border border-black/5">
              <div className="w-11 h-11 rounded-full bg-teal/10 flex items-center justify-center font-display font-semibold text-teal">
                {other.fullName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-ink text-sm">{other.fullName}</p>
                {c.listing && <p className="text-xs text-ochre-dark">{c.listing.title}</p>}
                <p className="text-xs text-ink/50 truncate">{last?.content}</p>
              </div>
            </Link>
          );
        })}
      </div>
      <BottomNav />
    </div>
  );
}