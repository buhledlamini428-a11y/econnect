export default function TrustRing({ score = 50, size = 56 }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const level =
    score >= 85 ? "Excellent" : score >= 70 ? "Good" : score >= 50 ? "Average" : score >= 30 ? "Low" : "Restricted";
  const color =
    score >= 85 ? "#4F3FE0" : score >= 70 ? "#6D5DFB" : score >= 50 ? "#9B8CFF" : score >= 30 ? "#C9784F" : "#B4432E";

  return (
    <div className="flex items-center gap-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#EAE7F7" strokeWidth="6" />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle" fontSize={size * 0.28} fontWeight="700" fill="#1B1730">
          {score}
        </text>
      </svg>
      <div className="text-xs">
        <div className="font-semibold text-ink">Trust Score</div>
        <div style={{ color }}>{level}</div>
      </div>
    </div>
  );
}