import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import HomeHeader from "../components/HomeHeader";
import BottomNav from "../components/BottomNav";
import ListingCard from "../components/ListingCard";
import { ListingCardSkeletonList } from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import OnboardingCarousel from "../components/OnboardingCarousel";
import { LISTING_TYPE_LIST } from "../constants/listingTypes";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/listings", { params: { pageSize: 10 } })
      .then((res) => setListings(res.data.listings))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-ivory page-scroll">
      <OnboardingCarousel />
      <HomeHeader />

      <div className="px-4 py-5">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {LISTING_TYPE_LIST.map((q) => (
            <button
              key={q.value}
              onClick={() => navigate(`/explore?type=${q.value}`)}
              className="group flex flex-col items-center gap-2 bg-white rounded-xl2 py-4 px-2 shadow-sm text-center
                         border border-transparent transition-all duration-200
                         hover:shadow-md hover:-translate-y-1 hover:border-teal/10 active:translate-y-0"
            >
              <span className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-colors duration-200 ${q.bg} ${q.hoverBg}`}>
                {q.icon}
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink">{q.label}</span>
                <span className="block text-[11px] text-ink/50">{q.subtitle}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mt-6 mb-3">
          <h2 className="font-display font-semibold text-ink flex items-center gap-1.5">
            <span className="text-ochre-dark">★</span> Recommended near you
          </h2>
          <button
            onClick={() => navigate("/explore")}
            className="text-sm font-semibold text-teal transition-all duration-200 hover:text-teal-light hover:gap-2 flex items-center gap-1"
          >
            See all →
          </button>
        </div>

        {loading ? (
          <ListingCardSkeletonList count={4} />
        ) : listings.length === 0 ? (
          <EmptyState
            icon="🧭"
            title="Nothing here yet"
            description="Be the first to post a job, service, or item in your area."
            actionLabel="Post a listing"
            onAction={() => navigate("/post")}
          />
        ) : (
          <div className="space-y-3">
            {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </div>

      <button
        onClick={() => navigate("/post")}
        className="fixed bottom-24 right-5 brand-mark text-white font-bold w-14 h-14 rounded-full shadow-lg text-2xl z-20
                   transition-all duration-200 hover:shadow-xl hover:scale-110 active:scale-95"
        aria-label="Post a listing"
      >
        +
      </button>
      <BottomNav />
    </div>
  );
}