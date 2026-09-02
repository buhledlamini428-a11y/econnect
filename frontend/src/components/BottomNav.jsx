import { NavLink } from "react-router-dom";

const items = [
  { to: "/home", label: "Home", icon: "🏠" },
  { to: "/explore", label: "Explore", icon: "🧭" },
  { to: "/post", label: "Post", icon: "➕" },
  { to: "/messages", label: "Messages", icon: "💬" },
  { to: "/profile", label: "Profile", icon: "👤" },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-black/5 flex justify-around py-2 z-20">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center text-xs gap-0.5 px-2 py-1 ${isActive ? "text-teal font-semibold" : "text-ink/50"}`
          }
        >
          <span className="text-lg">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}