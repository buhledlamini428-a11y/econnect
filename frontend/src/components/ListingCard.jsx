import { Link } from "react-router-dom";

const TYPE_LABEL = { JOB: "Job", TASK: "Task", SERVICE: "Service", PRODUCT: "Product", REQUEST: "Request" };

export default function ListingCard({ listing }) {
  const photo = listing.photos ? JSON.parse(listing.photos)[0] : null;

  return (
       <Link
      to={`/listing/${listing.id}`}
      className="group flex bg-white rounded-xl2 shadow-sm border border-black/5 overflow-hidden
                 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="w-32 sm:w-44 shrink-0 bg-teal/5 flex items-center justify-center overflow-hidden">
        {photo ? (
          <img src={photo} alt={listing.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-teal/40 font-display text-xs px-2 text-center">No photo</span>
        )}
      </div>
      <div className="flex-1 p-3 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[11px] uppercase tracking-wide font-semibold text-ochre-dark bg-ochre/10 px-2 py-0.5 rounded-full">
            {TYPE_LABEL[listing.type]}
          </span>
                    <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="text-ink/30 text-lg leading-none transition-all duration-200 hover:text-ochre-dark hover:scale-125"
            aria-label="Save listing"
          >
            ♡
          </button>
        </div>
        <h3 className="font-display font-semibold text-ink text-sm leading-snug mt-1 line-clamp-2">{listing.title}</h3>
        <p className="text-xs text-ink/60 mt-0.5">{[listing.city, listing.region].filter(Boolean).join(", ")}</p>
        {listing.description && (
          <p className="text-xs text-ink/50 mt-1 line-clamp-2 hidden sm:block">{listing.description}</p>
        )}
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="font-display font-bold text-teal text-sm">
            {listing.price ? `E${listing.price.toLocaleString()}${listing.priceType === "hourly" ? "/hr" : ""}` : "Contact for price"}
          </span>
                   <span className="text-xs font-semibold text-teal flex items-center gap-1 transition-all duration-200 group-hover:gap-2">
            View details →
          </span>
        </div>
      </div>
    </Link>
  );
}