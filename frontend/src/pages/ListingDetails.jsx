import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/client";
import TopBar from "../components/TopBar";
import TrustRing from "../components/TrustRing";
import { resolveMediaUrl } from "../utils/media";
import { timeAgo } from "../utils/timeAgo";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function ListingDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/listings/${id}`).then((res) => setListing(res.data.listing));
  }, [id]);

  async function handleContact() {
    if (!user) return navigate("/login");
    try {
      await api.post("/messages", { recipientId: listing.userId, listingId: listing.id, content: message || `Hi, I'm interested in "${listing.title}"` });
      setSent(true);
      showToast("Message sent! Check your Messages tab.");
    } catch {
      showToast("Could not send message", "error");
    }
  }

  async function handleApply() {
    if (!user) return navigate("/login");
    try {
      await api.post(`/listings/${id}/apply`, { message });
      setSent(true);
      showToast("Application sent!");
    } catch (err) {
      showToast(err.response?.data?.error || "Could not apply", "error");
    }
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-ivory">
        <TopBar title="Listing" showBack />
        <div className="h-56 bg-black/5 animate-pulse" />
        <div className="px-4 py-4 space-y-3 animate-pulse">
          <div className="h-4 w-16 bg-black/10 rounded-full" />
          <div className="h-5 w-2/3 bg-black/10 rounded" />
          <div className="h-4 w-1/3 bg-black/5 rounded" />
          <div className="h-20 bg-black/5 rounded-xl2" />
        </div>
      </div>
    );
  }

  const photos = listing.photos ? JSON.parse(listing.photos).map(resolveMediaUrl) : [];

  return (
    <div className="min-h-screen bg-ivory page-scroll">
      <TopBar title="Listing" showBack />

      <div className="relative h-56 bg-teal/5 flex items-center justify-center overflow-hidden">
        {photos.length > 0 ? (
          <>
            <img src={photos[photoIndex]} className="w-full h-full object-cover" alt="" />
            {photos.length > 1 && (
              <>
                <button
                  onClick={() => setPhotoIndex((i) => (i - 1 + photos.length) % photos.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white w-8 h-8 rounded-full flex items-center justify-center"
                >‹</button>
                <button
                  onClick={() => setPhotoIndex((i) => (i + 1) % photos.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white w-8 h-8 rounded-full flex items-center justify-center"
                >›</button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {photos.map((_, i) => (
                    <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === photoIndex ? "bg-white" : "bg-white/40"}`} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <span className="text-teal/40 text-5xl">📦</span>
        )}
      </div>

      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wide font-semibold text-ochre-dark bg-ochre/10 px-2 py-0.5 rounded-full">
            {listing.type}
          </span>
          <span className="text-xs text-ink/40 flex items-center gap-2">
            {listing.viewsCount != null && <span>👁 {listing.viewsCount} views</span>}
            <span>{timeAgo(listing.createdAt)}</span>
          </span>
        </div>
        <h1 className="font-display font-bold text-xl text-ink mt-2">{listing.title}</h1>
        <p className="text-ink/60 text-sm">{[listing.city, listing.region].filter(Boolean).join(", ")}</p>
        <p className="font-display font-bold text-teal text-lg mt-2">
          {listing.price ? `E${listing.price.toLocaleString()}${listing.priceType === "hourly" ? "/hr" : ""}` : "Contact for price"}
        </p>

        <div className="mt-4">
          <h2 className="font-semibold text-ink mb-1">Description</h2>
          <p className="text-ink/70 text-sm whitespace-pre-line">{listing.description}</p>
        </div>

        {listing.type === "JOB" && (
          <div className="mt-4 text-sm text-ink/70 space-y-1">
            {listing.employmentType && <p><strong>Type:</strong> {listing.employmentType}</p>}
            {listing.vacancies && <p><strong>Vacancies:</strong> {listing.vacancies}</p>}
            {listing.requirements && <p><strong>Requirements:</strong> {listing.requirements}</p>}
          </div>
        )}
        {(listing.type === "TASK" || listing.type === "SERVICE") && listing.durationValue && (
          <p className="mt-3 text-sm text-ink/70">
            <strong>Duration:</strong> {listing.durationValue} {listing.durationUnit}
          </p>
        )}
        {listing.type === "PRODUCT" && listing.condition && (
          <p className="mt-3 text-sm text-ink/70"><strong>Condition:</strong> {listing.condition}</p>
        )}

        <Link
          to={`/profile/${listing.user.id}`}
          className="flex items-center justify-between bg-white rounded-xl2 p-3 mt-5 border border-black/5
                     transition-all duration-200 hover:shadow-md"
        >
          <div>
            <div className="flex items-center gap-1">
              <p className="font-semibold text-ink text-sm">{listing.user.fullName}</p>
              {listing.user.isVerifiedBadge && <span className="text-teal text-xs" title="Verified user">✔</span>}
            </div>
            <p className="text-xs text-ink/50">Member since {new Date(listing.user.memberSince).getFullYear()}</p>
          </div>
          <TrustRing score={listing.user.trustScore} size={48} />
        </Link>

        {!sent ? (
          <div className="mt-5 space-y-2">
            <textarea
              value={message} onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a message..."
              className="w-full border border-black/10 rounded-xl px-3 py-2 text-sm bg-white" rows={3}
            />
            {listing.type === "JOB" ? (
              <button
                onClick={handleApply}
                className="w-full bg-teal text-white font-semibold py-3 rounded-xl2 transition-all duration-200 hover:bg-teal-light hover:shadow-md active:scale-95"
              >
                Apply now
              </button>
            ) : (
              <button
                onClick={handleContact}
                className="w-full bg-teal text-white font-semibold py-3 rounded-xl2 transition-all duration-200 hover:bg-teal-light hover:shadow-md active:scale-95"
              >
                Contact
              </button>
            )}
            <Link to={`/report?listingId=${listing.id}`} className="block text-center text-sm text-red-600 mt-2 hover:underline">
              Report this listing
            </Link>
          </div>
        ) : (
          <p className="mt-5 bg-teal/10 text-teal font-medium text-sm p-3 rounded-xl2">
            {listing.type === "JOB" ? "Application sent!" : "Message sent! Check your Messages tab."}
          </p>
        )}
      </div>
    </div>
  );
}