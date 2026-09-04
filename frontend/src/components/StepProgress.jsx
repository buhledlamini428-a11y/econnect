export default function StepProgress({ step, total, labels }) {
  return (
    <div className="mb-6">
      <div className="flex gap-1.5 mb-2">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i < step ? "bg-teal" : "bg-black/10"}`} />
        ))}
      </div>
      <p className="text-xs text-ink/50 font-medium">Step {step} of {total}{labels?.[step - 1] ? ` — ${labels[step - 1]}` : ""}</p>
    </div>
  );
}