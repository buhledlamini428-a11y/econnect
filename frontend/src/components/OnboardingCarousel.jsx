import { useState } from "react";

const SLIDES = [
  { icon: "📣", title: "Post what you need", body: "Advertise a job, offer a service, or list something for sale in minutes." },
  { icon: "🤝", title: "Connect locally", body: "Message people near you directly — no middlemen, no fees to browse or apply." },
  { icon: "🛡️", title: "Built on trust", body: "Every user has a Trust Score based on real activity, ratings, and verification." },
];

export default function OnboardingCarousel() {
  const [visible, setVisible] = useState(() => !localStorage.getItem("econnect_onboarded"));
  const [index, setIndex] = useState(0);

  function dismiss() {
    localStorage.setItem("econnect_onboarded", "1");
    setVisible(false);
  }

  if (!visible) return null;
  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-sm p-6 text-center">
        <span className="text-5xl">{slide.icon}</span>
        <h2 className="font-display font-bold text-lg text-ink mt-3">{slide.title}</h2>
        <p className="text-ink/60 text-sm mt-2">{slide.body}</p>

        <div className="flex justify-center gap-1.5 mt-5">
          {SLIDES.map((_, i) => (
            <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === index ? "bg-teal" : "bg-black/10"}`} />
          ))}
        </div>

        <div className="flex gap-2 mt-6">
          <button onClick={dismiss} className="flex-1 text-sm font-semibold text-ink/50 py-2.5">Skip</button>
          <button
            onClick={() => (isLast ? dismiss() : setIndex((i) => i + 1))}
            className="flex-1 bg-teal text-white text-sm font-semibold py-2.5 rounded-xl2 transition-all duration-200 hover:bg-teal-light active:scale-95"
          >
            {isLast ? "Get started" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}