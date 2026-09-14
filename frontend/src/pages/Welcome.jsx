 import { Link } from "react-router-dom";

const FEATURES = [
  { icon: "🛡️", label: "Safe & secure" },
  { icon: "🤝", label: "Community focused" },
  { icon: "⚡", label: "Easy to use" },
];

export default function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-ochre-light/10 to-ochre/20 flex flex-col">
      <div className="flex items-center justify-between px-6 pt-8">
        <div />
        <span className="hidden sm:flex items-center gap-1 text-xs font-medium text-teal bg-white/70 border border-teal/10 rounded-full px-3 py-1.5">
          🛡️ Trusted by thousands in Eswatini
        </span>
      </div>

      <div className="flex-1 flex flex-col items-start px-6 pt-6 pb-10 max-w-xl mx-auto w-full">
         <img src="/logo2.png" alt="Netta" className="h-14 w-auto mb-6" />
        <h1 className="font-display font-extrabold text-3xl md:text-4xl text-ink leading-tight">
          Find work. Offer services.<br />
          Buy & sell <span className="text-ochre-dark">locally</span>.
        </h1>
        <p className="text-ink/60 mt-3 max-w-md">
          Netta links people across Eswatini for jobs, short tasks, services, and everyday buying and selling — built on trust.
        </p>

        <div className="space-y-3 mt-6 w-full max-w-sm">
          <Link
            to="/register"
            className="flex items-center justify-center gap-2 w-full bg-teal text-white font-semibold py-3.5 rounded-xl2
                       transition-all duration-200 hover:bg-teal-light hover:shadow-lg hover:shadow-teal/30 hover:-translate-y-0.5
                       active:translate-y-0 active:shadow-md"
          >
            Create an account →
          </Link>
          <Link
            to="/login"
            className="block w-full text-center border border-teal/30 text-teal font-semibold py-3.5 rounded-xl2 bg-white
                       transition-all duration-200 hover:bg-teal hover:text-white hover:border-teal hover:shadow-lg hover:shadow-teal/20 hover:-translate-y-0.5
                       active:translate-y-0 active:shadow-md"
          >
            Log in
          </Link>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-6 text-xs text-ink/60">
          {FEATURES.map((f) => (
            <span key={f.label} className="flex items-center gap-1.5">
              <span>{f.icon}</span> {f.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}