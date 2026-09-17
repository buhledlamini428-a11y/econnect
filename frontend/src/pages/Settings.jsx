import { useState } from "react";
import { Link } from "react-router-dom";
import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";
import { useTheme } from "../context/ThemeContext";

const APP_VERSION = "1.1.1";

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`w-11 h-6 rounded-full transition-colors duration-200 relative shrink-0 ${checked ? "bg-teal" : "bg-black/15"}`}
      aria-pressed={checked}
    >
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}

function Row({ icon, label, description, right, to }) {
  const content = (
    <div className="flex items-center gap-3 bg-white rounded-xl2 p-4 border border-black/5 transition-all duration-200 hover:shadow-md">
      <span className="text-xl shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-ink text-sm">{label}</p>
        {description && <p className="text-ink/50 text-xs mt-0.5">{description}</p>}
      </div>
      {right}
    </div>
  );
  if (to) return <Link to={to}>{content}</Link>;
  return content;
}

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [notifyMessages, setNotifyMessages] = useState(true);
  const [notifyApplications, setNotifyApplications] = useState(true);
  const [notifyRatings, setNotifyRatings] = useState(true);
  const [notifyAccount, setNotifyAccount] = useState(true);

  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-ivory page-scroll">
      <TopBar title="Settings" subtitle="Manage your app preferences" showBack />

      <div className="px-4 py-4 space-y-6">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-2 px-1">Appearance</h2>
          <Row
            icon="🌙"
            label="Dark mode"
            description="Easier on the eyes at night"
            right={<Toggle checked={theme === "dark"} onChange={toggleTheme} />}
          />
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-2 px-1">Notification preferences</h2>
          <div className="space-y-2">
            <Row icon="💬" label="Messages" description="New messages from other users" right={<Toggle checked={notifyMessages} onChange={() => setNotifyMessages((v) => !v)} />} />
            <Row icon="📋" label="Applications" description="Updates on jobs you applied to" right={<Toggle checked={notifyApplications} onChange={() => setNotifyApplications((v) => !v)} />} />
            <Row icon="⭐" label="Ratings & reviews" description="When someone rates you" right={<Toggle checked={notifyRatings} onChange={() => setNotifyRatings((v) => !v)} />} />
            <Row icon="⚠️" label="Account alerts" description="Verification and account status changes" right={<Toggle checked={notifyAccount} onChange={() => setNotifyAccount((v) => !v)} />} />
          </div>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-2 px-1">Support</h2>
          <div className="space-y-2">
            <Row icon="📞" label="Contact info" description="Ways to reach the Netta team" to="/settings/contact" right={<span className="text-ink/30">›</span>} />
            <Row icon="💁" label="Help & support" description="Guides and answers to common questions" to="/settings/help" right={<span className="text-ink/30">›</span>} />
          </div>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-2 px-1">About</h2>
          <Row icon="ℹ️" label="About Netta" description="Learn more about the app and its mission" to="/settings/about" right={<span className="text-ink/30">›</span>} />
        </div>

        <div className="flex items-center justify-center gap-1.5 text-ink/40 text-xs pt-4 pb-2">
          <span>©</span>
          <span>{year} Netta</span>
          <span>·</span>
          <span>Version {APP_VERSION}</span>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}