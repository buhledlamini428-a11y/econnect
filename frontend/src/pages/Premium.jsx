import { useEffect, useState } from "react";
import api from "../api/client";
import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";

export default function Premium() {
  const [plans, setPlans] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/premium/plans").then((res) => setPlans(res.data.plans));
  }, []);

  async function subscribe(planKey) {
    const res = await api.post("/premium/subscribe", { plan: planKey });
    setMessage(`Payment reference ${res.data.payment.reference} created — E${res.data.payment.amount}. Complete payment with your provider to activate.`);
  }

  return (
    <div className="min-h-screen bg-ivory page-scroll">
                  <TopBar title="Premium services" subtitle="Boost your visibility on Netta" showBack />
      <div className="px-4 py-4 space-y-3">
        <p className="text-ink/60 text-sm">Basic use of E-connect is always free. Pay only for these optional extras.</p>
        {plans.map((p) => (
          <div key={p.key} className="bg-white rounded-xl2 p-4 border border-black/5 flex items-center justify-between">
            <div>
              <p className="font-semibold text-ink">{p.label}</p>
              <p className="text-ink/50 text-xs">{p.period === "monthly" ? "per month" : "one-time"}</p>
            </div>
            <div className="text-right">
              <p className="font-display font-bold text-teal">E{p.price}</p>
              <button onClick={() => subscribe(p.key)} className="text-xs bg-ochre text-teal-dark font-semibold px-3 py-1.5 rounded-full mt-1">
                Get
              </button>
            </div>
          </div>
        ))}
        {message && <p className="text-sm bg-teal/10 text-teal p-3 rounded-xl2">{message}</p>}
      </div>
      <BottomNav />
    </div>
  );
}