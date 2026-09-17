import TopBar from "../components/TopBar";

const CHANNELS = [
  { icon: "✉️", label: "Email", value: "support@netta.app", href: "mailto:support@netta.app" },
  { icon: "📞", label: "Phone", value: "+268 7600 0000", href: "tel:+26876000000" },
  { icon: "📍", label: "Location", value: "Mbabane, Eswatini", href: null },
];

export default function ContactInfo() {
  return (
    <div className="min-h-screen bg-ivory page-scroll">
      <TopBar title="Contact info" subtitle="Ways to reach the Netta team" showBack />
      <div className="px-4 py-4 space-y-3">
        {CHANNELS.map((c) => {
          const content = (
            <div className="flex items-center gap-3 bg-white rounded-xl2 p-4 border border-black/5 transition-all duration-200 hover:shadow-md">
              <span className="text-xl shrink-0">{c.icon}</span>
              <div>
                <p className="font-semibold text-ink text-sm">{c.label}</p>
                <p className="text-ink/60 text-sm">{c.value}</p>
              </div>
            </div>
          );
          return c.href ? (
            <a key={c.label} href={c.href}>{content}</a>
          ) : (
            <div key={c.label}>{content}</div>
          );
        })}
      </div>
    </div>
  );
}