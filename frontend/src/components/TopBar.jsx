export default function TopBar({ title, subtitle, showBack = false }) {
  return (
    <div
      className="sticky top-0 z-10 text-white px-5 pt-6 pb-6 shadow-md bg-teal-dark"
      style={{
        backgroundImage: "url('/topbar-bg.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex items-start gap-3">
        {showBack && (
          <button
            onClick={() => window.history.back()}
            className="w-11 h-11 shrink-0 rounded-full bg-white/15 flex items-center justify-center text-white text-lg
                       transition-all duration-200 hover:bg-white/25 hover:-translate-x-0.5"
            aria-label="Go back"
          >
            ←
          </button>
        )}
        <div className="min-w-0">
          <h1 className="font-display font-extrabold text-2xl leading-tight tracking-tight">{title}</h1>
          {subtitle && <p className="text-white/70 text-sm mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}