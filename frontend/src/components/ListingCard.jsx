import { Link } from "react-router-dom";

const TYPE_LABEL = { JOB: "Job", TASK: "Task", SERVICE: "Service", PRODUCT: "Product", REQUEST: "Request" };

export default function ListingCard({ listing }) {
  const photo = listing.photos ? JSON.parse(listing.photos)[0] : null;

  return (
    <Link
      to={`/listing/${listing.id}`}
      className="block bg-white rounded-xl2 shadow-sm border border-black/5 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="h-36 bg-teal/5 flex items-center justify-center overflow-hidden">
        {photo ? (
          <img src={photo} alt={listing.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-teal/40 font-display text-sm">No photo</span>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] uppercase tracking-wide font-semibold text-ochre-dark bg-ochre/10 px-2 py-0.5 rounded-full">
            {TYPE_LABEL[listing.type]}
          </span>
          {listing.isFeatured && (
            <span className="text-[11px] font-semibold text-teal">★ Featured</span>
          )}
        </div>
        <h3 className="font-display font-semibold text-ink text-sm leading-snug line-clamp-2">{listing.title}</h3>
        <p className="text-xs text-ink/60 mt-1">{[listing.city, listing.region].filter(Boolean).join(", ")}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="font-display font-bold text-teal text-sm">
            {listing.price ? `E${listing.price.toLocaleString()}${listing.priceType === "hourly" ? "/hr" : ""}` : "Contact for price"}
          </span>
          {listing.user?.isVerifiedBadge && <span className="text-xs text-teal">✔ Verified</span>}
        </div>
      </div>
    </Link>
  );
}