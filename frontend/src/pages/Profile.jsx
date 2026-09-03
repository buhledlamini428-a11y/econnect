import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";
import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";
import TrustRing from "../components/TrustRing";
import ListingCard from "../components/ListingCard";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { id } = useParams();
  const { user: me, logout } = useAuth();
  const profileId = id || me.id;
  const isOwn = profileId === me.id;
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/users/${profileId}`).then((res) => setData(res.data));
  }, [profileId]);

  if (!data) return <div className="p-8 text-center text-teal">Loading...</div>;
  const { user, trustLevel, avgRating, ratingsCount } = data;

  return (
    <div className="min-h-screen bg-ivory page-scroll">
      <TopBar title="Profile" showBack={!isOwn} />
      <div className="px-4 py-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center font-display font-bold text-xl text-teal">
            {user.fullName[0]}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <h1 className="font-display font-bold text-lg text-ink">{user.fullName}</h1>
              {user.isVerifiedBadge && <span className="text-teal text-sm">✔</span>}
            </div>
            <p className="text-ink/50 text-sm">@{user.username} · {[user.city, user.region].filter(Boolean).join(", ")}</p>
          </div>
        </div>

        <div className="flex items-center justify-between bg-white rounded-xl2 p-3 mt-4 border border-black/5">
          <TrustRing score={user.trustScore} />
          <div className="text-right text-sm">
            <p className="font-semibold text-ink">{avgRating ? avgRating.toFixed(1) : "—"} ★ ({ratingsCount})</p>
            <p className="text-ink/50 text-xs">Member since {new Date(user.memberSince).getFullYear()}</p>
          </div>
        </div>

        {user.bio && <p className="text-ink/70 text-sm mt-4">{user.bio}</p>}

        {user.skills?.length > 0 && (
          <div className="mt-4">
            <h2 className="font-semibold text-ink text-sm mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((s) => (
                <span key={s.id} className="text-xs bg-ochre/10 text-ochre-dark px-3 py-1 rounded-full">{s.name}</span>
              ))}
            </div>
          </div>
        )}

        {isOwn && (
          <div className="flex gap-2 mt-5">
            <Link to="/edit-profile" className="flex-1 text-center border border-teal text-teal font-semibold py-2.5 rounded-xl2 text-sm">
              Edit profile
            </Link>
            <Link to="/premium" className="flex-1 text-center bg-ochre text-teal-dark font-semibold py-2.5 rounded-xl2 text-sm">
              Get verified
            </Link>
          </div>
        )}
        {isOwn && (
          <button onClick={logout} className="w-full text-center text-red-600 text-sm font-semibold mt-4">
            Log out
          </button>
        )}

        <h2 className="font-semibold text-ink text-sm mt-6 mb-2">Listings</h2>
                <div className="space-y-3">
          {user.listings?.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}