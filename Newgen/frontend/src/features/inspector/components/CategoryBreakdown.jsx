/**
 * CategoryBreakdown
 * -----------------
 * 2-column grid of score bars per analysis category.
 *
 * Props:
 *   categories — Array<{ name, score, criticalCount, warningCount }>
 */
export default function CategoryBreakdown({ categories }) {
  return (
    <div className="cat-grid">
      {categories.map((cat) => {
        const color =
          cat.score >= 85 ? "#639922" :
          cat.score >= 60 ? "#EF9F27" :
                            "#E24B4A";

        const scoreColor =
          cat.score >= 85 ? "var(--color-success)" :
          cat.score >= 60 ? "var(--color-warning)" :
                            "var(--color-danger)";

        return (
          <div key={cat.name} className="cat-card">
            <div className="cat-card__header">
              <span className="cat-card__name">{cat.name}</span>
              <span className="cat-card__score" style={{ color: scoreColor }}>
                {cat.score}%
              </span>
            </div>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{ width: `${cat.score}%`, background: color }}
              />
            </div>
            <p className="cat-card__issues">
              {cat.criticalCount} critical · {cat.warningCount} warning{cat.warningCount !== 1 ? "s" : ""}
            </p>
          </div>
        );
      })}
    </div>
  );
}