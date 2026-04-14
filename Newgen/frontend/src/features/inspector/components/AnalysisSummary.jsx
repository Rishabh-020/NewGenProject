/**
 * AnalysisSummary
 * ---------------
 * Informational callout box shown below the issue list.
 *
 * Props:
 *   summary — string  (AI-generated or static summary text)
 */
export default function AnalysisSummary({ summary }) {
  return (
    <div className="summary-box">
      <div className="summary-icon" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="#185FA5" strokeWidth="1.5" />
          <path d="M8 7v4M8 5v.5" stroke="#185FA5" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <p className="summary-text">{summary}</p>
    </div>
  );
}