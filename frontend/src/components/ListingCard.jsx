import { Link } from "react-router-dom";
import { resolveMediaUrl } from "../utils/media";
import { timeAgo } from "../utils/timeAgo";
import { LISTING_TYPES } from "../constants/listingTypes";

export default function ListingCard({ listing }) {
  const photo = listing.photos ? resolveMediaUrl(JSON.parse(listing.photos)[0]) : null;
  const typeMeta = LISTING_TYPES[listing.type] || {};

  return (
    <Link
      to={`/listing/${listing.id}`}
      className="group flex bg-white rounded-xl2 shadow-sm border border-black/5 overflow-hidden
                 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
    >
      <div className={`w-32 sm:w-44 shrink-0 flex items-center justify-center overflow-hidden ${typeMeta.bg || "bg-teal/5"}`}>
        {photo ? (
          <img src={photo} alt={listing.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl opacity-60">{typeMeta.icon || "📦"}</span>
        )}
      </div>
      <div className="flex-1 p-3 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[11px] uppercase tracking-wide font-semibold text-ochre-dark bg-ochre/10 px-2 py-0.5 rounded-full">
            {typeMeta.singular || listing.type}
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
        <div className="flex items-center gap-1 mt-1">
          <h3 className="font-display font-semibold text-ink text-sm leading-snug line-clamp-2">{listing.title}</h3>
          {listing.user?.isVerifiedBadge && <span className="text-teal text-xs shrink-0" title="Verified user">✔</span>}
        </div>
        <p className="text-xs text-ink/60 mt-0.5">{[listing.city, listing.region].filter(Boolean).join(", ")}</p>
        {listing.description && (
          <p className="text-xs text-ink/50 mt-1 line-clamp-2 hidden sm:block">{listing.description}</p>
        )}
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="font-display font-bold text-teal text-sm">
            {listing.price ? `E${listing.price.toLocaleString()}${listing.priceType === "hourly" ? "/hr" : ""}` : "Contact for price"}
          </span>
          <span className="text-[11px] text-ink/40 flex items-center gap-2">
            {listing.viewsCount != null && <span>👁 {listing.viewsCount}</span>}
            <span>{timeAgo(listing.createdAt)}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}