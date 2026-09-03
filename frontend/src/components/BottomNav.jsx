 import { NavLink } from "react-router-dom";

const items = [
  { to: "/home", label: "Home", icon: "🏠" },
  { to: "/explore", label: "Explore", icon: "🧭" },
  { to: "/post", label: "Post", icon: "➕" },
  { to: "/messages", label: "Messages", icon: "💬" },
  { to: "/profile", label: "Profile", icon: "👤" },
];

export default function BottomNav({ hasUnreadMessages = false }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center px-3 pb-3 z-20">
      <nav className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-black/5 flex justify-around py-2.5">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `relative flex flex-col items-center text-xs gap-0.5 px-3 py-1 rounded-xl transition-all duration-200
               hover:bg-teal/5 hover:-translate-y-0.5
               ${isActive ? "text-teal font-semibold" : "text-ink/50"}`
            }
          >
            <span className="text-lg transition-transform duration-200">{item.icon}</span>
            {item.label}
            {item.to === "/messages" && hasUnreadMessages && (
              <span className="absolute top-0 right-1.5 w-2 h-2 bg-ochre rounded-full" />
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}