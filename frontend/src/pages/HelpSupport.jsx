 import { useState } from "react";
import TopBar from "../components/TopBar";

const FAQS = [
  { q: "How do I post a listing?", a: "Tap the + button on the Home screen or the Post tab in the bottom navigation, choose a listing type (Job, Task, Service, Product, or Request), fill in the details, and submit." },
  { q: "Is Netta free to use?", a: "Yes. Creating an account, browsing, searching, messaging, and posting normal listings are all free. Optional extras like the Verified Badge or featured listings are paid." },
  { q: "How does the Trust Score work?", a: "Your Trust Score reflects your ratings, completed jobs, account verification, and activity history — not just star ratings alone. It updates automatically as you use the app." },
  { q: "How do I report a suspicious listing or user?", a: "Open the listing or profile and tap Report, choose a reason, and our team will review it." },
  { q: "I didn't receive my verification code, what do I do?", a: "Check your spam or promotions folder, since verification emails sometimes land there. You can also request a new code from the verification screen." },
];

export default function HelpSupport() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="min-h-screen bg-ivory page-scroll">
      <TopBar title="Help & support" subtitle="Answers to common questions" showBack />
      <div className="px-4 py-4 space-y-2">
        {FAQS.map((item, i) => (
          <div key={i} className="bg-white rounded-xl2 border border-black/5 overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between gap-3 p-4 text-left"
            >
              <span className="font-semibold text-ink text-sm">{item.q}</span>
              <span className={`text-ink/40 transition-transform duration-200 ${openIndex === i ? "rotate-180" : ""}`}>⌄</span>
            </button>
            {openIndex === i && (
              <p className="px-4 pb-4 text-ink/60 text-sm leading-relaxed">{item.a}</p>
            )}
          </div>
        ))}

        <a
                
          href="mailto:support@netta.app"
          className="block text-center bg-teal text-white font-semibold py-3 rounded-xl2 mt-4 transition-all duration-200 hover:bg-teal-light"
        >
          Still need help? Email us
        </a>
      </div>
    </div>
  );
}