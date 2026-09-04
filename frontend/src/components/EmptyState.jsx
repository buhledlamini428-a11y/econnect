export default function EmptyState({ icon = "📭", title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center text-center px-6 py-14">
      <span className="text-4xl mb-3">{icon}</span>
      <h3 className="font-display font-semibold text-ink text-base">{title}</h3>
      {description && <p className="text-ink/50 text-sm mt-1 max-w-xs">{description}</p>}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 bg-teal text-white text-sm font-semibold px-5 py-2.5 rounded-xl2
                     transition-all duration-200 hover:bg-teal-light hover:shadow-md active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}