import { useState } from "react";

/**
 * IssueList
 * ---------
 * Renders a list of expandable IssueRow items.
 *
 * Props:
 *   issues — Array<Issue>  (shape from utils/mockData.js)
 */
export default function IssueList({ issues }) {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <div className="issues-list">
      {issues.map((issue) => (
        <IssueRow
          key={issue.id}
          issue={issue}
          isOpen={openId === issue.id}
          onToggle={() => toggle(issue.id)}
        />
      ))}
    </div>
  );
}

/**
 * IssueRow
 * --------
 * Single expandable issue card with inline fix steps.
 *
 * Props:
 *   issue    — Issue object
 *   isOpen   — boolean
 *   onToggle — () => void
 */
function IssueRow({ issue, isOpen, onToggle }) {
  const dotClass = {
    critical: "issue-dot--error",
    warning:  "issue-dot--warning",
    info:     "issue-dot--info",
  }[issue.severity] ?? "issue-dot--info";

  const tagClass = {
    critical: "tag--error",
    warning:  "tag--warning",
    info:     "tag--info",
  }[issue.severity] ?? "tag--info";

  const tagLabel = {
    critical: "Critical",
    warning:  "Warning",
    info:     "Info",
  }[issue.severity] ?? "Info";

  return (
    <div
      className={`issue-row ${isOpen ? "issue-row--expanded" : ""}`}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onToggle()}
      aria-expanded={isOpen}
    >
      <div className={`issue-dot ${dotClass}`} />

      <div className="issue-body">
        <p className="issue-title">{issue.title}</p>
        <div className="issue-meta">
          <span>{issue.category}</span>
          <span className="issue-meta__sep">·</span>
          <span>{issue.detail}</span>
        </div>

        {/* Expandable fix panel */}
        {isOpen && (
          <div className="fix-panel" onClick={(e) => e.stopPropagation()}>
            <p className="fix-label">How to fix</p>
            {issue.steps.map((step, i) => (
              <div key={i} className="fix-step">
                <div className="fix-num">{i + 1}</div>
                <p
                  className="fix-text"
                  dangerouslySetInnerHTML={{ __html: formatStep(step) }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="issue-right">
        <span className={`tag ${tagClass}`}>{tagLabel}</span>
        <span className={`chevron ${isOpen ? "chevron--open" : ""}`}>›</span>
      </div>
    </div>
  );
}

/**
 * Wraps `code` tokens (backtick-delimited) in <code> chips.
 * Input:  "Change `py-8` to `py-16`"
 * Output: "Change <code class='code-chip'>py-8</code> to <code class='code-chip'>py-16</code>"
 */
function formatStep(text) {
  return text.replace(/`([^`]+)`/g, "<code class='code-chip'>$1</code>");
}