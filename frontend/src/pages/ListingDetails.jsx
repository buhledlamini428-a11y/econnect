import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/client";
import TopBar from "../components/TopBar";
import TrustRing from "../components/TrustRing";
import { useAuth } from "../context/AuthContext";

export default function ListingDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/listings/${id}`).then((res) => setListing(res.data.listing));
  }, [id]);

  async function handleContact() {
    if (!user) return navigate("/login");
    try {
      await api.post("/messages", { recipientId: listing.userId, listingId: listing.id, content: message || `Hi, I'm interested in "${listing.title}"` });
      setSent(true);
    } catch {}
  }

  async function handleApply() {
    if (!user) return navigate("/login");
    await api.post(`/listings/${id}/apply`, { message });
    setSent(true);
  }

  if (!listing) return <div className="p-8 text-center text-teal">Loading...</div>;
  const photos = listing.photos ? JSON.parse(listing.photos) : [];

  return (
    <div className="min-h-screen bg-ivory page-scroll">
      <TopBar title="Listing" showBack />
      <div className="h-56 bg-teal/5 flex items-center justify-center">
        {photos[0] ? <img src={photos[0]} className="w-full h-full object-cover" alt="" /> : <span className="text-teal/40">No photo</span>}
      </div>

      <div className="px-4 py-4">
        <span className="text-[11px] uppercase tracking-wide font-semibold text-ochre-dark bg-ochre/10 px-2 py-0.5 rounded-full">
          {listing.type}
        </span>
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

        <Link to={`/profile/${listing.user.id}`} className="flex items-center justify-between bg-white rounded-xl2 p-3 mt-5 border border-black/5">
          <div>
            <p className="font-semibold text-ink text-sm">{listing.user.fullName}</p>
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
              <button onClick={handleApply} className="w-full bg-teal text-white font-semibold py-3 rounded-xl2">Apply now</button>
            ) : (
              <button onClick={handleContact} className="w-full bg-teal text-white font-semibold py-3 rounded-xl2">Contact</button>
            )}
            <Link to={`/report?listingId=${listing.id}`} className="block text-center text-sm text-red-600 mt-2">
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