 import { Link } from "react-router-dom";

export default function TopBar({ title, showBack = false }) {
  return (
    <div className="sticky top-0 z-10 bg-gradient-to-br from-teal to-teal-dark text-white px-4 py-4 shadow-md">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => window.history.back()}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/90
                       transition-all duration-200 hover:bg-white/20 hover:-translate-x-0.5"
            aria-label="Go back"
          >
            ←
          </button>
        )}
        <Link to="/home" className="flex items-center gap-2 shrink-0">
          <img src="/logo.png" alt="Netta" className="h-9 w-auto" />
        </Link>
        {title && (
          <>
            <span className="w-px h-5 bg-white/20 hidden sm:block" />
            <h1 className="font-display font-semibold text-base tracking-tight">{title}</h1>
          </>
        )}
      </div>
    </div>
  );
}