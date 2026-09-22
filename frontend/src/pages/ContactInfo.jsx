import TopBar from "../components/TopBar";

const CHANNELS = [
  { icon: "✉️", label: "Email", value: "nettainformation@gmail.com", href: "mailto:nettainformation@gmail.com" },
  { icon: "📞", label: "Phone", value: "+268 7667 2068/7690 6432", href: "tel:+26876672068" },
  { icon: "📍", label: "Location", value: "Mbabane, Eswatini", href: null },
];

export default function ContactInfo() {
  return (
    <div className="min-h-screen bg-ivory page-scroll">
      <TopBar title="Contact info" subtitle="Ways to reach the Netta team" showBack />
      <div className="px-4 py-4 space-y-3">
        {CHANNELS.map((c) => {
                     const content = (
            <div className="flex items-center gap-3 bg-white rounded-xl2 p-4 border border-black/5 min-h-[68px] transition-all duration-200 hover:shadow-md">
              <span className="w-8 h-8 flex items-center justify-center text-xl shrink-0">{c.icon}</span>
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