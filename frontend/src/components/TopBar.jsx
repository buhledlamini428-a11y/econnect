import { Link } from "react-router-dom";

export default function TopBar({ title, showBack = false }) {
  return (
    <div className="sticky top-0 z-10 bg-teal text-white px-4 py-4 flex items-center gap-3 shadow-sm min-h-[88px]">
      {showBack ? (
        <button onClick={() => window.history.back()} className="text-white/90 text-lg">←</button>
      ) : (
        <Link to="/home" className="flex items-center gap-2">
          <img src="/logo.png" alt="E-connect" className="h-16 w-auto" />
        </Link>
      )}
      {title && <h1 className="font-display font-semibold text-base">{title}</h1>}
    </div>
  );
}