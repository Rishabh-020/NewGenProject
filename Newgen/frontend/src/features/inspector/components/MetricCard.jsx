/**
 * MetricCard
 * ----------
 * Small stat surface used in the top summary grid.
 *
 * Props:
 *   label    — string
 *   value    — string | number
 *   sub      — string (caption below value)
 *   variant  — "danger" | "warn" | "good" | undefined (neutral)
 */
export default function MetricCard({ label, value, sub, variant }) {
  return (
    <div className={`metric-card ${variant ? `metric-card--${variant}` : ""}`}>
      <p className="metric-card__label">{label}</p>
      <p className="metric-card__value">{value}</p>
      {sub && <p className="metric-card__sub">{sub}</p>}
    </div>
  );
}