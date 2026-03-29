"use client";

interface ReliabilityBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

function getColor(score: number) {
  if (score >= 80) return { text: "text-[var(--color-green)]", bg: "bg-[var(--color-green-bg)]", stroke: "var(--color-green)" };
  if (score >= 60) return { text: "text-[var(--color-yellow)]", bg: "bg-[var(--color-yellow-bg)]", stroke: "var(--color-yellow)" };
  return { text: "text-[var(--color-red)]", bg: "bg-[var(--color-red-bg)]", stroke: "var(--color-red)" };
}

function getTier(score: number) {
  if (score >= 80) return "A";
  if (score >= 60) return "B";
  if (score >= 40) return "C";
  return "D";
}

export default function ReliabilityBadge({ score, size = "sm" }: ReliabilityBadgeProps) {
  const c = getColor(score);

  if (size === "sm") {
    return (
      <span className={`inline-flex items-center text-[11px] font-bold px-1.5 py-0.5 rounded ${c.bg} ${c.text}`}>
        {score}
      </span>
    );
  }

  if (size === "md") {
    return (
      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md ${c.bg} ${c.text}`}>
        {score}
        <span className="opacity-70">{getTier(score)}</span>
      </span>
    );
  }

  // size === "lg" — with SVG arc
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-10 h-10">
        <svg viewBox="0 0 40 40" className="w-10 h-10 -rotate-90">
          <circle
            cx="20" cy="20" r={radius}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="3"
          />
          <circle
            cx="20" cy="20" r={radius}
            fill="none"
            stroke={c.stroke}
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${c.text}`}>
          {score}
        </span>
      </div>
      <div className="text-xs">
        <div className={`font-semibold ${c.text}`}>Tier {getTier(score)}</div>
        <div className="text-[var(--color-text-muted)]">
          {score >= 80 ? "Yuksek" : score >= 60 ? "Orta" : "Dusuk"}
        </div>
      </div>
    </div>
  );
}
