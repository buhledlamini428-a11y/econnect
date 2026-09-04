// Single source of truth for listing-type labels, icons, and colors —
// reused across Home quick-buttons, Explore tabs, Post type picker, and card placeholders.
export const LISTING_TYPES = {
  JOB: { label: "Jobs", singular: "Job", subtitle: "Find opportunities", icon: "💼", bg: "bg-teal/10", hoverBg: "group-hover:bg-teal/20" },
  TASK: { label: "Tasks", singular: "Task", subtitle: "Get things done", icon: "🛠️", bg: "bg-blue-500/10", hoverBg: "group-hover:bg-blue-500/20" },
  SERVICE: { label: "Services", singular: "Service", subtitle: "Professional help", icon: "🧰", bg: "bg-pink-500/10", hoverBg: "group-hover:bg-pink-500/20" },
  PRODUCT: { label: "Buy & Sell", singular: "Product", subtitle: "Discover deals", icon: "🛍️", bg: "bg-sky-500/10", hoverBg: "group-hover:bg-sky-500/20" },
  REQUEST: { label: "Requests", singular: "Request", subtitle: "Post a request", icon: "📣", bg: "bg-ochre/10", hoverBg: "group-hover:bg-ochre/20" },
};

export const LISTING_TYPE_LIST = Object.entries(LISTING_TYPES).map(([value, meta]) => ({ value, ...meta }));