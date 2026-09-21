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
            className="w-11 h-11 shrink-0 rounded-full bg-white/15 flex items-center justify-center text-white
                       transition-all duration-200 hover:bg-white/25 hover:-translate-x-0.5"
            aria-label="Go back"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
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