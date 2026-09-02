import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";
import TopBar from "../components/TopBar";
import { useAuth } from "../context/AuthContext";

export default function Conversation() {
  const { id } = useParams();
  const [convo, setConvo] = useState(null);
  const [text, setText] = useState("");
  const { user } = useAuth();
  const bottomRef = useRef(null);

  function load() {
    api.get(`/messages/conversations/${id}`).then((res) => setConvo(res.data.conversation));
  }

  useEffect(() => { load(); }, [id]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [convo]);

  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim()) return;
    await api.post("/messages", { conversationId: id, content: text });
    setText("");
    load();
  }

  if (!convo) return <div className="p-8 text-center text-teal">Loading...</div>;

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <TopBar title="Conversation" showBack />
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {convo.messages.map((m) => (
          <div key={m.id} className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
            m.senderId === user.id ? "bg-teal text-white ml-auto rounded-br-sm" : "bg-white border border-black/5 rounded-bl-sm"
          }`}>
            {m.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSend} className="flex gap-2 p-3 border-t border-black/5 bg-white">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..."
          className="flex-1 border border-black/10 rounded-full px-4 py-2.5 text-sm" />
        <button className="bg-teal text-white px-5 rounded-full text-sm font-semibold">Send</button>
      </form>
    </div>
  );
}