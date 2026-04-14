/**
 * ScoreRing
 * ---------
 * Circular progress ring showing the overall accuracy score.
 *
 * Props:
 *   score  — number 0–100
 *   size   — number (px), default 64
 */
export default function ScoreRing({ score, size = 64 }) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 85 ? "#639922" :
    score >= 60 ? "#EF9F27" :
                  "#E24B4A";

  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 64 64" style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx="32" cy="32" r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="5"
        />
        <circle
          cx="32" cy="32" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
      <div className="score-ring__label">
        <span className="score-ring__num">{score}</span>
        <span className="score-ring__pct">/ 100</span>
      </div>
    </div>
  );
}