import TopBar from "../components/TopBar";

export default function AboutNetta() {
  return (
    <div className="min-h-screen bg-ivory page-scroll">
      <TopBar title="About Netta" subtitle="Connection, opportunity, and trust" showBack />
      <div className="px-5 py-6 space-y-4">
        <img src="/logo1.png" alt="Netta" className="h-16 w-auto mx-auto mb-2" />
        <p className="text-ink/70 text-sm leading-relaxed">
          Netta is a community marketplace that connects people with jobs, services, buyers, sellers and opportunities.
        </p>
        <p className="text-ink/70 text-sm leading-relaxed">
          From finding someone to help in your garden for an hour, to looking for long-term work, offering your skills, 
          selling an item or finding something you need—Netta brings these connections together in one place.
        </p>
        <p className="text-ink/70 text-sm leading-relaxed">
          Built with Eswatini in mind and with a vision for Africa, Netta is designed to make
           everyday connections easier, safer and more accessible.
        </p>
        <p className="text-ink/70 text-sm leading-relaxed">
         Our mission: Connect people with opportunities, services and everyday needs.
        </p>
         <p className="text-ink/70 text-sm leading-relaxed">
         
         Netta — Connect. Find. Offer. Trade.
        </p>
        <p className="text-ink/40 text-xs text-center pt-4">Version 1.1.1 · Made for Eswatini 🇸🇿</p>
      </div>
    </div>
  );
}