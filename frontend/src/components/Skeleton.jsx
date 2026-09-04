export function ListingCardSkeleton() {
  return (
    <div className="flex bg-white rounded-xl2 shadow-sm border border-black/5 overflow-hidden animate-pulse">
      <div className="w-32 sm:w-44 shrink-0 bg-black/5" />
      <div className="flex-1 p-3 space-y-2">
        <div className="h-4 w-16 bg-black/10 rounded-full" />
        <div className="h-4 w-3/4 bg-black/10 rounded" />
        <div className="h-3 w-1/2 bg-black/5 rounded" />
        <div className="h-3 w-2/3 bg-black/5 rounded" />
        <div className="h-4 w-20 bg-black/10 rounded mt-3" />
      </div>
    </div>
  );
}

export function ListingCardSkeletonList({ count = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => <ListingCardSkeleton key={i} />)}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-4 px-4 py-5">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-black/10" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 bg-black/10 rounded" />
          <div className="h-3 w-40 bg-black/5 rounded" />
        </div>
      </div>
      <div className="h-16 bg-black/5 rounded-xl2" />
      <div className="h-4 w-full bg-black/5 rounded" />
      <div className="h-4 w-2/3 bg-black/5 rounded" />
    </div>
  );
}

export function MessageListSkeleton({ count = 5 }) {
  return (
    <div className="space-y-2 px-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 bg-white rounded-xl2 p-3 border border-black/5 animate-pulse">
          <div className="w-11 h-11 rounded-full bg-black/10" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 bg-black/10 rounded" />
            <div className="h-3 w-2/3 bg-black/5 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}